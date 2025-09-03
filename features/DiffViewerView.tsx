import React, { useState } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import ReactDiffViewer from 'react-diff-viewer-continued';

const DiffViewerView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [originalText, setOriginalText] = useState('');
  const [newText, setNewText] = useState('');

  return (
    <ToolPageLayout
      title="Visual Diff Viewer"
      onBack={onBack}
      description="Compare two text files to see the differences."
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="original-text" className="block text-sm font-medium text-gray-700">
              Original Text
            </label>
            <textarea
              id="original-text"
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              className="mt-1 block w-full h-60 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Paste the original text here."
            />
          </div>
          <div>
            <label htmlFor="new-text" className="block text-sm font-medium text-gray-700">
              New Text
            </label>
            <textarea
              id="new-text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="mt-1 block w-full h-60 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Paste the new text here."
            />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">Differences</h3>
          <div className="mt-2 border rounded-md overflow-hidden">
            <ReactDiffViewer
              oldValue={originalText}
              newValue={newText}
              splitView={true}
              showDiffOnly={false}
              useDarkTheme={document.documentElement.classList.contains('dark')}
            />
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default DiffViewerView;
