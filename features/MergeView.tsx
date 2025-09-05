import React from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import { mergePdfs } from '../services/apiService';
import { useToolLogic } from '../hooks/useToolLogic';

const MergeView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { files, setFiles, handleProcess } = useToolLogic({
    conversionFunction: mergePdfs,
    successMessage: 'PDFs merged successfully! Your download has started.',
    errorMessage: 'Failed to merge PDFs',
    validate: (files) => {
      if (files.length < 2) {
        return 'Please select at least two PDF files to merge.';
      }
      return null;
    },
  });

  return (
    <ToolPageLayout
      title="Merge PDF"
      description="Combine multiple PDF files into a single document. Upload files and drag to set the desired order."
      onBack={onBack}
    >
      <div className="space-y-6">
        <FileUpload files={files} setFiles={setFiles} />
        <button
          onClick={() => handleProcess()}
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