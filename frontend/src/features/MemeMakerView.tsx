import React, { useState, useRef, useEffect } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import { useToasts } from '../hooks/useToasts';
import FileUpload from '../components/FileUpload';
import { useDropzone } from 'react-dropzone';

const MemeMakerView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { addToast } = useToasts();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [topText, setTopText] = useState('Top Text');
  const [bottomText, setBottomText] = useState('Bottom Text');
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (image) {
        const aspectRatio = image.width / image.height;
        canvas.width = 800;
        canvas.height = 800 / aspectRatio;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    } else {
        canvas.width = 800;
        canvas.height = 600;
        ctx.fillStyle = '#ccc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.font = '30px Arial';
        ctx.fillText('Upload an image to start', canvas.width / 2, canvas.height / 2);
        return;
    }

    ctx.font = 'bold 60px Impact, Arial Black, sans-serif';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.textAlign = 'center';

    const x = canvas.width / 2;
    ctx.strokeText(topText.toUpperCase(), x, 80);
    ctx.fillText(topText.toUpperCase(), x, 80);

    ctx.strokeText(bottomText.toUpperCase(), x, canvas.height - 40);
    ctx.fillText(bottomText.toUpperCase(), x, canvas.height - 40);
  };

  useEffect(() => {
    drawCanvas();
  }, [topText, bottomText, image]);

  const [imageFile, setImageFile] = useState<File[]>([]);

  useEffect(() => {
    if (imageFile.length > 0) {
      const file = imageFile[0];
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => setImage(img);
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }, [imageFile]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas && image) {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'meme.png';
      link.click();
      addToast({ type: 'success', message: 'Meme downloaded successfully!' });
    } else {
        addToast({ type: 'error', message: 'Please upload an image first.' });
    }
  };

  return (
    <ToolPageLayout
      title="Meme Maker"
      onBack={onBack}
      description="Create a meme with top and bottom text."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <FileUpload files={imageFile} setFiles={setImageFile} accept="image/*" multiple={false} />
          <input
            type="text"
            value={topText}
            onChange={(e) => setTopText(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Top Text"
          />
          <input
            type="text"
            value={bottomText}
            onChange={(e) => setBottomText(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Bottom Text"
          />
          <button onClick={handleDownload} className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Download Meme
          </button>
        </div>
        <div className="md:col-span-2">
          <canvas ref={canvasRef} className="border rounded-md w-full"></canvas>
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default MemeMakerView;
