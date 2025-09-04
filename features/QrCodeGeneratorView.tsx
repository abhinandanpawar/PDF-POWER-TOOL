import React, { useState, useRef } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import { useToasts } from '../hooks/useToasts';
import QRCode from 'qrcode';

const QrCodeGeneratorView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [text, setText] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { addToast } = useToasts();

  const handleGenerate = () => {
    if (!text) {
      addToast({ type: 'error', message: 'Please enter text or a URL.' });
      return;
    }
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, text, (error) => {
        if (error) {
          addToast({ type: 'error', message: 'Could not generate QR code.' });
          console.error(error);
        } else {
          addToast({ type: 'success', message: 'QR code generated!' });
        }
      });
    }
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'qrcode.png';
      link.click();
    }
  };

  return (
    <ToolPageLayout
      title="QR Code Generator"
      onBack={onBack}
      description="Generate a QR code from a URL or text."
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="qr-text" className="block text-sm font-medium text-gray-700">
            Text or URL
          </label>
          <input
            type="text"
            id="qr-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter the text or URL to encode."
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleGenerate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Generate
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Download
          </button>
        </div>
        <div className="mt-4">
          <canvas ref={canvasRef} className="border border-gray-300 rounded-md"></canvas>
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default QrCodeGeneratorView;
