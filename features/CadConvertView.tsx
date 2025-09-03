import React, { useState, useRef, useEffect } from 'react';
import ToolPageLayout from '../components/ToolPageLayout';
import FileUpload from '../components/FileUpload';
import { useToasts } from '../hooks/useToasts';
import { useLoading } from '../hooks/useLoading';
import * as THREE from 'three';
import { DxfParser } from 'dxf-parser';
import jsPDF from 'jspdf';

declare const DxfViewer: any;

const CadConvertView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [files, setFiles] = useState<File[]>([]);
  const { addToast } = useToasts();
  const { showLoading, hideLoading } = useLoading();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleConvert = async () => {
    if (files.length === 0) {
      addToast('error', 'Please select a DXF file to convert.');
      return;
    }
    if (files.length > 1) {
        addToast('error', 'Please select only one file.');
        return;
    }

    showLoading();
    try {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileText = event.target?.result as string;
        const parser = new DxfParser();
        const dxf = parser.parseSync(fileText);

        if (canvasRef.current) {
          const viewer = new DxfViewer(canvasRef.current, {
            autoResize: false,
            width: 800,
            height: 600,
          });
          viewer.loadDxf(dxf);

          setTimeout(() => {
            const canvas = canvasRef.current;
            if (canvas) {
              const imgData = canvas.toDataURL('image/png');
              const pdf = new jsPDF();
              const pdfWidth = pdf.internal.pageSize.getWidth();
              const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
              pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
              pdf.save('converted.pdf');
              setFiles([]);
              addToast('success', 'Converted to PDF successfully! Your download has started.');
            }
          }, 1000); // Wait for rendering
        }
      };
      reader.readAsText(file);
    } catch (e) {
      addToast('error', (e as Error).message);
    } finally {
      hideLoading();
    }
  };

  return (
    <ToolPageLayout
      title="CAD to PDF"
      description="Convert DXF (Drawing Exchange Format) files to PDF."
      onBack={onBack}
    >
      <div className="space-y-6">
        <FileUpload files={files} setFiles={setFiles} accept=".dxf" />
        <canvas ref={canvasRef} style={{ display: 'none' }} width="800" height="600"></canvas>
        <button
          onClick={handleConvert}
          disabled={files.length === 0}
          className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-hover disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          Convert to PDF
        </button>
      </div>
    </ToolPageLayout>
  );
};

export default CadConvertView;
