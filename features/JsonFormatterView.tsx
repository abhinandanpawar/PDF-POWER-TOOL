import React, { useState } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import { useToasts } from '../hooks/useToasts';

const JsonFormatterView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [jsonInput, setJsonInput] = useState('');
  const [formattedJson, setFormattedJson] = useState('');
  const { addToast } = useToasts();

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setFormattedJson(JSON.stringify(parsed, null, 2));
      addToast({ type: 'success', message: 'JSON formatted successfully!' });
    } catch (error) {
      addToast({ type: 'error', message: 'Invalid JSON input.' });
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setFormattedJson(JSON.stringify(parsed));
      addToast({ type: 'success', message: 'JSON minified successfully!' });
    } catch (error) {
      addToast({ type: 'error', message: 'Invalid JSON input.' });
    }
  };

  return (
    <ToolPageLayout
      title="JSON Formatter"
      onBack={onBack}
      description="Format or minify your JSON data."
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="json-input" className="block text-sm font-medium text-gray-700">
              JSON Input
            </label>
            <textarea
              id="json-input"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="mt-1 block w-full h-60 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Paste your JSON here."
            />
          </div>
          <div>
            <label htmlFor="formatted-json" className="block text-sm font-medium text-gray-700">
              Formatted JSON
            </label>
            <textarea
              id="formatted-json"
              value={formattedJson}
              readOnly
              className="mt-1 block w-full h-60 p-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 sm:text-sm"
              placeholder="Formatted JSON will appear here."
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleFormat}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Format
          </button>
          <button
            onClick={handleMinify}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Minify
          </button>
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default JsonFormatterView;
