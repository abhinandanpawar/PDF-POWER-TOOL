import React, { useState, useRef, useEffect } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import { useToasts } from '../hooks/useToasts';
import { useDropzone } from 'react-dropzone';
import QRCode from 'qrcode';

const BadgeIdCardMakerView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { addToast } = useToasts();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [name, setName] = useState('Jane Doe');
  const [title, setTitle] = useState('Software Engineer');
  const [company, setCompany] = useState('Tech Corp');
  const [idNumber, setIdNumber] = useState('12345');
  const [photo, setPhoto] = useState<HTMLImageElement | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    const details = `Name: ${name}\nTitle: ${title}\nCompany: ${company}\nID: ${idNumber}`;
    QRCode.toDataURL(details, (err, url) => {
      if (err) console.error(err);
      setQrCodeUrl(url);
    });
  }, [name, title, company, idNumber]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 400;
    const height = 600;
    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, width, height);

    if (photo) {
        ctx.drawImage(photo, width/2 - 75, 50, 150, 150);
    } else {
        ctx.fillStyle = '#ccc';
        ctx.fillRect(width/2 - 75, 50, 150, 150);
    }

    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.font = 'bold 30px Arial';
    ctx.fillText(name, width / 2, 250);
    ctx.font = '20px Arial';
    ctx.fillText(title, width / 2, 280);
    ctx.font = 'italic 18px Arial';
    ctx.fillText(company, width / 2, 310);

    if (qrCodeUrl) {
      const qrImg = new Image();
      qrImg.onload = () => {
        ctx.drawImage(qrImg, width/2 - 75, 350, 150, 150);
      };
      qrImg.src = qrCodeUrl;
    }
  };

  useEffect(() => {
    drawCanvas();
  }, [name, title, company, photo, qrCodeUrl]);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => setPhoto(img);
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
      link.download = 'id-card.png';
      link.click();
    }
  };

  return (
    <ToolPageLayout
      title="Badge/ID Card Maker"
      onBack={onBack}
      description="Create a badge or ID card with a photo and QR code."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div {...getRootProps()} className="p-6 border-2 border-dashed rounded-md text-center cursor-pointer">
            <input {...getInputProps()} />
            <p>Upload Photo</p>
          </div>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="w-full p-2 border rounded" />
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded" />
          <input type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="Company" className="w-full p-2 border rounded" />
          <input type="text" value={idNumber} onChange={e => setIdNumber(e.target.value)} placeholder="ID Number" className="w-full p-2 border rounded" />
          <button onClick={handleDownload} className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Download PNG
          </button>
        </div>
        <div className="md:col-span-2">
          <canvas ref={canvasRef} className="border rounded-md w-full"></canvas>
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default BadgeIdCardMakerView;
