import React, { useState, useRef, useEffect } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import { useToasts } from '../hooks/useToasts';

const BusinessCardView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { addToast } = useToasts();
  const frontCanvasRef = useRef<HTMLCanvasElement>(null);
  const backCanvasRef = useRef<HTMLCanvasElement>(null);

  const [name, setName] = useState('John Smith');
  const [title, setTitle] = useState('Software Engineer');
  const [company, setCompany] = useState('Tech Solutions Inc.');
  const [phone, setPhone] = useState('555-123-4567');
  const [email, setEmail] = useState('john.smith@techsolutions.com');
  const [website, setWebsite] = useState('www.techsolutions.com');

  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');

  const drawCard = (side: 'front' | 'back') => {
    const canvas = side === 'front' ? frontCanvasRef.current : backCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1004;
    const height = 650;
    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    if (side === 'front') {
      ctx.fillStyle = '#003366';
      ctx.textAlign = 'center';
      ctx.font = 'bold 80px Arial';
      ctx.fillText(name, width / 2, height / 2 - 40);
      ctx.font = '40px Arial';
      ctx.fillText(title, width / 2, height / 2 + 40);
      ctx.font = 'italic 30px Arial';
      ctx.fillText(company, width / 2, height / 2 + 100);
    } else { // Back side
      ctx.fillStyle = '#333';
      ctx.textAlign = 'left';
      ctx.font = '30px Arial';
      ctx.fillText(`Phone: ${phone}`, 50, 100);
      ctx.fillText(`Email: ${email}`, 50, 160);
      ctx.fillText(`Website: ${website}`, 50, 220);

      ctx.textAlign = 'right';
      ctx.font = 'bold 50px Arial';
      ctx.fillStyle = '#003366';
      ctx.fillText(company, width - 50, height - 50);
    }
  };

  useEffect(() => {
    drawCard('front');
    drawCard('back');
  }, [name, title, company, phone, email, website]);

  const handleDownload = (side: 'front' | 'back') => {
    const canvas = side === 'front' ? frontCanvasRef.current : backCanvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `business-card-${side}.png`;
      link.click();
      addToast({ type: 'success', message: `Downloaded ${side} side.` });
    }
  };

  return (
    <ToolPageLayout title="Business Card Maker" onBack={onBack} description="Design a two-sided business card.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Card Details</h3>
          <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded" />
          <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded" />
          <input type="text" placeholder="Company" value={company} onChange={e => setCompany(e.target.value)} className="w-full p-2 border rounded" />
          <input type="tel" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-2 border rounded" />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border rounded" />
          <input type="text" placeholder="Website" value={website} onChange={e => setWebsite(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div>
          <div className="flex space-x-2 mb-4">
            <button onClick={() => setActiveSide('front')} className={`px-4 py-2 rounded ${activeSide === 'front' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Front</button>
            <button onClick={() => setActiveSide('back')} className={`px-4 py-2 rounded ${activeSide === 'back' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Back</button>
          </div>
          <div className={activeSide === 'front' ? 'block' : 'hidden'}>
            <canvas ref={frontCanvasRef} className="border rounded-md w-full"></canvas>
            <button onClick={() => handleDownload('front')} className="mt-2 w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Download Front</button>
          </div>
          <div className={activeSide === 'back' ? 'block' : 'hidden'}>
            <canvas ref={backCanvasRef} className="border rounded-md w-full"></canvas>
            <button onClick={() => handleDownload('back')} className="mt-2 w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Download Back</button>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default BusinessCardView;
