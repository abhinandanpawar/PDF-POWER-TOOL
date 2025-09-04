import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import ToolPageLayout from '../components/ToolPageLayout';
import { Button } from '../components/Button';
import { Dropzone } from '../components/Dropzone';
import { Steps } from '../components/Steps';
import { getCroppedImg, resizeImage } from './imageUtils';

const STEPS = ['Upload', 'Crop', 'Resize', 'Finish'];

const ImageEditorView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [image, setImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setCurrentStep(1);
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
        setCurrentStep(2);
      }
    } catch (e) {
      console.error(e);
    }
  }, [image, croppedAreaPixels]);

  const handleResize = async () => {
    if (!croppedImage) return;
    const resized = await resizeImage(croppedImage, width, height);
    setResizedImage(resized);
    setCurrentStep(3);
  };

  const handleDownload = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setImage(null);
    setCroppedImage(null);
    setResizedImage(null);
    setCurrentStep(0);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Dropzone onFile={handleFile} accept="image/*" />;
      case 1:
        return (
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
        );
      case 2:
        return (
          <div className="text-center">
            <img src={croppedImage} alt="Cropped" className="mx-auto" />
            <div className="mt-4">
              <div className="flex justify-center items-center space-x-4">
                <input
                  type="number"
                  placeholder="Width"
                  onChange={(e) => setWidth(parseInt(e.target.value))}
                  className="p-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="Height"
                  onChange={(e) => setHeight(parseInt(e.target.value))}
                  className="p-2 border rounded"
                />
                <Button onClick={handleResize}>Resize Image</Button>
              </div>
              <div className="mt-4">
                <Button onClick={() => handleDownload(croppedImage, 'cropped-image.png')}>Download Cropped Image</Button>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="text-center">
            <img src={resizedImage} alt="Resized" className="mx-auto" />
            <div className="mt-4">
              <Button onClick={() => handleDownload(resizedImage, 'resized-image.png')}>Download Resized Image</Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ToolPageLayout
      title="Image Editor"
      onBack={onBack}
      description="Crop, resize, and edit your images."
    >
      <div className="mb-8">
        <Steps steps={STEPS} currentStep={currentStep} />
      </div>

      {renderStep()}

      <div className="mt-8 flex justify-center space-x-4">
        {currentStep > 0 && (
          <Button onClick={handleBack}>Back</Button>
        )}
        {currentStep > 0 && (
          <Button onClick={handleReset}>Reset</Button>
        )}
      </div>
    </ToolPageLayout>
  );
};

export default ImageEditorView;
