import React, { useState } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';

const DataCleanerView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  const handleClean = (operation: string) => {
    let result = inputText;
    switch (operation) {
      case 'trim':
        result = inputText.split('\n').map(line => line.trim()).join('\n');
        break;
      case 'remove-duplicates':
        result = [...new Set(inputText.split('\n').map(line => line.trim()))].join('\n');
        break;
      case 'lowercase':
        result = inputText.toLowerCase();
        break;
      case 'uppercase':
        result = inputText.toUpperCase();
        break;
    }
    setOutputText(result);
  };

  return (
    <ToolPageLayout
      title="Data Cleaner"
      onBack={onBack}
      description="Clean and transform your text data."
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="input-text" className="block text-sm font-medium text-gray-700">
              Input
            </label>
            <textarea
              id="input-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="mt-1 block w-full h-60 p-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="Paste your data here."
            />
          </div>
          <div>
            <label htmlFor="output-text" className="block text-sm font-medium text-gray-700">
              Output
            </label>
            <textarea
              id="output-text"
              value={outputText}
              readOnly
              className="mt-1 block w-full h-60 p-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
              placeholder="Cleaned data will appear here."
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleClean('trim')} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Trim Lines</button>
          <button onClick={() => handleClean('remove-duplicates')} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Remove Duplicate Lines</button>
          <button onClick={() => handleClean('lowercase')} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">To Lowercase</button>
          <button onClick={() => handleClean('uppercase')} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">To Uppercase</button>
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default DataCleanerView;
