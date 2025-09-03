import React, { useState } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import { convertWordToPdf } from '../services/apiService';
import { useToasts } from '../hooks/useToasts';
import { useLoading } from '../hooks/useLoading';

const DocToPdfView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [files, setFiles] = useState<File[]>([]);
  const { addToast } = useToasts();
  const { showLoading, hideLoading } = useLoading();

  const handleConvert = async () => {
    if (files.length === 0) {
      addToast('error', 'Please select a Word file to convert.');
      return;
    }
    if (files.length > 1) {
        addToast('error', 'Please select only one file.');
        return;
    }

    showLoading();
    try {
      // We only handle the first file for this conversion
      await convertWordToPdf(files[0]);
      setFiles([]);
      addToast('success', 'Converted to PDF successfully! Your download has started.');
    } catch (e) {
      addToast('error', (e as Error).message);
    } finally {
      hideLoading();
    }
  };

  return (
    <ToolPageLayout
      title="Word to PDF"
      description="Convert Microsoft Word (.doc, .docx) documents into PDF files."
      onBack={onBack}
    >
      <div className="space-y-6">
        <FileUpload files={files} setFiles={setFiles} />
        <button
          onClick={handleConvert}
          disabled={files.length === 0}
          className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-hover disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          Convert to PDF
        </button>
      </div>
    </ToolPageLayout>
  );
};

export default DocToPdfView;
