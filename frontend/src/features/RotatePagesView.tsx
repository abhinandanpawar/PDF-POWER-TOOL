import React, { useState } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import { rotatePages } from '../services/apiService';
import { useToolLogic } from '../hooks/useToolLogic';

const RotatePagesView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [pages, setPages] = useState('');
  const [degrees, setDegrees] = useState<90 | 180 | 270>(90);

  const { files, setFiles, handleProcess } = useToolLogic({
    conversionFunction: (files, options) => rotatePages(files, options?.pages as string, options?.degrees as (90 | 180 | 270)),
    successMessage: 'Pages rotated successfully! Your download has started.',
    errorMessage: 'Failed to rotate pages',
    validate: (files) => {
      if (files.length === 0 || !pages.trim()) {
        return 'Please select files and specify pages to rotate.';
      }
      return null;
    },
  });

  return (
    <ToolPageLayout
      title="Rotate Pages"
      description="Rotate specific pages in your PDF documents by 90, 180, or 270 degrees."
      onBack={onBack}
    >
      <div className="space-y-6">
        <FileUpload files={files} setFiles={setFiles} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="pages" className="block text-sm font-medium text-text-secondary mb-1">
                    Pages to Rotate
                </label>
                <input
                    id="pages"
                    type="text"
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                    placeholder="e.g., 1, 3-5"
                    className="w-full bg-secondary border border-border rounded-lg p-2 text-text-primary focus:ring-primary focus:border-primary"
                    required
                />
            </div>
            <div>
                 <label htmlFor="degrees" className="block text-sm font-medium text-text-secondary mb-1">
                    Rotation
                </label>
                <select
                    id="degrees"
                    value={degrees}
                    onChange={(e) => setDegrees(Number(e.target.value) as 90 | 180 | 270)}
                    className="w-full bg-secondary border border-border rounded-lg p-2 text-text-primary focus:ring-primary focus:border-primary"
                >
                    <option value="90">90° Clockwise</option>
                    <option value="180">180°</option>
                    <option value="270">270° Clockwise (90° Counter-clockwise)</option>
                </select>
            </div>
        </div>
        <button
          onClick={() => handleProcess({ pages, degrees })}
          disabled={files.length === 0 || !pages.trim()}
          className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-hover disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          Rotate Pages
        </button>
      </div>
    </ToolPageLayout>
  );
};

export default RotatePagesView;