import React, { useState } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import { protectPdf } from '../services/apiService';
import { useToolLogic } from '../hooks/useToolLogic';

const ProtectView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [password, setPassword] = useState('');

  const { files, setFiles, handleProcess } = useToolLogic({
    conversionFunction: (files, options) => protectPdf(files, options?.password as string),
    successMessage: 'PDFs protected successfully! Your download has started.',
    errorMessage: 'Failed to protect PDFs',
    validate: (files) => {
      if (files.length === 0 || !password) {
        return 'Please select files and enter a password.';
      }
      return null;
    },
  });

  return (
    <ToolPageLayout
      title="Protect PDF"
      description="Encrypt your PDF files with a password to prevent unauthorized access."
      onBack={onBack}
    >
      <div className="space-y-6">
        <FileUpload files={files} setFiles={setFiles} />
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a strong password"
            className="w-full bg-secondary border border-border rounded-lg p-2 text-text-primary focus:ring-primary focus:border-primary"
            required
          />
        </div>
        <button
          onClick={() => handleProcess({ password })}
          disabled={files.length === 0 || !password}
          className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-hover disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          Protect PDFs
        </button>
      </div>
    </ToolPageLayout>
  );
};

export default ProtectView;