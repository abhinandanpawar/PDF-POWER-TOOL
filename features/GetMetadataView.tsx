import React from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import { getPdfMetadata } from '../services/apiService';
import { useToolLogic } from '../hooks/useToolLogic';

const GetMetadataView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { files, setFiles, handleProcess, result: metadata } = useToolLogic<undefined, object>({
    conversionFunction: (files) => getPdfMetadata(files[0]),
    successMessage: 'Metadata retrieved successfully.',
    errorMessage: 'Failed to retrieve metadata',
    validate: (files) => {
      if (files.length !== 1) {
        return 'Please select a single PDF file.';
      }
      return null;
    },
  });

  return (
    <ToolPageLayout
      title="Get PDF Metadata"
      description="View detailed information and metadata properties of a PDF file."
      onBack={onBack}
    >
      <div className="space-y-6">
        <FileUpload files={files} setFiles={setFiles} multiple={false} />
        <button
          onClick={() => handleProcess()}
          disabled={files.length !== 1}
          className="w-full bg-primary text-primary-foreground font-bold py-3 px-4 rounded-lg hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
        >
          Get Metadata
        </button>
        {metadata && Object.keys(metadata).length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">PDF Metadata:</h3>
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full text-left text-base">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-4 font-semibold">Property</th>
                    <th className="p-4 font-semibold">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(metadata).map(([key, value]) => (
                    <tr key={key} className="border-t border-border">
                      <td className="p-4 font-medium text-foreground">{key}</td>
                      <td className="p-4 text-foreground break-all">{String(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
};

export default GetMetadataView;