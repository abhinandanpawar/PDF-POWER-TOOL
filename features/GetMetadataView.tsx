import React, { useState } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import { getPdfMetadata } from '../services/apiService';
import { useToasts } from '../hooks/useToasts';
import { useLoading } from '../hooks/useLoading';

const GetMetadataView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [metadata, setMetadata] = useState<object | null>(null);
  const { addToast } = useToasts();
  const { showLoading, hideLoading } = useLoading();

  const handleGetMetadata = async () => {
    if (files.length !== 1) {
      addToast('error', 'Please select a single PDF file.');
      return;
    }
    showLoading();
    setMetadata(null);
    try {
      const data = await getPdfMetadata(files[0]);
      setMetadata(data);
      addToast('success', 'Metadata retrieved successfully.');
    } catch (e) {
      addToast('error', (e as Error).message);
    } finally {
      hideLoading();
    }
  };

  return (
    <ToolPageLayout
      title="Get PDF Metadata"
      description="View detailed information and metadata properties of a PDF file."
      onBack={onBack}
    >
      <div className="space-y-6">
        <FileUpload files={files} setFiles={setFiles} multiple={false} />
        <button
          onClick={handleGetMetadata}
          disabled={files.length !== 1}
          className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-hover disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          Get Metadata
        </button>
        {metadata && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">PDF Metadata:</h3>
            <pre className="w-full bg-secondary border border-border rounded-lg p-4 text-text-primary font-mono text-sm overflow-x-auto">
              {JSON.stringify(metadata, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
};

export default GetMetadataView;