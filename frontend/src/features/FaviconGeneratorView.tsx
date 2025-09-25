import React, { useState, useRef, useEffect } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import { useToasts } from '../hooks/useToasts';
import { PngIcoConverter } from '../src/lib/png2ico.js';

const FaviconGeneratorView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { addToast } = useToasts();
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState('A');
  const [bgColor, setBgColor] = useState('#ff0000');
  const [textColor, setTextColor] = useState('#ffffff');

  const drawPreview = () => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 128;
    canvas.height = 128;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = textColor;
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text.slice(0, 2), 64, 64);
  };

  useEffect(() => {
    drawPreview();
  }, [text, bgColor, textColor]);

  const handleDownload = async () => {
    const size = 48;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = textColor;
    ctx.font = `bold ${size * 0.7}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text.slice(0, 2), size / 2, size / 2);
    
    const dataUrl = canvas.toDataURL('image/png');
    const res = await fetch(dataUrl);
    const buffer = await res.arrayBuffer();
    const png = new Uint8Array(buffer);

    try {
      const converter = new PngIcoConverter();
      const icoBuffer = await converter.convert(png);
      const blob = new Blob([icoBuffer], { type: 'image/x-icon' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'favicon.ico';
      link.click();
      URL.revokeObjectURL(url);
      addToast({ type: 'success', message: 'Favicon.ico downloaded!' });
    } catch (error) {
      addToast({ type: 'error', message: 'Failed to generate ICO file.' });
      console.error(error);
    }
  };

  return (
    <ToolPageLayout
      title="Favicon Generator"
      onBack={onBack}
      description="Generate a favicon from text."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={2}
            className="w-full p-2 border rounded"
            placeholder="Text (1-2 chars)"
          />
          <div className="flex items-center gap-2">
            <label>BG:</label>
            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="p-1 h-10 w-10 border rounded" />
            <label>Text:</label>
            <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="p-1 h-10 w-10 border rounded" />
          </div>
          <button onClick={handleDownload} className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Download .ico
          </button>
        </div>
        <div className="md:col-span-2 flex items-center justify-center bg-gray-100 p-4 rounded-md">
          <canvas ref={previewCanvasRef} className="border rounded-md"></canvas>
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default FaviconGeneratorView;