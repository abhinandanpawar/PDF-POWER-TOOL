import React from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import { convertCsvXlsx } from '../services/apiService';
import { useToolLogic } from '../hooks/useToolLogic';

const CsvXlsxView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { files, setFiles, handleProcess } = useToolLogic({
    conversionFunction: (files) => convertCsvXlsx(files[0]),
    successMessage: 'Converted successfully! Your download has started.',
    errorMessage: 'Failed to convert file',
    validate: (files) => {
      if (files.length === 0) {
        return 'Please select a CSV or XLSX file to convert.';
      }
      if (files.length > 1) {
        return 'Please select only one file.';
      }

      const inputFile = files[0];
      const isCsv = inputFile.name.toLowerCase().endsWith('.csv');
      const isXlsx = inputFile.name.toLowerCase().endsWith('.xlsx');

      if (!isCsv && !isXlsx) {
          return 'Please upload a valid .csv or .xlsx file.';
      }
      return null;
    },
  });

  return (
    <ToolPageLayout
      title="CSV <> Excel Converter"
      description="Easily convert files between CSV and XLSX (Microsoft Excel) formats."
      onBack={onBack}
    >
      <div className="space-y-6">
        <FileUpload files={files} setFiles={setFiles} />
        <button
          onClick={() => handleProcess()}
          disabled={files.length === 0}
          className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-hover disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          Convert File
        </button>
      </div>
    </ToolPageLayout>
  );
};

export default CsvXlsxView;
