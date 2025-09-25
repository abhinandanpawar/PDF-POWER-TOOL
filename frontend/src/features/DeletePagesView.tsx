import React, { useState } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import { deletePages } from '../services/apiService';
import { useToolLogic } from '../hooks/useToolLogic';

const DeletePagesView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [pages, setPages] = useState('');

  const { files, setFiles, handleProcess } = useToolLogic({
    conversionFunction: (files, options) => deletePages(files, options?.pages as string),
    successMessage: 'Pages deleted successfully! Your download has started.',
    errorMessage: 'Failed to delete pages',
    validate: (files) => {
      if (files.length === 0 || !pages.trim()) {
        return 'Please select files and specify pages to delete.';
      }
      return null;
    },
  });

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
          onClick={() => handleProcess({ pages })}
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