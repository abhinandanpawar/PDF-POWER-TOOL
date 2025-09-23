import React from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
// import { convertCadToPdf } from '../services/apiService';
import { useToolLogic } from '../hooks/useToolLogic';

const CadConvertView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { files, setFiles, handleProcess } = useToolLogic({
    conversionFunction: async (files) => { alert('This feature is temporarily disabled.'); },
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
          disabled={true}
          className="w-full bg-primary text-primary-foreground font-bold py-3 px-4 rounded-lg hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
        >
          Convert to PDF
        </button>
      </div>
    </ToolPageLayout>
  );
};

export default CadConvertView;
