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
  DeletePages = 'delete-pages',
  Protect = 'protect',
  RotatePages = 'rotate-pages',
  ExtractText = 'extract-text',
  ReorderPages = 'reorder-pages',
  GetMetadata = 'get-metadata',
  SetMetadata = 'set-metadata',


  // Developer Tools
  DiffView = 'diff-view',
  JsonFormat = 'json-format',
  DataClean = 'data-clean',
  ConfigConvert = 'config-convert',
  Notepad = 'notepad',
  PasswordGenerator = 'password-generator',

  CadConvert = 'cad-convert',

}

export enum ToolCategory {
  Organize = 'Organize & Modify',
  Convert = 'Convert & Extract',
  Optimize = 'Optimize & Secure',
  Annotate = 'Annotate & Metadata',
  Developer = 'Developer Tools',
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