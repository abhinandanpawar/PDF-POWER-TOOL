import React, { useState } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import { convertSpreadsheet } from '../services/apiService';
import { useToolLogic } from '../hooks/useToolLogic';

type SpreadsheetFormat = 'pdf' | 'html';

const SpreadsheetConvertView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [outputFormat, setOutputFormat] = useState<SpreadsheetFormat>('pdf');

  const { files, setFiles, handleProcess } = useToolLogic({
    conversionFunction: (files, options) => convertSpreadsheet(files[0], options?.outputFormat as SpreadsheetFormat),
    successMessage: `Converted to ${outputFormat.toUpperCase()} successfully! Your download has started.`,
    errorMessage: 'Failed to convert spreadsheet',
    validate: (files) => {
      if (files.length === 0) {
        return 'Please select a spreadsheet file to convert.';
      }
      if (files.length > 1) {
        return 'Please select only one file.';
      }
      return null;
    },
  });

  return (
    <ToolPageLayout
      title="Convert Spreadsheet"
      description="Convert Excel files (.xls, .xlsx) to PDF or HTML."
      onBack={onBack}
    >
      <div className="space-y-6">
        <FileUpload files={files} setFiles={setFiles} />

        <div className="flex flex-col space-y-2">
            <label htmlFor="format-select" className="font-medium text-text-primary">
                Output Format:
            </label>
            <select
                id="format-select"
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value as SpreadsheetFormat)}
                className="bg-secondary border border-border rounded-lg p-3 text-text-primary focus:ring-primary focus:border-primary"
            >
                <option value="pdf">PDF</option>
                <option value="html">HTML</option>
            </select>
        </div>

        <button
          onClick={() => handleProcess({ outputFormat })}
          disabled={files.length === 0}
          className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-hover disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          Convert Spreadsheet
        </button>
      </div>
    </ToolPageLayout>
  );
};

export default SpreadsheetConvertView;
