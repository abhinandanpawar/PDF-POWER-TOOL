import React, { useState } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import { useToasts } from '../hooks/useToasts';
import Papa from 'papaparse';

const CsvJsonConverterView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { addToast } = useToasts();
  const [csvData, setCsvData] = useState('');
  const [jsonData, setJsonData] = useState('');

  const handleCsvToJson = () => {
    if (!csvData) {
      addToast({ type: 'error', message: 'CSV input is empty.' });
      return;
    }
    try {
      const result = Papa.parse(csvData, { header: true, skipEmptyLines: true });
      if (result.errors.length > 0) {
        addToast({ type: 'error', message: `CSV parsing error: ${result.errors[0].message}`});
        return;
      }
      setJsonData(JSON.stringify(result.data, null, 2));
      addToast({ type: 'success', message: 'Converted CSV to JSON successfully!' });
    } catch (error) {
      addToast({ type: 'error', message: 'Failed to convert CSV to JSON.' });
      console.error(error);
    }
  };

  const handleJsonToCsv = () => {
    if (!jsonData) {
      addToast({ type: 'error', message: 'JSON input is empty.' });
      return;
    }
    try {
      const json = JSON.parse(jsonData);
      const result = Papa.unparse(json);
      setCsvData(result);
      addToast({ type: 'success', message: 'Converted JSON to CSV successfully!' });
    } catch (error) {
      addToast({ type: 'error', message: 'Invalid JSON format.' });
      console.error(error);
    }
  };

  return (
    <ToolPageLayout
      title="CSV <> JSON Converter"
      onBack={onBack}
      description="Convert data between CSV and JSON formats."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="csv-input" className="font-medium">CSV Input</label>
          <textarea
            id="csv-input"
            value={csvData}
            onChange={(e) => setCsvData(e.target.value)}
            className="w-full h-80 p-2 border rounded-md font-mono text-sm"
            placeholder="name,age\njohn,30\njane,28"
          ></textarea>
        </div>
        <div className="space-y-2">
          <label htmlFor="json-input" className="font-medium">JSON Output</label>
          <textarea
            id="json-input"
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
            className="w-full h-80 p-2 border rounded-md font-mono text-sm"
            placeholder={`[
  {
    "name": "john",
    "age": "30"
  },
  {
    "name": "jane",
    "age": "28"
  }
]`}
          ></textarea>
        </div>
      </div>
      <div className="flex space-x-4 mt-4">
        <button onClick={handleCsvToJson} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          CSV to JSON &raquo;
        </button>
        <button onClick={handleJsonToCsv} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          &laquo; JSON to CSV
        </button>
      </div>
    </ToolPageLayout>
  );
};

export default CsvJsonConverterView;
