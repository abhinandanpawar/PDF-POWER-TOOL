import React, { useState } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import { useToasts } from '../hooks/useToasts';
import { useLoading } from '../hooks/useLoading';
import { convertCadToPdf } from '../services/apiService';

const CadConvertView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [files, setFiles] = useState<File[]>([]);
  const { addToast } = useToasts();
  const { showLoading, hideLoading } = useLoading();

  const handleConvert = async () => {
    if (files.length === 0) {
      addToast('error', 'Please select a DXF file to convert.');
      return;
    }
    if (files.length > 1) {
        addToast('error', 'Please select only one file.');
        return;
    }

    showLoading();
    try {
      await convertCadToPdf(files[0]);
      addToast('success', 'Converted to PDF successfully! Your download has started.');
      setFiles([]);
    } catch (e) {
      addToast('error', (e as Error).message);
    } finally {
      hideLoading();
    }
  };

  return (
    <ToolPageLayout
      title="CAD to PDF"
      description="Convert DXF (Drawing Exchange Format) files to PDF."
      onBack={onBack}
    >
      <div className="space-y-6">
        <FileUpload files={files} setFiles={setFiles} accept=".dxf" multiple={false} />
        <button
          onClick={handleConvert}
          disabled={files.length === 0}
          className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-hover disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          Convert to PDF
        </button>
      </div>
    </ToolPageLayout>
  );
};

export default CadConvertView;
