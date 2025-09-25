import React, { useState } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import { addWatermark } from '../services/apiService';
import { useToolLogic } from '../hooks/useToolLogic';

const WatermarkView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [text, setText] = useState('');

  const { files, setFiles, handleProcess } = useToolLogic({
    conversionFunction: (files, options) => addWatermark(files, options?.text as string),
    successMessage: 'Watermark added successfully! Your download has started.',
    errorMessage: 'Failed to add watermark',
    validate: (files) => {
      if (files.length === 0 || !text.trim()) {
        return 'Please select files and provide watermark text.';
      }
      return null;
    },
  });

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
          onClick={() => handleProcess({ text })}
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