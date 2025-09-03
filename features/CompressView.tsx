import React, { useState } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import { compressPdf } from '../services/apiService';
import { useToasts } from '../hooks/useToasts';
import { useLoading } from '../hooks/useLoading';

const CompressView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [files, setFiles] = useState<File[]>([]);
  const { addToast } = useToasts();
  const { showLoading, hideLoading } = useLoading();

  const handleCompress = async () => {
    if (files.length === 0) {
      addToast('error', 'Please select PDF files to compress.');
      return;
    }
    showLoading();
    try {
      await compressPdf(files);
      setFiles([]);
      addToast('success', 'PDFs compressed successfully! Your download has started.');
    } catch (e) {
      addToast('error', (e as Error).message);
    } finally {
      hideLoading();
    }
  };

  return (
    <ToolPageLayout
      title="Compress PDF"
      description="Reduce the file size of your PDFs while maintaining optimal quality. Perfect for sharing and storing."
      onBack={onBack}
    >
      <div className="space-y-6">
        <FileUpload files={files} setFiles={setFiles} />
        <button
          onClick={handleCompress}
          disabled={files.length === 0}
          className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-hover disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          Compress PDFs
        </button>
      </div>
    </ToolPageLayout>
  );
};

export default CompressView;