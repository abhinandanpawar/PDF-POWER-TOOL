import React, { useState } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import { reorderPages } from '../services/apiService';
import { useToasts } from '../hooks/useToasts';
import { useLoading } from '../hooks/useLoading';

const ReorderPagesView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [order, setOrder] = useState('');
  const { addToast } = useToasts();
  const { showLoading, hideLoading } = useLoading();

  const handleReorder = async () => {
    if (files.length !== 1) {
      addToast('error', 'Please select exactly one file to reorder.');
      return;
    }
    if (!order.trim()) {
      addToast('error', 'Please specify the new page order.');
      return;
    }
    
    showLoading();
    try {
      await reorderPages(files, order);
      setFiles([]);
      setOrder('');
      addToast('success', 'Pages reordered successfully! Your download has started.');
    } catch (e) {
      addToast('error', (e as Error).message);
    } finally {
      hideLoading();
    }
  };

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
          onClick={handleReorder}
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