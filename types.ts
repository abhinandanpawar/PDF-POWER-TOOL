export enum Tool {
  Merge = 'merge',
  Split = 'split',
  Compress = 'compress',
  Watermark = 'watermark',
  PdfToWord = 'pdf-to-word',
  DocToPdf = 'doc-to-pdf',
  DocToTxt = 'doc-to-txt',
  ImageConvert = 'image-convert',
  MarkdownConvert = 'markdown-convert',
  PptConvert = 'ppt-convert',
  SpreadsheetConvert = 'spreadsheet-convert',
  CsvXlsxConvert = 'csv-xlsx-convert',
  AudioConvert = 'audio-convert',
  VideoConvert = 'video-convert',
  PdfToImages = 'pdf-to-images',
  DeletePages = 'delete-pages',
  Protect = 'protect',
  RotatePages = 'rotate-pages',
  ExtractText = 'extract-text',
  ReorderPages = 'reorder-pages',
  GetMetadata = 'get-metadata',
  SetMetadata = 'set-metadata',
}

export enum ToolCategory {
  Organize = 'Organize & Modify',
  Convert = 'Convert & Extract',
  Optimize = 'Optimize & Secure',
  Annotate = 'Annotate & Metadata',
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