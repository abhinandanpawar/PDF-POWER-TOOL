import React, { useState } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import { convertPdfToWord } from '../services/apiService';
import { useToasts } from '../hooks/useToasts';
import { useLoading } from '../hooks/useLoading';

const PdfToWordView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [files, setFiles] = useState<File[]>([]);
  const { addToast } = useToasts();
  const { showLoading, hideLoading } = useLoading();

  const handleConvert = async () => {
    if (files.length === 0) {
      addToast('error', 'Please select PDF files to convert.');
      return;
    }
    showLoading();
    try {
      await convertPdfToWord(files);
      setFiles([]);
      addToast('success', 'Converted to Word successfully! Your download has started.');
    } catch (e) {
      addToast('error', (e as Error).message);
    } finally {
      hideLoading();
    }
  };

  return (
    <ToolPageLayout
      title="PDF to Word"
      description="Convert your PDF files into editable Microsoft Word (.docx) documents."
      onBack={onBack}
    >
      <div className="space-y-6">
        <FileUpload files={files} setFiles={setFiles} />
        <button
          onClick={handleConvert}
          disabled={files.length === 0}
          className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-hover disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          Convert to Word
        </button>
      </div>
    </ToolPageLayout>
  );
};

export default PdfToWordView;