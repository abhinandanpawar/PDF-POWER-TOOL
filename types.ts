export enum Tool {
  Merge = 'merge',
  Split = 'split',
  Compress = 'compress',
  Watermark = 'watermark',
  PdfToWord = 'pdf-to-word',
  DocToPdf = 'doc-to-pdf',
  DocToTxt = 'doc-to-txt',
  MarkdownConvert = 'markdown-convert',
  PptConvert = 'ppt-convert',
  SpreadsheetConvert = 'spreadsheet-convert',
  CsvXlsxConvert = 'csv-xlsx-convert',
  AudioConvert = 'audio-convert',
  VideoConvert = 'video-convert',
  PdfToImages = 'pdf-to-images',
  FileExporter = 'file-exporter',
  DeletePages = 'delete-pages',
  Protect = 'protect',
  RotatePages = 'rotate-pages',
  ExtractText = 'extract-text',
  ReorderPages = 'reorder-pages',
  GetMetadata = 'get-metadata',
  SetMetadata = 'set-metadata',
  // Developer Tools
  JsonFormat = 'json-format',
  DataClean = 'data-clean',
  ConfigConvert = 'config-convert',
  CsvJsonConverter = 'csv-json-converter',
  // Creative Tools
  QrCodeGenerator = 'qr-code-generator',
  BasicInvoicePdf = 'basic-invoice-pdf',
  InvitationCard = 'invitation-card',
  CertificateMaker = 'certificate-maker',
  ResumeBuilder = 'resume-builder',
  BusinessCard = 'business-card',
  PosterFlyerDesign = 'poster-flyer-design',
  QuoteImageCreator = 'quote-image-creator',
  TimelineRoadmapBuilder = 'timeline-roadmap-builder',
  MindMapGenerator = 'mind-map-generator',
  AvatarGenerator = 'avatar-generator',
  FaviconGenerator = 'favicon-generator',
  MemeMaker = 'meme-maker',
  BadgeIdCardMaker = 'badge-id-card-maker',
  PasswordGenerator = 'password-generator',
}

export enum ToolCategory {
  Organize = 'Organize & Modify',
  Convert = 'Convert & Extract',
  Optimize = 'Optimize & Secure',
  Annotate = 'Annotate & Metadata',
  Image = 'Image',
  Developer = 'Developer Tools',
  Creative = 'Creative Tools',
}

export interface ToolInfo {
  key: Tool;
  title: string;
  description: string;
  icon: JSX.Element;
  category: ToolCategory;
}

export type ApiError = {
  message: string;
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
}
