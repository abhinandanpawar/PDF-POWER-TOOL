import React, { useState } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import { convertPdfToImages } from '../services/apiService';
import { useToolLogic } from '../hooks/useToolLogic';

const PdfToImagesView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [format, setFormat] = useState('png');
  const [dpi, setDpi] = useState(300);

  const { files, setFiles, handleProcess } = useToolLogic({
    conversionFunction: (files, options) => convertPdfToImages(files, options?.format as string, options?.dpi as number),
    successMessage: 'Converted to images successfully! Your download has started.',
    errorMessage: 'Failed to convert PDF to images',
    validate: (files) => {
      if (files.length === 0) {
        return 'Please select PDF files to convert.';
      }
      return null;
    },
  });

  return (
    <ToolPageLayout
      title="PDF to Images"
      description="Convert each page of your PDFs into high-quality images. Choose your preferred format and resolution."
      onBack={onBack}
    >
      <div className="space-y-6">
        <FileUpload files={files} setFiles={setFiles} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="format" className="block text-sm font-medium text-text-secondary mb-1">
              Image Format
            </label>
            <select
              id="format"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full bg-secondary border border-border rounded-lg p-2 text-text-primary focus:ring-primary focus:border-primary"
            >
              <option value="png">PNG</option>
              <option value="jpg">JPG</option>
            </select>
          </div>
          <div>
            <label htmlFor="dpi" className="block text-sm font-medium text-text-secondary mb-1">
              Resolution (DPI)
            </label>
            <input
              id="dpi"
              type="number"
              value={dpi}
              onChange={(e) => setDpi(Math.max(72, Number(e.target.value)))}
              className="w-full bg-secondary border border-border rounded-lg p-2 text-text-primary focus:ring-primary focus:border-primary"
              min="72"
              step="1"
            />
          </div>
        </div>
        <button
          onClick={() => handleProcess({ format, dpi })}
          disabled={files.length === 0}
          className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-hover disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          Convert to Images
        </button>
      </div>
    </ToolPageLayout>
  );
};

export default PdfToImagesView;