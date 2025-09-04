import React from 'react';
import { Tool, ToolInfo, ToolCategory } from './types';

import { GitCompareArrows, Braces, Sparkles, FileCog, QrCode, FileText, Gift, Award, User, Contact, LayoutTemplate, ArrowRightLeft, Quote, Milestone, GitFork, UserCircle, Heart, Smile, Badge } from 'lucide-react';

import { GitCompareArrows, Braces, Sparkles, FileCog, Notebook, KeyRound, FileDown } from 'lucide-react';


// Icon components
const MergeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5M3.75 6.75h16.5" /></svg>);
const SplitIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v.01M12 9.75v.01M12 15v.01" /></svg>);
const CompressIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5M15 15l5.25 5.25" /></svg>);
const WatermarkIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c.251-.11.52-.162.796-.162H12a2.25 2.25 0 012.25 2.25v5.714a2.25 2.25 0 01-.659 1.591L14.25 14.5M14.25 14.5L19 19.25M14.25 14.5L9.75 19.25" /></svg>);
const PdfToWordIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5l9 9 9-9" /><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5h15" /></svg>);
const DocToPdfIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>);
const MarkdownConvertIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h18M3 9h18M3 13.5h18M3 18h18" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 3v18" /></svg>);
const PptConvertIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>);
const SpreadsheetConvertIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h18v18H3V3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 9h18M9 3v18" /></svg>);
const CsvXlsxConvertIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h18v18H3V3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 9h18M9 3v18" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 7.5l3.75 3.75-3.75 3.75M6.75 11.25H20.25M7.5 16.5l-3.75-3.75 3.75-3.75M17.25 12.75H3.75" /></svg>);
const AudioConvertIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V7.5A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.75m0 0l-1.01.289a1.803 1.803 0 00-1.632 2.163l.404 1.414a1.803 1.803 0 003.467-.99l-.404-1.414z" /></svg>);
const VideoConvertIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9a2.25 2.25 0 00-2.25 2.25v9A2.25 2.25 0 004.5 18.75z" /></svg>);
const PdfToImagesIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>);
const DeletePagesIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>);
const ProtectIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>);
const RotatePagesIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25L12 21m0 0l-3.75-3.75M12 21V3M8.25 6.75L12 3m0 0l3.75 3.75" /></svg>);
const ExtractTextIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" /></svg>);
const ReorderPagesIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" /></svg>);
const MetadataIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const CadConvertIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-4.03 9-9s-4.03-9-9-9-9 4.03-9 9 4.03 9 9 9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1M21 12h-1M12 21v-1M3 12H2" /></svg>);
const ImageEditorIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg>);

