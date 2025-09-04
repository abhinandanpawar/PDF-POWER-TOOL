import React, { useState, useRef, useEffect } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import { useToasts } from '../hooks/useToasts';
import { useDropzone } from 'react-dropzone';

const InvitationCardView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { addToast } = useToasts();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [title, setTitle] = useState('You\'re Invited!');
  const [message, setMessage] = useState('Join us for a celebration');
  const [details, setDetails] = useState('Date: 2025-12-25 | Time: 7:00 PM');
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    if (backgroundImage) {
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw text
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';

    ctx.font = 'bold 48px Arial';
    ctx.fillText(title, canvas.width / 2, 80);

    ctx.font = 'italic 24px Arial';
    ctx.fillText(message, canvas.width / 2, 140);

    ctx.font = '20px Arial';
    ctx.fillText(details, canvas.width / 2, 200);
  };

  useEffect(() => {
    drawCanvas();
  }, [title, message, details, backgroundImage]);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          setBackgroundImage(img);
          addToast({ type: 'success', message: 'Image loaded successfully!' });
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'image/*': [] } });

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'invitation-card.png';
      link.click();
    }
  };

  return (
    <ToolPageLayout
      title="Invitation Card Maker"
      onBack={onBack}
      description="Design a custom invitation card with text and a background image."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded" />
          <textarea value={message} onChange={e => setMessage(e.target.value)} className="w-full p-2 border rounded" rows={3}></textarea>
          <input type="text" value={details} onChange={e => setDetails(e.target.value)} className="w-full p-2 border rounded" />

          <div {...getRootProps()} className="p-6 border-2 border-dashed rounded-md text-center cursor-pointer">
            <input {...getInputProps()} />
            <p>Drag 'n' drop a background image here, or click to select one.</p>
          </div>

          <button onClick={handleDownload} className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Download Card
          </button>
        </div>
        <div>
          <canvas ref={canvasRef} width={500} height={300} className="border rounded-md"></canvas>
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default InvitationCardView;
