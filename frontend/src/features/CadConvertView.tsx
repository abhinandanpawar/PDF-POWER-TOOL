import React from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import { convertCadToPdf } from '../services/apiService';
import { useToolLogic } from '../hooks/useToolLogic';

const CadConvertView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { files, setFiles, handleProcess } = useToolLogic({
    conversionFunction: (files) => convertCadToPdf(files[0]),
    successMessage: 'Converted to PDF successfully! Your download has started.',
    errorMessage: 'Failed to convert DXF to PDF',
    validate: (files) => {
      if (files.length === 0) {
        return 'Please select a DXF file to convert.';
      }
      if (files.length > 1) {
        return 'Please select only one file.';
      }
      return null;
    },
  });

  return (
    <ToolPageLayout
      title="CAD to PDF"
      description="Convert DXF (Drawing Exchange Format) files to PDF."
      onBack={onBack}
    >
      <div className="space-y-6">
        <FileUpload files={files} setFiles={setFiles} accept=".dxf" multiple={false} />
        <button
          onClick={() => handleProcess()}
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
