import React, { useState } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import { splitPdf } from '../services/apiService';
import { useToolLogic } from '../hooks/useToolLogic';

const SplitView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [ranges, setRanges] = useState('');

  const { files, setFiles, handleProcess } = useToolLogic({
    conversionFunction: (files, options) => splitPdf(files, options?.ranges as string),
    successMessage: 'PDF split successfully! Your download has started.',
    errorMessage: 'Failed to split PDF',
    validate: (files) => {
      if (files.length === 0) {
        return 'Please select at least one PDF file to split.';
      }
      return null;
    },
  });

  return (
    <ToolPageLayout
      title="Split PDF"
      description="Extract specific pages or page ranges. If no range is specified, each page will be saved as a separate PDF."
      onBack={onBack}
    >
      <div className="space-y-6">
        <FileUpload files={files} setFiles={setFiles} />
        <div>
          <label htmlFor="ranges" className="block text-sm font-medium text-text-secondary mb-1">
            Page Ranges (optional)
          </label>
          <input
            id="ranges"
            type="text"
            value={ranges}
            onChange={(e) => setRanges(e.target.value)}
            placeholder="e.g., 1-3, 5, 7-9"
            className="w-full bg-secondary border border-border rounded-lg p-2 text-text-primary focus:ring-primary focus:border-primary"
          />
        </div>
        <button
          onClick={() => handleProcess({ ranges })}
          disabled={files.length === 0}
          className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-hover disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          Split PDF
        </button>
      </div>
    </ToolPageLayout>
  );
};

export default SplitView;