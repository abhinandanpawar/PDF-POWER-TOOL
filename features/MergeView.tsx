import React from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import { Button } from '../components/Button';
import { mergePdfs } from '../services/apiService';
import { useToolLogic } from '../hooks/useToolLogic';

const MergeView: React.FC = () => {
  const {
    files,
    setFiles,
    handleProcess,
    isLoading,
  } = useToolLogic({
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
    >
      <div className="space-y-6">
        <FileUpload files={files} setFiles={setFiles} />
        <Button
          onClick={() => handleProcess()}
          disabled={files.length < 2 || isLoading}
          loading={isLoading}
          className="w-full"
          size="lg"
        >
          Merge PDFs
        </Button>
      </div>
    </ToolPageLayout>
  );
};

export default MergeView;