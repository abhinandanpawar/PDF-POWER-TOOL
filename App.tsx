import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ToastContainer from './components/ToastContainer';
import LoadingOverlay from './components/LoadingOverlay';
import { TOOLS } from './constants';
import ToolCard from './components/ToolCard';
import Grid from './components/Grid';
import Container from './components/Container';
import Header from './components/Header';
import SkeletonCard from './components/SkeletonCard';
import ErrorBoundary from './components/ErrorBoundary';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Simulate a 1.5 second loading time
    return () => clearTimeout(timer);
  }, []);

  const groupedTools = TOOLS.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<ToolCategory, ToolInfo[]>);

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <LoadingOverlay />
      <ToastContainer />
      <ReloadPrompt />
      <Header />
      <main className="flex-grow">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={
              <Container className="py-8">
              <div className="animate-fade-in">
                <div className="text-center mb-12">
                    <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 text-foreground tracking-tight">
                    The Ultimate PDF Power Toolbox
                    </h2>
                    <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                    Effortlessly merge, split, compress, convert, and edit your PDF files with our comprehensive suite of powerful, easy-to-use tools.
                    </p>
                </div>

                <div className="space-y-12">
                  {loading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <section key={i} className="bg-card border border-border rounded-xl p-6">
                          <div className="h-8 w-1/4 rounded-md bg-muted/50 animate-pulse mb-6" />
                          <Grid>
                            {Array.from({ length: 4 }).map((_, j) => (
                              <SkeletonCard key={j} />
                            ))}
                          </Grid>
                        </section>
                      ))
                    : Object.entries(groupedTools).map(([category, tools]) => (
                        <section key={category} className="bg-card border border-border rounded-xl p-6">
                          <h3 className="text-2xl font-bold text-foreground mb-6">
                            {category}
                          </h3>
                          <Grid>
                            {tools.map(tool => (
                                <Link to={`/${tool.key.toLowerCase()}`} key={tool.key}>
                                  <ToolCard
                                    tool={tool}
                                  />
                                </Link>
                            ))}
                          </Grid>
                        </section>
                      ))}
                </div>
              </div>
            </Container>
          } />
          {TOOLS.map(tool => {
            const ToolComponent = toolViewMap[tool.key];
            if (!ToolComponent) return null;
            return (
              <Route
                key={tool.key}
                path={`/${tool.key.toLowerCase()}`}
                element={
                  <ErrorBoundary>
                    <Container className="py-8"><ToolComponent /></Container>
                  </ErrorBoundary>
                }
              />
            );
          })}
        </Routes>
      </ErrorBoundary>
      </main>
      <footer className="text-center p-4 text-text-secondary border-t border-border">
          <p>&copy; {new Date().getFullYear()} PDF Power Toolbox. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;