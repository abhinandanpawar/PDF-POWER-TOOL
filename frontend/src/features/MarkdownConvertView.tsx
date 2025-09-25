import React, { useState } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import { convertMarkdown } from '../services/apiService';
import { useToolLogic } from '../hooks/useToolLogic';

type MarkdownFormat = 'html' | 'pdf';

const MarkdownConvertView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [outputFormat, setOutputFormat] = useState<MarkdownFormat>('pdf');

  const { files, setFiles, handleProcess } = useToolLogic({
    conversionFunction: (files, options) => convertMarkdown(files[0], options?.outputFormat as MarkdownFormat),
    successMessage: `Converted to ${outputFormat.toUpperCase()} successfully! Your download has started.`,
    errorMessage: 'Failed to convert Markdown',
    validate: (files) => {
      if (files.length === 0) {
        return 'Please select a Markdown file to convert.';
      }
      if (files.length > 1) {
        return 'Please select only one file.';
      }
      return null;
    },
  });

  return (
    <ToolPageLayout
      title="Convert Markdown"
      description="Convert Markdown files to HTML or PDF documents."
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
                onChange={(e) => setOutputFormat(e.target.value as MarkdownFormat)}
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
          Convert Markdown
        </button>
      </div>
    </ToolPageLayout>
  );
};

export default MarkdownConvertView;
