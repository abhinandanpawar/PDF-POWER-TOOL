import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import { Button } from '../components/Button';
import { useToasts as useToast } from '../hooks/useToasts';
import { mergePdfs } from '../services/pdf';
import ToolPageLayout from '../components/ToolPageLayout';
import { Download } from 'lucide-react';

const MergeView: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleMerge = async () => {
    if (files.length < 2) {
      addToast('warning', 'Please select at least 2 PDF files to merge');
      return;
    }

    setLoading(true);
    try {
      const mergedPdfBlob = await mergePdfs(files);
      const url = window.URL.createObjectURL(mergedPdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `merged-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      addToast('success', 'PDFs merged successfully!');
      setFiles([]);
    } catch (error) {
      console.error('Merge failed:', error);
      addToast('error', 'Failed to merge PDFs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageLayout
      title="Merge PDFs"
      description="Combine multiple PDF files into a single document. Fast, secure, and easy."
    >
      <div className="space-y-8">
        <FileUpload
            files={files}
            setFiles={setFiles}
            maxFiles={20}
            accept={{ 'application/pdf': ['.pdf'] }}
        />

        <div className="flex justify-end pt-4 border-t border-border/50">
            <Button
                onClick={handleMerge}
                disabled={files.length < 2 || loading}
                isLoading={loading}
                size="lg"
            >
                {loading ? 'MERGING...' : (
                    <>
                        MERGE FILES <Download className="ml-2 w-4 h-4" />
                    </>
                )}
            </Button>
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default MergeView;
