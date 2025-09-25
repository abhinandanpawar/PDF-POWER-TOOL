import React, { useState, useEffect, Suspense, lazy } from 'react';
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
import ReloadPrompt from './components/ReloadPrompt';

const toolViewMap: { [key in Tool]?: React.ComponentType<{}> } = {
    [Tool.Merge]: lazy(() => import('./features/MergeView')),
    [Tool.Split]: lazy(() => import('./features/SplitView')),
    [Tool.Compress]: lazy(() => import('./features/CompressView')),
    [Tool.Watermark]: lazy(() => import('./features/WatermarkView')),
    [Tool.PdfToWord]: lazy(() => import('./features/PdfToWordView')),
    [Tool.DocToPdf]: lazy(() => import('./features/DocToPdfView')),
    [Tool.DocToTxt]: lazy(() => import('./features/DocToTxtView')),
    [Tool.MarkdownConvert]: lazy(() => import('./features/MarkdownConvertView')),
    [Tool.PptConvert]: lazy(() => import('./features/PptConvertView')),
    [Tool.SpreadsheetConvert]: lazy(() => import('./features/SpreadsheetConvertView')),
    [Tool.CsvXlsxConvert]: lazy(() => import('./features/CsvXlsxView')),
    [Tool.AudioConvert]: lazy(() => import('./features/AudioConvertView')),
    [Tool.VideoConvert]: lazy(() => import('./features/VideoConvertView')),
    [Tool.PdfToImages]: lazy(() => import('./features/PdfToImagesView')),
    [Tool.FileExporter]: lazy(() => import('./features/FileExporterView')),
    [Tool.DeletePages]: lazy(() => import('./features/DeletePagesView')),
    [Tool.Protect]: lazy(() => import('./features/ProtectView')),
    [Tool.RotatePages]: lazy(() => import('./features/RotatePagesView')),
    [Tool.ExtractText]: lazy(() => import('./features/ExtractTextView')),
    [Tool.ReorderPages]: lazy(() => import('./features/ReorderPagesView')),
    [Tool.GetMetadata]: lazy(() => import('./features/GetMetadataView')),
    [Tool.SetMetadata]: lazy(() => import('./features/SetMetadataView')),
    [Tool.JsonFormat]: lazy(() => import('./features/JsonFormatterView')),
    [Tool.DataClean]: lazy(() => import('./features/DataCleanerView')),
    [Tool.ConfigConvert]: lazy(() => import('./features/ConfigConverterView')),
    [Tool.CsvJsonConverter]: lazy(() => import('./features/CsvJsonConverterView')),
    [Tool.PasswordGenerator]: lazy(() => import('./features/PasswordGeneratorView')),
    [Tool.QrCodeGenerator]: lazy(() => import('./features/QrCodeGeneratorView')),
    [Tool.BasicInvoicePdf]: lazy(() => import('./features/BasicInvoicePdfView')),
    [Tool.InvitationCard]: lazy(() => import('./features/InvitationCardView')),
    [Tool.CertificateMaker]: lazy(() => import('./features/CertificateMakerView')),
    [Tool.ResumeBuilder]: lazy(() => import('./features/ResumeBuilderView')),
    [Tool.BusinessCard]: lazy(() => import('./features/BusinessCardView')),
    [Tool.PosterFlyerDesign]: lazy(() => import('./features/PosterFlyerDesignView')),
    [Tool.QuoteImageCreator]: lazy(() => import('./features/QuoteImageCreatorView')),
    [Tool.TimelineRoadmapBuilder]: lazy(() => import('./features/TimelineRoadmapBuilderView')),
    [Tool.AvatarGenerator]: lazy(() => import('./features/AvatarGeneratorView')),
    [Tool.FaviconGenerator]: lazy(() => import('./features/FaviconGeneratorView')),
    [Tool.MemeMaker]: lazy(() => import('./features/MemeMakerView')),
    [Tool.BadgeIdCardMaker]: lazy(() => import('./features/BadgeIdCardMakerView')),
    [Tool.CadConvert]: lazy(() => import('./features/CadConvertView')),
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
          <Suspense fallback={<LoadingOverlay />}>
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
        </Suspense>
      </ErrorBoundary>
      </main>
      <footer className="text-center p-4 text-text-secondary border-t border-border">
          <p>&copy; {new Date().getFullYear()} PDF Power Toolbox. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;