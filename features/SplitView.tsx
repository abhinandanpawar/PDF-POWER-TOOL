import React, { useState } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import { splitPdf } from '../services/apiService';
import { useToasts } from '../hooks/useToasts';
import { useLoading } from '../hooks/useLoading';

const SplitView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [ranges, setRanges] = useState('');
  const { addToast } = useToasts();
  const { showLoading, hideLoading } = useLoading();

  const handleSplit = async () => {
    if (files.length === 0) {
      addToast('error', 'Please select at least one PDF file to split.');
      return;
    }
    showLoading();
    try {
      await splitPdf(files, ranges);
      setFiles([]);
      setRanges('');
      addToast('success', 'PDF split successfully! Your download has started.');
    } catch (e) {
      addToast('error', (e as Error).message);
    } finally {
      hideLoading();
    }
  };

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
          onClick={handleSplit}
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