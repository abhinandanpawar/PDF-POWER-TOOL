import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { RotateCcw, RotateCw, FlipHorizontal, FlipVertical } from 'lucide-react';
import ToolPageLayout from '../components/ToolPageLayout';
import Button from '../components/Button';
import { Dropzone } from '../components/Dropzone';
import { Steps } from '../components/Steps';
import { getCroppedImg, resizeImage, transformImage } from './imageUtils';

const STEPS = ['Upload', 'Crop', 'Resize', 'Finish'];

const ImageEditorView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [image, setImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);

  const [rotation, setRotation] = useState(0);
  const [flip, setFlip] = useState({ horizontal: false, vertical: false });

  const [currentStep, setCurrentStep] = useState(0);

  const handleRotate = (angle: number) => {
    setRotation(rotation + angle);
  };

  const handleFlip = (axis: 'horizontal' | 'vertical') => {
    setFlip({ ...flip, [axis]: !flip[axis] });
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result as string;
      setImage(imageUrl);

      setOriginalImage(imageUrl);

      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);

        setAspectRatio(img.width / img.height);
      };
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
        const cropped = await getCroppedImg(
          image,
          croppedAreaPixels,
        );

        if (cropped) {
          const transformed = await transformImage(cropped, rotation, flip);
          setCroppedImage(transformed);
          setCurrentStep(2);
        }

        setCroppedImage(croppedImage);

        // Get dimensions of cropped image
        const img = new Image();
        img.src = croppedImage;
        img.onload = () => {
          setWidth(img.width);
          setHeight(img.height);
          setOriginalWidth(img.width);
          setOriginalHeight(img.height);
          setAspectRatio(img.width / img.height);
        };

        setCurrentStep(2);

      }
    } catch (e) {
      console.error(e);
    }
  }, [image, croppedAreaPixels, rotation, flip]);

  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>, dimension: 'width' | 'height') => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 0) {
      if (dimension === 'width') setWidth(0);
      else setHeight(0);
      return;
    }

    if (dimension === 'width') {
      setWidth(value);
      if (lockAspectRatio) {
        setHeight(Math.round(value / aspectRatio));
      }
    } else {
      setHeight(value);
      if (lockAspectRatio) {
        setWidth(Math.round(value * aspectRatio));
      }
    }
  };

  
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

  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
      if (step === 0) {
        setImage(null);
        setCroppedImage(null);
        setResizedImage(null);
      }
      if (step === 1) {
        setCroppedImage(null);
        setResizedImage(null);
      }
      if (step === 2) {
        setResizedImage(null);
      }
    }
  };

  const handleReset = () => {
    setImage(null);
    setOriginalImage(null);
    setCroppedImage(null);
    setResizedImage(null);
    setRotation(0);
    setFlip({ horizontal: false, vertical: false });
    setCurrentStep(0);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Dropzone onFile={handleFile} accept="image/*" />;
      case 1:
        return (
          <div className="relative h-[400px]">
            <div
              className="absolute inset-0"
              style={{
                transform: `scale(${flip.horizontal ? -1 : 1}, ${
                  flip.vertical ? -1 : 1
                })`,
              }}
            >
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={originalWidth / originalHeight || 1}
                rotation={rotation}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center space-x-2">
              <Button onClick={() => handleRotate(-90)} aria-label="Rotate Left"><RotateCcw /></Button>
              <Button onClick={() => handleRotate(90)} aria-label="Rotate Right"><RotateCw /></Button>
              <Button onClick={() => handleFlip('horizontal')} aria-label="Flip Horizontal"><FlipHorizontal /></Button>
              <Button onClick={() => handleFlip('vertical')} aria-label="Flip Vertical"><FlipVertical /></Button>
            </div>
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
                  value={width}
                  onChange={(e) => handleDimensionChange(e, 'width')}
                  className="p-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="Height"
                  value={height}
                  onChange={(e) => handleDimensionChange(e, 'height')}
                  className="p-2 border rounded"
                />
                <Button onClick={handleResize} disabled={width === 0 || height === 0}>Resize Image</Button>
              </div>
              <div className="mt-4 flex justify-center items-center">
                <input
                  type="checkbox"
                  id="lock-aspect-ratio"
                  checked={lockAspectRatio}
                  onChange={() => setLockAspectRatio(!lockAspectRatio)}
                  className="mr-2"
                />
                <label htmlFor="lock-aspect-ratio">Lock aspect ratio</label>
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
        <Steps steps={STEPS} currentStep={currentStep} onStepClick={handleStepClick} />
      </div>

      {renderStep()}

      <div className="mt-8 flex justify-center space-x-4">
        {currentStep > 0 && (
          <Button onClick={handleReset}>Reset</Button>
        )}
      </div>
    </ToolPageLayout>
  );
};

export default ImageEditorView;
