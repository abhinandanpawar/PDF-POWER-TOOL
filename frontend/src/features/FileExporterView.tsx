import React, { useState } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import Editor from '../components/Editor';
import { Tab } from '../src/state/notepad';
import { FileDown } from 'lucide-react';

const FILE_TYPES = [
  { name: 'Plain Text', extension: 'txt', language: 'javascript' },
  { name: 'Markdown', extension: 'md', language: 'markdown' },
  { name: 'JSON', extension: 'json', language: 'json' },
  { name: 'HTML', extension: 'html', language: 'html' },
  { name: 'CSS', extension: 'css', language: 'css' },
  { name: 'JavaScript', extension: 'js', language: 'javascript' },
  { name: 'XML', extension: 'xml', language: 'html' }, // Use html for xml highlighting
  { name: 'CSV', extension: 'csv', language: 'javascript' },
  { name: 'YAML', extension: 'yaml', language: 'javascript' },
];

const MIME_TYPES: { [key: string]: string } = {
  txt: 'text/plain',
  md: 'text/markdown',
  json: 'application/json',
  html: 'text/html',
  css: 'text/css',
  js: 'application/javascript',
  xml: 'application/xml',
  csv: 'text/csv',
  yaml: 'application/x-yaml',
};


const FileExporterView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [content, setContent] = useState('// Your content here');
  const [fileName, setFileName] = useState('my-file');
  const [selectedType, setSelectedType] = useState(FILE_TYPES[0]);

  const handleDownload = () => {
    if (!content) {
      alert('Content cannot be empty.');
      return;
    }
    if (!fileName) {
        alert('Filename cannot be empty.');
        return;
    }

    const mimeType = MIME_TYPES[selectedType.extension] || 'text/plain';
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.${selectedType.extension}`;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  };

  const handleTypeChange = (extension: string) => {
    const type = FILE_TYPES.find(t => t.extension === extension);
    if (type) {
      setSelectedType(type);
    }
  };

  return (
    <ToolPageLayout
      title="Text to File Exporter"
      onBack={onBack}
      description="Paste or type your content, choose a file type, and download it."
      fullWidth
    >
      <div className="flex flex-col h-[calc(100vh-250px)] gap-4">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow">
            <label htmlFor="filename" className="block text-sm font-medium mb-1">Filename</label>
            <input
              type="text"
              id="filename"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full p-2 bg-background-alt border border-border rounded-md"
              placeholder="my-file"
            />
          </div>
          <div className="flex-grow">
            <label htmlFor="filetype" className="block text-sm font-medium mb-1">File Type</label>
            <select
              id="filetype"
              value={selectedType.extension}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="w-full p-2 bg-background-alt border border-border rounded-md"
            >
              {FILE_TYPES.map(type => (
                <option key={type.extension} value={type.extension}>
                  {type.name} (.{type.extension})
                </option>
              ))}
            </select>
          </div>
          <div className="self-end">
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-colors"
            >
              <FileDown className="h-5 w-5" />
              Download
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-grow border border-border rounded-lg overflow-hidden">
          <Editor
            value={content}
            onChange={setContent}
            language={selectedType.language as Tab['language']}
          />
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default FileExporterView;
