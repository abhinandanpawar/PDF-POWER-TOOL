import React, { useState } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Label } from '../components/Label';
import { Trash2, Plus } from 'lucide-react';
import { setPdfMetadata } from '../services/apiService';
import { useToolLogic } from '../hooks/useToolLogic';

interface MetadataField {
  id: number;
  key: string;
  value: string;
}

const SetMetadataView: React.FC = () => {
  const [metadataFields, setMetadataFields] = useState<MetadataField[]>([{ id: Date.now(), key: '', value: '' }]);

  const {
    files,
    setFiles,
    handleProcess,
    isLoading,
  } = useToolLogic({
    conversionFunction: (files, options) => setPdfMetadata(files[0], options?.metadata as { [key: string]: string }),
    successMessage: 'Metadata set successfully! Your download has started.',
    errorMessage: 'Failed to set metadata',
    validate: (files) => {
      if (files.length !== 1) {
        return 'Please select exactly one PDF file.';
      }
      const metadata = metadataFields.reduce((acc, field) => {
        if (field.key.trim()) {
          acc[field.key.trim()] = field.value.trim();
        }
        return acc;
      }, {} as { [key: string]: string });

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
      if (field.key.trim()) {
        acc[field.key.trim()] = field.value.trim();
      }
      return acc;
    }, {} as { [key: string]: string });
  };

  return (
    <ToolPageLayout
      title="Set PDF Metadata"
      description="Update or add metadata properties such as Title, Author, or Keywords to a PDF file."
    >
      <div className="space-y-6">
        <FileUpload files={files} setFiles={setFiles} multiple={false} />

        <div className="space-y-4">
          <Label className="text-lg font-semibold">Metadata Fields</Label>
          <div className="space-y-3">
            {metadataFields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2 items-end">
                <div className="space-y-1.5">
                  <Label htmlFor={`metadata-key-${field.id}`}>Key</Label>
                  <Input
                    id={`metadata-key-${field.id}`}
                    type="text"
                    placeholder="e.g., Title"
                    value={field.key}
                    onChange={(e) => handleFieldChange(field.id, 'key', e.target.value)}
                  />
                </div>
                 <div className="space-y-1.5">
                  <Label htmlFor={`metadata-value-${field.id}`}>Value</Label>
                  <Input
                    id={`metadata-value-${field.id}`}
                    type="text"
                    placeholder="e.g., My Awesome Document"
                    value={field.value}
                    onChange={(e) => handleFieldChange(field.id, 'value', e.target.value)}
                  />
                </div>
                {metadataFields.length > 1 && (
                  <Button onClick={() => removeField(field.id)} variant="destructive" size="icon" aria-label="Remove field">
                      <Trash2 className="h-5 w-5" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button onClick={addField} variant="outline" size="sm" className="mt-2">
            <Plus className="h-4 w-4 mr-2" />
            Add another field
          </Button>
        </div>

        <Button
          onClick={() => handleProcess({ metadata: getMetadataObject() })}
          disabled={files.length === 0 || isLoading}
          loading={isLoading}
          className="w-full"
          size="lg"
        >
          Set Metadata and Download
        </Button>
      </div>
    </ToolPageLayout>
  );
};

export default SetMetadataView;