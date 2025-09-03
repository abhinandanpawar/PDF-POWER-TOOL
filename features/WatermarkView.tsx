import React, { useState } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import { addWatermark } from '../services/apiService';
import { useToasts } from '../hooks/useToasts';
import { useLoading } from '../hooks/useLoading';

const WatermarkView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState('');
  const { addToast } = useToasts();
  const { showLoading, hideLoading } = useLoading();

  const handleWatermark = async () => {
    if (files.length === 0 || !text.trim()) {
      addToast('error', 'Please select files and provide watermark text.');
      return;
    }
    showLoading();
    try {
      await addWatermark(files, text);
      setFiles([]);
      setText('');
      addToast('success', 'Watermark added successfully! Your download has started.');
    } catch (e) {
      addToast('error', (e as Error).message);
    } finally {
      hideLoading();
    }
  };

  return (
    <ToolPageLayout
      title="Add Watermark"
      description="Apply a text watermark to every page of your PDF documents."
      onBack={onBack}
    >
      <div className="space-y-6">
        <FileUpload files={files} setFiles={setFiles} />
        <div>
          <label htmlFor="watermark-text" className="block text-sm font-medium text-text-secondary mb-1">
            Watermark Text
          </label>
          <input
            id="watermark-text"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g., CONFIDENTIAL"
            className="w-full bg-secondary border border-border rounded-lg p-2 text-text-primary focus:ring-primary focus:border-primary"
            required
          />
        </div>
        <button
          onClick={handleWatermark}
          disabled={files.length === 0 || !text.trim()}
          className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-hover disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          Add Watermark
        </button>
      </div>
    </ToolPageLayout>
  );
};

export default WatermarkView;