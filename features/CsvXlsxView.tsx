import React, { useState } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import { convertCsvXlsx } from '../services/apiService';
import { useToasts } from '../hooks/useToasts';
import { useLoading } from '../hooks/useLoading';

const CsvXlsxView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [files, setFiles] = useState<File[]>([]);
  const { addToast } = useToasts();
  const { showLoading, hideLoading } = useLoading();

  const handleConvert = async () => {
    if (files.length === 0) {
      addToast('error', 'Please select a CSV or XLSX file to convert.');
      return;
    }
    if (files.length > 1) {
        addToast('error', 'Please select only one file.');
        return;
    }

    const inputFile = files[0];
    const isCsv = inputFile.name.toLowerCase().endsWith('.csv');
    const isXlsx = inputFile.name.toLowerCase().endsWith('.xlsx');

    if (!isCsv && !isXlsx) {
        addToast('error', 'Please upload a valid .csv or .xlsx file.');
        return;
    }

    showLoading();
    try {
      await convertCsvXlsx(inputFile);
      setFiles([]);
      const direction = isCsv ? 'CSV to XLSX' : 'XLSX to CSV';
      addToast('success', `Converted ${direction} successfully! Your download has started.`);
    } catch (e) {
      addToast('error', (e as Error).message);
    } finally {
      hideLoading();
    }
  };

  return (
    <ToolPageLayout
      title="CSV <> Excel Converter"
      description="Easily convert files between CSV and XLSX (Microsoft Excel) formats."
      onBack={onBack}
    >
      <div className="space-y-6">
        <FileUpload files={files} setFiles={setFiles} />
        <button
          onClick={handleConvert}
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
