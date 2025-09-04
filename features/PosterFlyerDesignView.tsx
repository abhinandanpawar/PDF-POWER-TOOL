import React, { useState, useRef, useEffect } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import { useToasts } from '../hooks/useToasts';
import { fabric } from 'fabric';
import { useDropzone } from 'react-dropzone';

const PosterFlyerDesignView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { addToast } = useToasts();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = new fabric.Canvas(canvasRef.current, {
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
      const text = new fabric.IText('Editable Text', {
        left: 100,
        top: 100,
        fontFamily: 'Arial',
        fill: '#000',
      });
      canvas.add(text);
      canvas.setActiveObject(text);
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const imgElement = document.createElement('img');
        imgElement.src = e.target?.result as string;
        imgElement.onload = () => {
          const imgInstance = new fabric.Image(imgElement, {
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
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'image/*': [] } });

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
          <div {...getRootProps()} className="p-4 border-2 border-dashed rounded-md text-center cursor-pointer">
            <input {...getInputProps()} />
            <p>Add Image</p>
          </div>
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
