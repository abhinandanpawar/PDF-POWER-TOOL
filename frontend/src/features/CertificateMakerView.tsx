import React, { useState, useRef } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import { useToasts } from '../hooks/useToasts';

const CertificateMakerView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { addToast } = useToasts();
  const [name, setName] = useState('John Doe');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const svgRef = useRef<SVGSVGElement>(null);

  const CertificateSvg = ({ name, date }: { name: string, date: string }) => (
    <svg ref={svgRef} width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="600" fill="#f0f8ff" />
      <rect x="20" y="20" width="760" height="560" fill="none" stroke="#4682b4" strokeWidth="10" />
      <g transform="translate(400, 200)">
        <text textAnchor="middle" y="-50" fontSize="48" fill="#4682b4" fontFamily="serif">
          Certificate of Achievement
        </text>
        <text textAnchor="middle" y="20" fontSize="24" fill="#333" fontFamily="sans-serif">
          This certificate is proudly presented to
        </text>
        <text textAnchor="middle" y="90" fontSize="40" fill="#d2691e" fontFamily="serif" fontWeight="bold">
          {name}
        </text>
        <text textAnchor="middle" y="150" fontSize="24" fill="#333" fontFamily="sans-serif">
          for outstanding performance and dedication.
        </text>
        <line x1="-200" y1="200" x2="-50" y2="200" stroke="#333" strokeWidth="2" />
        <text x="-125" y="220" textAnchor="middle" fontSize="18" fill="#333" fontFamily="sans-serif">
          Date
        </text>
        <text x="-125" y="190" textAnchor="middle" fontSize="18" fill="#333" fontFamily="sans-serif">
          {date}
        </text>
        <line x1="50" y1="200" x2="200" y2="200" stroke="#333" strokeWidth="2" />
        <text x="125" y="220" textAnchor="middle" fontSize="18" fill="#333" fontFamily="sans-serif">
          Signature
        </text>
      </g>
    </svg>
  );

  const handleDownload = () => {
    if (!svgRef.current) {
      addToast({ type: 'error', message: 'Could not find the certificate SVG.' });
      return;
    }

    const svg = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);

    const canvas = document.createElement('canvas');
    canvas.width = svg.width.baseVal.value;
    canvas.height = svg.height.baseVal.value;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        addToast({ type: 'error', message: 'Could not get canvas context.' });
        return;
    }

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'certificate.png';
      link.href = pngFile;
      link.click();
      addToast({ type: 'success', message: 'Certificate downloaded as PNG!' });
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <ToolPageLayout
      title="Certificate Maker"
      onBack={onBack}
      description="Create a custom certificate and download it as a PNG."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <input type="text" placeholder="Recipient's Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded" />
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border rounded" />
          <button onClick={handleDownload} className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Download as PNG
          </button>
        </div>
        <div>
          <CertificateSvg name={name} date={date} />
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default CertificateMakerView;
