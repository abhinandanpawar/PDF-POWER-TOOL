import React from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import { convertPdfToWord } from '../services/apiService';
import { useToolLogic } from '../hooks/useToolLogic';

const PdfToWordView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { files, setFiles, handleProcess } = useToolLogic({
    conversionFunction: convertPdfToWord,
    successMessage: 'Converted to Word successfully! Your download has started.',
    errorMessage: 'Failed to convert PDF to Word',
    validate: (files) => {
      if (files.length === 0) {
        return 'Please select PDF files to convert.';
      }
      return null;
    },
  });

  return (
    <ToolPageLayout
      title="PDF to Word"
      description="Convert your PDF files into editable Microsoft Word (.docx) documents."
      onBack={onBack}
    >
      <div className="space-y-6">
        <FileUpload files={files} setFiles={setFiles} />
        <button
          onClick={() => handleProcess()}
          disabled={files.length === 0}
          className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-hover disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          Convert to Word
        </button>
      </div>
    </ToolPageLayout>
  );
};

export default PdfToWordView;