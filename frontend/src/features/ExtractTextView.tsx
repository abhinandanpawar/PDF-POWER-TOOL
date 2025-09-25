import React from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import { extractText } from '../services/apiService';
import { useToolLogic } from '../hooks/useToolLogic';
import { useToasts } from '../hooks/useToasts';

const ExtractTextView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { files, setFiles, handleProcess, result: extractedText } = useToolLogic<undefined, string>({
    conversionFunction: extractText,
    successMessage: 'Text extracted successfully!',
    errorMessage: 'Failed to extract text',
    validate: (files) => {
      if (files.length === 0) {
        return 'Please select files to extract text from.';
      }
      return null;
    },
  });

  const { addToast } = useToasts();

  const handleCopyToClipboard = () => {
    if (extractedText) {
      navigator.clipboard.writeText(extractedText);
      addToast('info', 'Text copied to clipboard!');
    }
  };

  return (
    <ToolPageLayout
      title="Extract Text"
      description="Retrieve all text content from your PDF files into a single block of plain text."
      onBack={onBack}
    >
      <div className="space-y-6">
        <FileUpload files={files} setFiles={setFiles} />
        <button
          onClick={() => handleProcess()}
          disabled={files.length === 0}
          className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-hover disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          Extract Text
        </button>
        {extractedText !== null && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Extracted Text:</h3>
            <textarea
              readOnly
              value={extractedText}
              className="w-full h-64 bg-secondary border border-border rounded-lg p-3 text-text-primary font-mono text-sm"
              aria-label="Extracted text"
            />
            <button
                onClick={handleCopyToClipboard}
                className="mt-2 bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors"
            >
                Copy to Clipboard
            </button>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
};

export default ExtractTextView;