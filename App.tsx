import React, { useState } from 'react';
import ToastContainer from './components/ToastContainer';
import LoadingOverlay from './components/LoadingOverlay';
import { TOOLS } from './constants';
import ToolCard from './components/ToolCard';
import { Tool, ToolCategory, ToolInfo } from './types';

// Import all feature components
import MergeView from './features/MergeView';
import SplitView from './features/SplitView';
import CompressView from './features/CompressView';
import WatermarkView from './features/WatermarkView';
import PdfToWordView from './features/PdfToWordView';
import DocToPdfView from './features/DocToPdfView';
import DocToTxtView from './features/DocToTxtView';
import ImageConvertView from './features/ImageConvertView';
import MarkdownConvertView from './features/MarkdownConvertView';
import PptConvertView from './features/PptConvertView';
import SpreadsheetConvertView from './features/SpreadsheetConvertView';
import CsvXlsxView from './features/CsvXlsxView';
import PdfToImagesView from './features/PdfToImagesView';
import DeletePagesView from './features/DeletePagesView';
import ProtectView from './features/ProtectView';
import RotatePagesView from './features/RotatePagesView';
import ExtractTextView from './features/ExtractTextView';
import ReorderPagesView from './features/ReorderPagesView';
import GetMetadataView from './features/GetMetadataView';
import SetMetadataView from './features/SetMetadataView';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);

  const handleSelectTool = (tool: Tool) => {
    setActiveTool(tool);
    window.scrollTo(0, 0);
  };
  
  const handleGoBack = () => {
    setActiveTool(null);
  };

  const groupedTools = TOOLS.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<ToolCategory, ToolInfo[]>);
  
  const renderActiveTool = () => {
    switch (activeTool) {
      case Tool.Merge: return <MergeView onBack={handleGoBack} />;
      case Tool.Split: return <SplitView onBack={handleGoBack} />;
      case Tool.Compress: return <CompressView onBack={handleGoBack} />;
      case Tool.Watermark: return <WatermarkView onBack={handleGoBack} />;
      case Tool.PdfToWord: return <PdfToWordView onBack={handleGoBack} />;
      case Tool.DocToPdf: return <DocToPdfView onBack={handleGoBack} />;
      case Tool.DocToTxt: return <DocToTxtView onBack={handleGoBack} />;
      case Tool.ImageConvert: return <ImageConvertView onBack={handleGoBack} />;
      case Tool.MarkdownConvert: return <MarkdownConvertView onBack={handleGoBack} />;
      case Tool.PptConvert: return <PptConvertView onBack={handleGoBack} />;
      case Tool.SpreadsheetConvert: return <SpreadsheetConvertView onBack={handleGoBack} />;
      case Tool.CsvXlsxConvert: return <CsvXlsxView onBack={handleGoBack} />;
      case Tool.PdfToImages: return <PdfToImagesView onBack={handleGoBack} />;
      case Tool.DeletePages: return <DeletePagesView onBack={handleGoBack} />;
      case Tool.Protect: return <ProtectView onBack={handleGoBack} />;
      case Tool.RotatePages: return <RotatePagesView onBack={handleGoBack} />;
      case Tool.ExtractText: return <ExtractTextView onBack={handleGoBack} />;
      case Tool.ReorderPages: return <ReorderPagesView onBack={handleGoBack} />;
      case Tool.GetMetadata: return <GetMetadataView onBack={handleGoBack} />;
      case Tool.SetMetadata: return <SetMetadataView onBack={handleGoBack} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <LoadingOverlay />
      <ToastContainer />
      <header className="bg-secondary p-4 shadow-md sticky top-0 z-10 border-b border-border">
        <div className="container mx-auto max-w-6xl">
          <h1 
            className="text-2xl font-bold text-white cursor-pointer"
            onClick={handleGoBack}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleGoBack()}
          >
            PDF Power Toolbox
          </h1>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-8 max-w-6xl">
        {activeTool ? (
          renderActiveTool()
        ) : (
          <div className="animate-fade-in">
            <div className="text-center mb-12">
                <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 text-text-primary tracking-tight">
                The Ultimate PDF Power Toolbox
                </h2>
                <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto">
                Effortlessly merge, split, compress, convert, and edit your PDF files with our comprehensive suite of powerful, easy-to-use tools.
                </p>
            </div>

            <div className="space-y-12">
                {Object.entries(groupedTools).map(([category, tools]) => (
                <section key={category}>
                    <h3 className="text-2xl font-bold text-text-primary mb-6 border-b-2 border-border pb-2">
                    {category}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {tools.map(tool => (
                        <ToolCard 
                          key={tool.key} 
                          tool={tool} 
                          onSelect={() => handleSelectTool(tool.key)} 
                        />
                    ))}
                    </div>
                </section>
                ))}
            </div>
          </div>
        )}
      </main>
      <footer className="text-center p-4 mt-8 text-text-secondary border-t border-border">
          <p>&copy; {new Date().getFullYear()} PDF Power Toolbox. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;