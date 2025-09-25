import React from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import { compressPdf } from '../services/apiService';
import { useToolLogic } from '../hooks/useToolLogic';

const CompressView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { files, setFiles, handleProcess } = useToolLogic({
    conversionFunction: compressPdf,
    successMessage: 'PDFs compressed successfully! Your download has started.',
    errorMessage: 'Failed to compress PDFs',
    validate: (files) => {
      if (files.length === 0) {
        return 'Please select PDF files to compress.';
      }
      return null;
    },
  });

  return (
    <ToolPageLayout
      title="Compress PDF"
      description="Reduce the file size of your PDFs while maintaining optimal quality. Perfect for sharing and storing."
      onBack={onBack}
    >
      <div className="space-y-6">
        <FileUpload files={files} setFiles={setFiles} />
        <button
          onClick={() => handleProcess()}
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