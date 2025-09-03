import React from 'react';
import { Tool, ToolInfo, ToolCategory } from './types';

// Icon components
const MergeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5M3.75 6.75h16.5" /></svg>);
const SplitIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v.01M12 9.75v.01M12 15v.01" /></svg>);
const CompressIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5M15 15l5.25 5.25" /></svg>);
const WatermarkIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c.251-.11.52-.162.796-.162H12a2.25 2.25 0 012.25 2.25v5.714a2.25 2.25 0 01-.659 1.591L14.25 14.5M14.25 14.5L19 19.25M14.25 14.5L9.75 19.25" /></svg>);
const PdfToWordIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5l9 9 9-9" /><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5h15" /></svg>);
const PdfToImagesIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>);
const DeletePagesIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>);
const ProtectIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>);
const RotatePagesIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25L12 21m0 0l-3.75-3.75M12 21V3M8.25 6.75L12 3m0 0l3.75 3.75" /></svg>);
const ExtractTextIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" /></svg>);
const ReorderPagesIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" /></svg>);
const MetadataIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);

export const TOOLS: ToolInfo[] = [
  // Organize & Modify
  { key: Tool.Merge, title: 'Merge PDF', description: 'Combine multiple PDFs into one.', icon: <MergeIcon />, category: ToolCategory.Organize },
  { key: Tool.Split, title: 'Split PDF', description: 'Extract pages from a PDF.', icon: <SplitIcon />, category: ToolCategory.Organize },
  { key: Tool.DeletePages, title: 'Delete Pages', description: 'Remove specific pages from a PDF.', icon: <DeletePagesIcon />, category: ToolCategory.Organize },
  { key: Tool.RotatePages, title: 'Rotate Pages', description: 'Rotate pages in a PDF document.', icon: <RotatePagesIcon />, category: ToolCategory.Organize },
  { key: Tool.ReorderPages, title: 'Reorder Pages', description: 'Change the order of pages in a PDF.', icon: <ReorderPagesIcon />, category: ToolCategory.Organize },
  
  // Convert & Extract
  { key: Tool.PdfToWord, title: 'PDF to Word', description: 'Convert your PDF to an editable Word document.', icon: <PdfToWordIcon />, category: ToolCategory.Convert },
  { key: Tool.PdfToImages, title: 'PDF to Images', description: 'Convert PDF pages to images (PNG/JPG).', icon: <PdfToImagesIcon />, category: ToolCategory.Convert },
  { key: Tool.ExtractText, title: 'Extract Text', description: 'Pull all text content from a PDF.', icon: <ExtractTextIcon />, category: ToolCategory.Convert },

  // Optimize & Secure
  { key: Tool.Compress, title: 'Compress PDF', description: 'Reduce the file size of your PDF.', icon: <CompressIcon />, category: ToolCategory.Optimize },
  { key: Tool.Protect, title: 'Protect PDF', description: 'Add a password to your PDF.', icon: <ProtectIcon />, category: ToolCategory.Optimize },

  // Annotate & Metadata
  { key: Tool.Watermark, title: 'Add Watermark', description: 'Stamp text onto your PDF pages.', icon: <WatermarkIcon />, category: ToolCategory.Annotate },
  { key: Tool.GetMetadata, title: 'Get Metadata', description: 'View the metadata of a PDF file.', icon: <MetadataIcon />, category: ToolCategory.Annotate },
  { key: Tool.SetMetadata, title: 'Set Metadata', description: 'Update the metadata of a PDF file.', icon: <MetadataIcon />, category: ToolCategory.Annotate },
];