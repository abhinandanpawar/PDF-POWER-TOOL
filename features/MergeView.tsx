import React, { useState } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import { mergePdfs } from '../services/apiService';
import { useToasts } from '../hooks/useToasts';
import { useLoading } from '../hooks/useLoading';

const MergeView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [files, setFiles] = useState<File[]>([]);
  const { addToast } = useToasts();
  const { showLoading, hideLoading } = useLoading();

  const handleMerge = async () => {
    if (files.length < 2) {
      addToast('error', 'Please select at least two PDF files to merge.');
      return;
    }
    showLoading();
    try {
      await mergePdfs(files);
      setFiles([]);
      addToast('success', 'PDFs merged successfully! Your download has started.');
    } catch (e) {
      addToast('error', (e as Error).message);
    } finally {
      hideLoading();
    }
  };

  return (
    <ToolPageLayout
      title="Merge PDF"
      description="Combine multiple PDF files into a single document. Upload files and drag to set the desired order."
      onBack={onBack}
    >
      <div className="space-y-6">
        <FileUpload files={files} setFiles={setFiles} />
        <button
          onClick={handleMerge}
          disabled={files.length < 2}
          className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-hover disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          Merge PDFs
        </button>
      </div>
    </ToolPageLayout>
  );
};

export default MergeView;