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
          className="w-full bg-primary text-primary-foreground font-bold py-3 px-4 rounded-lg hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
        >
          Extract Text
        </button>
        {extractedText !== null && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Extracted Text:</h3>
              <button
                  onClick={handleCopyToClipboard}
                  className="bg-secondary text-secondary-foreground font-bold py-2 px-4 rounded-lg hover:bg-secondary/90 transition-colors"
              >
                  Copy to Clipboard
              </button>
            </div>
            <div className="bg-muted border border-border rounded-lg p-4">
              <pre className="w-full h-64 overflow-auto text-foreground font-mono text-base whitespace-pre-wrap">
                {extractedText}
              </pre>
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
};

export default ExtractTextView;