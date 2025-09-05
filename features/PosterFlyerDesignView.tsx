import React, { useState, useRef, useEffect } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import { useToasts } from '../hooks/useToasts';
import { Canvas, IText, Image } from 'fabric';
import FileUpload from '../components/FileUpload';
import { useDropzone } from 'react-dropzone';

const PosterFlyerDesignView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { addToast } = useToasts();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = new Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: '#fff',
      });
      fabricCanvasRef.current = canvas;
    }
    return () => {
      fabricCanvasRef.current?.dispose();
    };
  }, []);

  const addText = () => {
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      const text = new IText('Editable Text', {
        left: 100,
        top: 100,
        fontFamily: 'Arial',
        fill: '#000',
      });
      canvas.add(text);
      canvas.setActiveObject(text);
    }
  };

  const [imageFile, setImageFile] = useState<File[]>([]);

  useEffect(() => {
    if (imageFile.length > 0 && fabricCanvasRef.current) {
      const file = imageFile[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const imgElement = document.createElement('img');
        imgElement.src = e.target?.result as string;
        imgElement.onload = () => {
          const imgInstance = new Image(imgElement, {
            left: 150,
            top: 150,
            scaleX: 0.5,
            scaleY: 0.5,
          });
          fabricCanvasRef.current?.add(imgInstance);
        };
      };
      reader.readAsDataURL(file);
    }
  }, [imageFile]);

  const handleExport = () => {
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1.0,
      });
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'poster-design.png';
      link.click();
      addToast({ type: 'success', message: 'Poster exported as PNG!' });
    }
  };

  return (
    <ToolPageLayout
      title="Poster/Flyer Design"
      onBack={onBack}
      description="Design a poster or flyer with text and images."
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          <button onClick={addText} className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Add Text
          </button>
          <FileUpload files={imageFile} setFiles={setImageFile} accept="image/*" multiple={false} />
          <button onClick={handleExport} className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Export as PNG
          </button>
        </div>
        <div className="md:col-span-3">
          <canvas ref={canvasRef} className="border rounded-md"></canvas>
        </div>
      </div>
    </ToolPageLayout>
  );
};

export default PosterFlyerDesignView;
