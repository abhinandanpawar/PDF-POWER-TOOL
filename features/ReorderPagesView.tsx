import React, { useState } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import { reorderPages } from '../services/apiService';
import { useToolLogic } from '../hooks/useToolLogic';

const ReorderPagesView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [order, setOrder] = useState('');

  const { files, setFiles, handleProcess } = useToolLogic({
    conversionFunction: (files, options) => reorderPages(files, options?.order as string),
    successMessage: 'Pages reordered successfully! Your download has started.',
    errorMessage: 'Failed to reorder pages',
    validate: (files) => {
      if (files.length !== 1) {
        return 'Please select exactly one file to reorder.';
      }
      if (!order.trim()) {
        return 'Please specify the new page order.';
      }
      return null;
    },
  });

  return (
    <ToolPageLayout
      title="Reorder Pages"
      description="Rearrange the pages of a PDF document into a new custom order."
      onBack={onBack}
    >
      <div className="space-y-6">
        <FileUpload files={files} setFiles={setFiles} multiple={false} />
        <div>
          <label htmlFor="order" className="block text-sm font-medium text-text-secondary mb-1">
            New Page Order
          </label>
          <input
            id="order"
            type="text"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            placeholder="e.g., 3, 1, 2, 4"
            className="w-full bg-secondary border border-border rounded-lg p-2 text-text-primary focus:ring-primary focus:border-primary"
            required
          />
        </div>
        <button
          onClick={() => handleProcess({ order })}
          disabled={files.length !== 1 || !order.trim()}
          className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-hover disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          Reorder Pages
        </button>
      </div>
    </ToolPageLayout>
  );
};

export default ReorderPagesView;