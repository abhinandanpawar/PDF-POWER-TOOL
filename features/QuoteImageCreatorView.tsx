import React, { useState, useRef, useEffect } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import { useToasts } from '../hooks/useToasts';
import FileUpload from '../components/FileUpload';
import { useDropzone } from 'react-dropzone';

const QuoteImageCreatorView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { addToast } = useToasts();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [quote, setQuote] = useState('The only way to do great work is to love what you do.');
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  const [font, setFont] = useState('Roboto');
  const [fontSize, setFontSize] = useState(48);
  const [textColor, setTextColor] = useState('#ffffff');

  const fonts = ['Roboto', 'Montserrat', 'Playfair Display', 'Lobster'];

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 800;
    const height = 600;
    canvas.width = width;
    canvas.height = height;

    // Background
    if (backgroundImage) {
      ctx.drawImage(backgroundImage, 0, 0, width, height);
    } else {
      ctx.fillStyle = '#333';
      ctx.fillRect(0, 0, width, height);
    }

    // Text wrapping logic
    const wrapText = (context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
      const words = text.split(' ');
      let line = '';
      const lines = [];

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          lines.push(line);
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);

      const totalTextHeight = lines.length * lineHeight;
      let startY = y - totalTextHeight / 2;

      for (let i = 0; i < lines.length; i++) {
        context.fillText(lines[i], x, startY + i * lineHeight);
      }
    };

    // Draw text
    ctx.fillStyle = textColor;
    ctx.font = `${fontSize}px ${font}`;
    ctx.textAlign = 'center';
    wrapText(ctx, quote, width / 2, height / 2, width - 100, fontSize * 1.2);
  };

  useEffect(() => {
    drawCanvas();
  }, [quote, backgroundImage, font, fontSize, textColor]);

  const [backgroundImageFile, setBackgroundImageFile] = useState<File[]>([]);

  useEffect(() => {
    if (backgroundImageFile.length > 0) {
      const file = backgroundImageFile[0];
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => setBackgroundImage(img);
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }, [backgroundImageFile]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'quote-image.png';
      link.click();
      addToast({ type: 'success', message: 'Image downloaded successfully!' });
    }
  };

  return (
    <ToolPageLayout
      title="Quote Image Creator"
      onBack={onBack}
      description="Create a beautiful image with your favorite quote."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <textarea
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            className="w-full p-2 border rounded"
            rows={5}
            placeholder="Enter your quote here"
          ></textarea>
          <select value={font} onChange={e => setFont(e.target.value)} className="w-full p-2 border rounded">
            {fonts.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <div className="flex items-center gap-2">
            <input type="number" value={fontSize} onChange={e => setFontSize(parseInt(e.target.value))} className="w-full p-2 border rounded" />
            <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="p-1 h-10 w-10 border rounded" />
          </div>
          <FileUpload files={backgroundImageFile} setFiles={setBackgroundImageFile} accept="image/*" multiple={false} />
          <button onClick={handleDownload} className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Download Image
          </button>
        </div>
        <div className="md:col-span-2">
          <canvas ref={canvasRef} className="border rounded-md w-full"></canvas>
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default QuoteImageCreatorView;