export const TOOLS: ToolInfo[] = [
  // Organize & Modify
  { key: Tool.Merge, title: 'Merge PDF', description: 'Combine multiple PDFs into one.', icon: <MergeIcon />, category: ToolCategory.Organize },
  { key: Tool.Split, title: 'Split PDF', description: 'Extract pages from a PDF.', icon: <SplitIcon />, category: ToolCategory.Organize },
  { key: Tool.DeletePages, title: 'Delete Pages', description: 'Remove specific pages from a PDF.', icon: <DeletePagesIcon />, category: ToolCategory.Organize },
  { key: Tool.RotatePages, title: 'Rotate Pages', description: 'Rotate pages in a PDF document.', icon: <RotatePagesIcon />, category: ToolCategory.Organize },
  { key: Tool.ReorderPages, title: 'Reorder Pages', description: 'Change the order of pages in a PDF.', icon: <ReorderPagesIcon />, category: ToolCategory.Organize },
  
  // Convert & Extract
  { key: Tool.PdfToWord, title: 'PDF to Word', description: 'Convert your PDF to an editable Word document.', icon: <PdfToWordIcon />, category: ToolCategory.Convert },
  { key: Tool.DocToPdf, title: 'Word to PDF', description: 'Convert Word documents (.doc, .docx) to PDF.', icon: <DocToPdfIcon />, category: ToolCategory.Convert },
  { key: Tool.DocToTxt, title: 'Word to Text', description: 'Pull all text content from a Word document.', icon: <ExtractTextIcon />, category: ToolCategory.Convert },
  { key: Tool.MarkdownConvert, title: 'Markdown Converter', description: 'Convert Markdown files to HTML or PDF.', icon: <MarkdownConvertIcon />, category: ToolCategory.Convert },
  { key: Tool.PptConvert, title: 'PowerPoint Converter', description: 'Convert PowerPoint files to PDF or images.', icon: <PptConvertIcon />, category: ToolCategory.Convert },
  { key: Tool.SpreadsheetConvert, title: 'Spreadsheet Converter', description: 'Convert Excel files to PDF or HTML.', icon: <SpreadsheetConvertIcon />, category: ToolCategory.Convert },
  { key: Tool.CsvXlsxConvert, title: 'CSV <> Excel Converter', description: 'Convert between CSV and XLSX (Excel) formats.', icon: <CsvXlsxConvertIcon />, category: ToolCategory.Convert },
  { key: Tool.AudioConvert, title: 'Audio Converter', description: 'Convert audio files (WAV, MP3, AAC, etc.).', icon: <AudioConvertIcon />, category: ToolCategory.Convert },
  { key: Tool.VideoConvert, title: 'Video Converter', description: 'Convert video files (MP4, WEBM, GIF, etc.).', icon: <VideoConvertIcon />, category: ToolCategory.Convert },
  { key: Tool.PdfToImages, title: 'PDF to Images', description: 'Convert PDF pages to images (PNG/JPG).', icon: <PdfToImagesIcon />, category: ToolCategory.Convert },
  { key: Tool.FileExporter, title: 'Text to File', description: 'Save raw text to a file with any extension.', icon: <FileDown />, category: ToolCategory.Convert },
  { key: Tool.ExtractText, title: 'Extract Text', description: 'Pull all text content from a PDF.', icon: <ExtractTextIcon />, category: ToolCategory.Convert },
  { key: Tool.CadConvert, title: 'CAD to PDF', description: 'Convert DXF files to PDF.', icon: <CadConvertIcon />, category: ToolCategory.Convert },

  // Optimize & Secure
  { key: Tool.Compress, title: 'Compress PDF', description: 'Reduce the file size of your PDF.', icon: <CompressIcon />, category: ToolCategory.Optimize },
  { key: Tool.Protect, title: 'Protect PDF', description: 'Add a password to your PDF.', icon: <ProtectIcon />, category: ToolCategory.Optimize },

  // Annotate & Metadata
  { key: Tool.Watermark, title: 'Add Watermark', description: 'Stamp text onto your PDF pages.', icon: <WatermarkIcon />, category: ToolCategory.Annotate },
  { key: Tool.GetMetadata, title: 'Get Metadata', description: 'View the metadata of a PDF file.', icon: <MetadataIcon />, category: ToolCategory.Annotate },
  { key: Tool.SetMetadata, title: 'Set Metadata', description: 'Update the metadata of a PDF file.', icon: <MetadataIcon />, category: ToolCategory.Annotate },

  // Image Tools
  { key: Tool.ImageEditor, title: 'Image Editor', description: 'Crop, resize, rotate, and add filters to images.', icon: <ImageEditorIcon />, category: ToolCategory.Image },

  // Developer Tools
  { key: Tool.DiffView, title: 'Visual Diff Viewer', description: 'Compare two text files to see the differences.', icon: <GitCompareArrows />, category: ToolCategory.Developer },
  { key: Tool.JsonFormat, title: 'JSON Formatter', description: 'Format or minify your JSON data.', icon: <Braces />, category: ToolCategory.Developer },
  { key: Tool.DataClean, title: 'Data Cleaner', description: 'Clean and transform your text data.', icon: <Sparkles />, category: ToolCategory.Developer },
  { key: Tool.ConfigConvert, title: 'Config Converter', description: 'Convert between different config file formats.', icon: <FileCog />, category: ToolCategory.Developer },

  { key: Tool.CsvJsonConverter, title: 'CSV <> JSON Converter', description: 'Convert between CSV and JSON formats.', icon: <ArrowRightLeft />, category: ToolCategory.Developer },

  // Creative Tools
  { key: Tool.QrCodeGenerator, title: 'QR Code Generator', description: 'Generate a QR code from a URL or text.', icon: <QrCode />, category: ToolCategory.Creative },
  { key: Tool.BasicInvoicePdf, title: 'Basic Invoice PDF', description: 'Create a basic invoice and download it as a PDF.', icon: <FileText />, category: ToolCategory.Creative },
  { key: Tool.InvitationCard, title: 'Invitation Card', description: 'Design a custom invitation card.', icon: <Gift />, category: ToolCategory.Creative },
  { key: Tool.CertificateMaker, title: 'Certificate Maker', description: 'Create a custom certificate.', icon: <Award />, category: ToolCategory.Creative },
  { key: Tool.ResumeBuilder, title: 'Resume Builder', description: 'Create a professional resume from a form.', icon: <User />, category: ToolCategory.Creative },
  { key: Tool.BusinessCard, title: 'Business Card Maker', description: 'Design a two-sided business card.', icon: <Contact />, category: ToolCategory.Creative },
  { key: Tool.PosterFlyerDesign, title: 'Poster/Flyer Design', description: 'Design a poster or flyer with text and images.', icon: <LayoutTemplate />, category: ToolCategory.Creative },
  { key: Tool.QuoteImageCreator, title: 'Quote Image Creator', description: 'Create an image with a quote.', icon: <Quote />, category: ToolCategory.Creative },
  { key: Tool.TimelineRoadmapBuilder, title: 'Timeline/Roadmap Builder', description: 'Create a timeline with draggable milestones.', icon: <Milestone />, category: ToolCategory.Creative },
  { key: Tool.MindMapGenerator, title: 'Mind Map Generator', description: 'Create a mind map with a force-directed graph.', icon: <GitFork />, category: ToolCategory.Creative },
  { key: Tool.AvatarGenerator, title: 'Avatar Generator', description: 'Generate a random avatar.', icon: <UserCircle />, category: ToolCategory.Creative },
  { key: Tool.FaviconGenerator, title: 'Favicon Generator', description: 'Generate a favicon from text.', icon: <Heart />, category: ToolCategory.Creative },
  { key: Tool.MemeMaker, title: 'Meme Maker', description: 'Create a meme with top and bottom text.', icon: <Smile />, category: ToolCategory.Creative },
  { key: Tool.BadgeIdCardMaker, title: 'Badge/ID Card Maker', description: 'Create a badge or ID card.', icon: <Badge />, category: ToolCategory.Creative },

  { key: Tool.Notepad, title: 'Offline Notepad', description: 'A multi-tab code editor that saves automatically.', icon: <Notebook />, category: ToolCategory.Developer },
  { key: Tool.PasswordGenerator, title: 'Password Generator', description: 'Create strong, random passwords and check their strength.', icon: <KeyRound />, category: ToolCategory.Developer },

];