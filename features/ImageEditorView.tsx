import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import ToolPageLayout from '../components/ToolPageLayout';
import { Button } from '../components/Button';
import { Dropzone } from '../components/Dropzone';
import getCroppedImg from './imageUtils';

const ImageEditorView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [image, setImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      if (image && croppedAreaPixels) {
        const croppedImage = await getCroppedImg(
          image,
          croppedAreaPixels,
        );
        setCroppedImage(croppedImage);
      }
    } catch (e) {
      console.error(e);
    }
  }, [image, croppedAreaPixels]);

  const handleDownload = () => {
    if (croppedImage) {
      const link = document.createElement('a');
      link.href = croppedImage;
      link.download = 'cropped-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <ToolPageLayout
      title="Image Editor"
      onBack={onBack}
      description="Crop, resize, and edit your images."
    >
      {!image && (
        <Dropzone onFile={handleFile} accept="image/*" />
      )}

      {image && !croppedImage && (
        <div className="relative h-[400px]">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <Button onClick={showCroppedImage}>Crop Image</Button>
          </div>
        </div>
      )}

      {croppedImage && (
        <div className="text-center">
          <img src={croppedImage} alt="Cropped" className="mx-auto" />
          <div className="mt-4">
            <Button onClick={handleDownload}>Download Cropped Image</Button>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
};

export default ImageEditorView;
