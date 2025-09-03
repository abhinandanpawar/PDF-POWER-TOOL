import React, { useState } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import { deletePages } from '../services/apiService';
import { useToasts } from '../hooks/useToasts';
import { useLoading } from '../hooks/useLoading';

const DeletePagesView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [pages, setPages] = useState('');
  const { addToast } = useToasts();
  const { showLoading, hideLoading } = useLoading();

  const handleDelete = async () => {
    if (files.length === 0 || !pages.trim()) {
      addToast('error', 'Please select files and specify pages to delete.');
      return;
    }
    showLoading();
    try {
      await deletePages(files, pages);
      setFiles([]);
      setPages('');
      addToast('success', 'Pages deleted successfully! Your download has started.');
    } catch (e) {
      addToast('error', (e as Error).message);
    } finally {
      hideLoading();
    }
  };

  return (
    <ToolPageLayout
      title="Delete Pages"
      description="Permanently remove one or more pages from your PDF documents."
      onBack={onBack}
    >
      <div className="space-y-6">
        <FileUpload files={files} setFiles={setFiles} />
        <div>
          <label htmlFor="pages" className="block text-sm font-medium text-text-secondary mb-1">
            Pages to Delete
          </label>
          <input
            id="pages"
            type="text"
            value={pages}
            onChange={(e) => setPages(e.target.value)}
            placeholder="e.g., 2, 4-6, 8"
            className="w-full bg-secondary border border-border rounded-lg p-2 text-text-primary focus:ring-primary focus:border-primary"
            required
          />
        </div>
        <button
          onClick={handleDelete}
          disabled={files.length === 0 || !pages.trim()}
          className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-hover disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          Delete Pages
        </button>
      </div>
    </ToolPageLayout>
  );
};

export default DeletePagesView;