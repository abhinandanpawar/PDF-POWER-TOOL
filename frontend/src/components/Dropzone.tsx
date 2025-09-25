import React, { useRef, useState, useCallback, DragEvent } from 'react';

interface DropzoneProps {
  onFile: (file: File) => void;
  accept?: string;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onFile, accept }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFile(e.target.files[0]);
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFile(e.dataTransfer.files[0]);
    }
  }, [onFile, onDragAndDrop]);

  const handleSelectFilesClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragOver={onDragOverContainer}
      onDragLeave={onDragLeaveContainer}
      onDrop={onDropContainer}
      className={`bg-secondary border-2 border-dashed border-border rounded-lg p-8 text-center transition-all duration-300
                  ${isDraggingOver ? 'border-primary bg-primary/10 scale-105' : ''}`}
      onClick={handleSelectFilesClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && handleSelectFilesClick()}
      data-testid="dropzone"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />
      <div className="flex flex-col items-center justify-center pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-text-secondary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 15l-4-4m0 0l4-4m-4 4h12" /></svg>
        <p className="font-bold text-lg text-text-primary">Select an image</p>
        <p className="mt-2 text-sm text-text-secondary">or drag and drop an image here</p>
      </div>
    </div>
  );
};
