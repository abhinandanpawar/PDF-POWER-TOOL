import React, { useState } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import { setPdfMetadata } from '../services/apiService';
import { useToolLogic } from '../hooks/useToolLogic';

interface MetadataField {
  id: number;
  key: string;
  value: string;
}

const SetMetadataView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [metadataFields, setMetadataFields] = useState<MetadataField[]>([{ id: Date.now(), key: '', value: '' }]);

  const { files, setFiles, handleProcess } = useToolLogic({
    conversionFunction: (files, options) => setPdfMetadata(files[0], options?.metadata as { [key: string]: string }),
    successMessage: 'Metadata set successfully! Your download has started.',
    errorMessage: 'Failed to set metadata',
    validate: (files) => {
      if (files.length !== 1) {
        return 'Please select exactly one PDF file.';
      }
      const metadata = metadataFields.reduce((acc, field) => {
        if(field.key.trim()) {
            acc[field.key.trim()] = field.value.trim();
        }
        return acc;
      }, {} as {[key: string]: string});

      if (Object.keys(metadata).length === 0) {
          return 'Please provide at least one valid metadata key-value pair.';
      }
      return null;
    },
  });

  const handleFieldChange = (id: number, field: 'key' | 'value', value: string) => {
    setMetadataFields(fields => fields.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const addField = () => {
    setMetadataFields(fields => [...fields, { id: Date.now(), key: '', value: '' }]);
  };

  const removeField = (id: number) => {
    setMetadataFields(fields => fields.filter(f => f.id !== id));
  };

  const getMetadataObject = () => {
    return metadataFields.reduce((acc, field) => {
      if(field.key.trim()) {
          acc[field.key.trim()] = field.value.trim();
      }
      return acc;
    }, {} as {[key: string]: string});
  };

  return (
    <ToolPageLayout
      title="Set PDF Metadata"
      description="Update or add metadata properties such as Title, Author, or Keywords to a PDF file."
      onBack={onBack}
    >
      <div className="space-y-6">
        <FileUpload files={files} setFiles={setFiles} multiple={false} />
        <div>
          <h3 className="text-lg font-semibold mb-2 text-text-secondary">Metadata Fields</h3>
          <div className="space-y-3">
            {metadataFields.map((field) => (
              <div key={field.id} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Key (e.g., Title)"
                  value={field.key}
                  onChange={(e) => handleFieldChange(field.id, 'key', e.target.value)}
                  className="flex-1 bg-secondary border border-border rounded-lg p-2 text-text-primary focus:ring-primary focus:border-primary"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={field.value}
                  onChange={(e) => handleFieldChange(field.id, 'value', e.target.value)}
                  className="flex-1 bg-secondary border border-border rounded-lg p-2 text-text-primary focus:ring-primary focus:border-primary"
                />
                {metadataFields.length > 1 && (
                  <button onClick={() => removeField(field.id)} className="text-red-500 hover:text-red-400 p-2 rounded-full bg-secondary" aria-label="Remove field">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          <button onClick={addField} className="mt-3 text-sm text-primary hover:underline">
            + Add another field
          </button>
        </div>
        <button
          onClick={() => handleProcess({ metadata: getMetadataObject() })}
          disabled={files.length === 0}
          className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-hover disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          Set Metadata and Download
        </button>
      </div>
    </ToolPageLayout>
  );
};

export default SetMetadataView;