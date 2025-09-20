import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
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
import MarkdownConvertView from './features/MarkdownConvertView';
import PptConvertView from './features/PptConvertView';
import SpreadsheetConvertView from './features/SpreadsheetConvertView';
import CsvXlsxView from './features/CsvXlsxView';
import AudioConvertView from './features/AudioConvertView';
import VideoConvertView from './features/VideoConvertView';
import PdfToImagesView from './features/PdfToImagesView';
import DeletePagesView from './features/DeletePagesView';
import ProtectView from './features/ProtectView';
import RotatePagesView from './features/RotatePagesView';
import ExtractTextView from './features/ExtractTextView';
import ReorderPagesView from './features/ReorderPagesView';
import GetMetadataView from './features/GetMetadataView';
import SetMetadataView from './features/SetMetadataView';
import CadConvertView from './features/CadConvertView';
import JsonFormatterView from './features/JsonFormatterView';
import DataCleanerView from './features/DataCleanerView';
import ConfigConverterView from './features/ConfigConverterView';
import CsvJsonConverterView from './features/CsvJsonConverterView';
import QrCodeGeneratorView from './features/QrCodeGeneratorView';
import BasicInvoicePdfView from './features/BasicInvoicePdfView';
import InvitationCardView from './features/InvitationCardView';
import CertificateMakerView from './features/CertificateMakerView';
import ResumeBuilderView from './features/ResumeBuilderView';
import BusinessCardView from './features/BusinessCardView';
import PosterFlyerDesignView from './features/PosterFlyerDesignView';
import QuoteImageCreatorView from './features/QuoteImageCreatorView';
import TimelineRoadmapBuilderView from './features/TimelineRoadmapBuilderView';
import AvatarGeneratorView from './features/AvatarGeneratorView';
import FaviconGeneratorView from './features/FaviconGeneratorView';
import MemeMakerView from './features/MemeMakerView';
import BadgeIdCardMakerView from './features/BadgeIdCardMakerView';
import ReloadPrompt from './components/ReloadPrompt';
import PasswordGeneratorView from './features/PasswordGeneratorView';
import FileExporterView from './features/FileExporterView';

const toolViewMap: { [key in Tool]?: React.ComponentType<{}> } = {
    [Tool.Merge]: MergeView,
    [Tool.Split]: SplitView,
    [Tool.Compress]: CompressView,
    [Tool.Watermark]: WatermarkView,
    [Tool.PdfToWord]: PdfToWordView,
    [Tool.DocToPdf]: DocToPdfView,
    [Tool.DocToTxt]: DocToTxtView,
    [Tool.MarkdownConvert]: MarkdownConvertView,
    [Tool.PptConvert]: PptConvertView,
    [Tool.SpreadsheetConvert]: SpreadsheetConvertView,
    [Tool.CsvXlsxConvert]: CsvXlsxView,
    [Tool.AudioConvert]: AudioConvertView,
    [Tool.VideoConvert]: VideoConvertView,
    [Tool.PdfToImages]: PdfToImagesView,
    [Tool.FileExporter]: FileExporterView,
    [Tool.DeletePages]: DeletePagesView,
    [Tool.Protect]: ProtectView,
    [Tool.RotatePages]: RotatePagesView,
    [Tool.ExtractText]: ExtractTextView,
    [Tool.ReorderPages]: ReorderPagesView,
    [Tool.GetMetadata]: GetMetadataView,
    [Tool.SetMetadata]: SetMetadataView,
    [Tool.JsonFormat]: JsonFormatterView,
    [Tool.DataClean]: DataCleanerView,
    [Tool.ConfigConvert]: ConfigConverterView,
    [Tool.CsvJsonConverter]: CsvJsonConverterView,
    [Tool.PasswordGenerator]: PasswordGeneratorView,
    [Tool.QrCodeGenerator]: QrCodeGeneratorView,
    [Tool.BasicInvoicePdf]: BasicInvoicePdfView,
    [Tool.InvitationCard]: InvitationCardView,
    [Tool.CertificateMaker]: CertificateMakerView,
    [Tool.ResumeBuilder]: ResumeBuilderView,
    [Tool.BusinessCard]: BusinessCardView,
    [Tool.PosterFlyerDesign]: PosterFlyerDesignView,
    [Tool.QuoteImageCreator]: QuoteImageCreatorView,
    [Tool.TimelineRoadmapBuilder]: TimelineRoadmapBuilderView,
    [Tool.AvatarGenerator]: AvatarGeneratorView,
    [Tool.FaviconGenerator]: FaviconGeneratorView,
    [Tool.MemeMaker]: MemeMakerView,
    [Tool.BadgeIdCardMaker]: BadgeIdCardMakerView,
    [Tool.CadConvert]: CadConvertView,
};

const App: React.FC = () => {
  const groupedTools = TOOLS.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<ToolCategory, ToolInfo[]>);

  return (
    <div className="min-h-screen bg-background font-sans">
      <LoadingOverlay />
      <ToastContainer />
      <ReloadPrompt />
      <header className="bg-secondary p-4 sticky top-0 z-10 border-b border-border">
        <div className="container mx-auto max-w-6xl">
          <Link to="/">
            <h1
              className="text-2xl font-bold text-black cursor-pointer"
            >
              PDF Power Toolbox
            </h1>
          </Link>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-8 max-w-6xl">
        <Routes>
          <Route path="/" element={
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
                          <Link to={`/${tool.key.toLowerCase()}`} key={tool.key}>
                            <ToolCard
                              tool={tool}
                            />
                          </Link>
                      ))}
                      </div>
                  </section>
                  ))}
              </div>
            </div>
          } />
          {TOOLS.map(tool => {
            const ToolComponent = toolViewMap[tool.key];
            if (!ToolComponent) return null;
            return (
              <Route
                key={tool.key}
                path={`/${tool.key.toLowerCase()}`}
                element={<ToolComponent />}
              />
            );
          })}
        </Routes>
      </main>
      <footer className="text-center p-4 mt-8 text-text-secondary border-t border-border">
          <p>&copy; {new Date().getFullYear()} PDF Power Toolbox. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;