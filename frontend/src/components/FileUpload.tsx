import React, { useRef, useState, useCallback, DragEvent } from 'react';

interface FileUploadProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  accept?: string;
  multiple?: boolean;
}

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const FileUpload: React.FC<FileUploadProps> = ({ files, setFiles, accept = '.pdf', multiple = true }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (multiple) {
        setFiles(prevFiles => [...prevFiles, ...newFiles]);
      } else {
        setFiles(newFiles.slice(0, 1));
      }
    }
  };
  
  const onDragAndDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
  }, []);

  const onDragOverContainer = useCallback((e: DragEvent<HTMLDivElement>) => {
    onDragAndDrop(e);
    setIsDraggingOver(true);
  }, [onDragAndDrop]);

  const onDragLeaveContainer = useCallback((e: DragEvent<HTMLDivElement>) => {
    onDragAndDrop(e);
    setIsDraggingOver(false);
  }, [onDragAndDrop]);

  const onDropContainer = useCallback((e: DragEvent<HTMLDivElement>) => {
    onDragAndDrop(e);
    setIsDraggingOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    
    if (droppedFiles.length) {
      if (multiple) {
        setFiles(prevFiles => [...prevFiles, ...droppedFiles]);
      } else {
        setFiles(droppedFiles.slice(0, 1));
      }
    }
  }, [multiple, setFiles, onDragAndDrop]);

  const handleRemoveFile = (indexToRemove: number) => {
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };
  
  const handleSelectFilesClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div 
        onDragOver={onDragOverContainer}
        onDragLeave={onDragLeaveContainer}
        onDrop={onDropContainer}
        className={`bg-secondary border-2 border-dashed border-border rounded-lg p-8 text-center transition-all duration-300
                    ${isDraggingOver ? 'border-primary bg-primary/10 scale-105' : ''}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          multiple={multiple}
          className="hidden"
          data-testid="file-upload-input"
        />
        <div className="flex flex-col items-center justify-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-text-secondary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 15l-4-4m0 0l4-4m-4 4h12" /></svg>
            <button
            type="button"
            onClick={handleSelectFilesClick}
            className="bg-primary pointer-events-auto text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-hover transition-colors"
            >
            Select PDF Files
            </button>
            <p className="mt-2 text-sm text-text-secondary">or drag and drop files here</p>
        </div>
      </div>
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
                <h4 className="font-semibold text-text-secondary">
                  Selected Files ({files.length})
                </h4>
                {multiple && files.length > 1 && (
                    <button
                        onClick={() => setFiles([])}
                        className="text-sm text-red-500 hover:underline"
                        aria-label="Remove all selected files"
                    >
                        Clear All
                    </button>
                )}
            </div>
            <ul className="bg-secondary rounded-lg p-4 space-y-2 max-h-60 overflow-y-auto">
            {files.map((file, index) => (
                <li 
                    key={`${file.name}-${index}`} 
                    className="flex justify-between items-center text-sm p-2 bg-background rounded"
                >
                  <span className="truncate" title={file.name}>{file.name}</span>
                  <div className="flex items-center flex-shrink-0 ml-4">
                    <span className="text-xs text-text-secondary mr-4">{formatBytes(file.size)}</span>
                    <button
                        onClick={() => handleRemoveFile(index)}
                        className="text-red-500 hover:text-red-400 font-bold"
                        aria-label={`Remove ${file.name}`}
                    >
                        &times;
                    </button>
                  </div>
                </li>
              ))}
            </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;