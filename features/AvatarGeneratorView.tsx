import React, { useState, useEffect } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import { useToasts } from '../hooks/useToasts';
import { createAvatar } from '@dicebear/core';
import * as collection from '@dicebear/collection';

const AvatarGeneratorView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { addToast } = useToasts();
  const [seed, setSeed] = useState('John Doe');
  const [style, setStyle] = useState<keyof typeof collection>('adventurer');
  const [avatarSvg, setAvatarSvg] = useState('');

  const styles = Object.keys(collection) as (keyof typeof collection)[];

  useEffect(() => {
    const avatar = createAvatar(collection[style], {
      seed,
    });
    setAvatarSvg(avatar.toString());
  }, [seed, style]);

  const handleRandomize = () => {
    setSeed(Math.random().toString(36).substring(7));
  };

  const handleDownload = () => {
    const blob = new Blob([avatarSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${seed}-${style}.svg`;
    link.click();
    URL.revokeObjectURL(url);
    addToast({ type: 'success', message: 'Avatar downloaded successfully!' });
  };

  return (
    <ToolPageLayout
      title="Avatar Generator"
      onBack={onBack}
      description="Generate a random avatar with different styles."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <input
            type="text"
            placeholder="Enter a seed"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <select value={style} onChange={e => setStyle(e.target.value as keyof typeof collection)} className="w-full p-2 border rounded">
            {styles.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={handleRandomize} className="w-full px-4 py-2 bg-gray-200 rounded">
            Randomize
          </button>
          <button onClick={handleDownload} className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Download SVG
          </button>
        </div>
        <div className="md:col-span-2 flex items-center justify-center bg-gray-100 p-4 rounded-md">
          {avatarSvg && <img src={`data:image/svg+xml;utf8,${encodeURIComponent(avatarSvg)}`} alt="Generated Avatar" className="w-64 h-64" />}
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default AvatarGeneratorView;
