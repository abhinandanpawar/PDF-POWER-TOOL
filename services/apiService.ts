const BASE_URL = '/api/v1';

const handleApiResponse = async (response: Response) => {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText || 'An unknown error occurred'}`);
    }
    return response;
};

export const downloadFile = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
};

const processFileResponse = async (response: Response, defaultFilename: string) => {
    const validatedResponse = await handleApiResponse(response);
    const blob = await validatedResponse.blob();
    downloadFile(blob, defaultFilename);
};

// PDF Controller
export const mergePdfs = async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    const response = await fetch(`${BASE_URL}/pdfs/merge`, { method: 'POST', body: formData });
    await processFileResponse(response, 'merged.pdf');
};

export const splitPdf = async (files: File[], ranges: string) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    if (ranges) formData.append('ranges', ranges);
    const response = await fetch(`${BASE_URL}/pdfs/split`, { method: 'POST', body: formData });
    await processFileResponse(response, 'split.zip');
};

export const compressPdf = async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    const response = await fetch(`${BASE_URL}/pdfs/compress`, { method: 'POST', body: formData });
    await processFileResponse(response, 'compressed.zip');
};

// Annotation Controller
export const addWatermark = async (files: File[], text: string) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('text', text);
    const response = await fetch(`${BASE_URL}/pdfs/annotate/watermark`, { method: 'POST', body: formData });
    await processFileResponse(response, 'watermarked.zip');
};

// Conversion Controller
export const convertPdfToWord = async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    const response = await fetch(`${BASE_URL}/convert/pdf-to-word`, { method: 'POST', body: formData });
    await processFileResponse(response, 'converted_word.zip');
};

export const convertPdfToImages = async (files: File[], format: string, dpi: number) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('format', format);
    formData.append('dpi', String(dpi));
    const response = await fetch(`${BASE_URL}/convert/pdf-to-images`, { method: 'POST', body: formData });
    await processFileResponse(response, 'converted_images.zip');
};

// Page Deletion Controller
export const deletePages = async (files: File[], pages: string) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('pages', pages);
    const response = await fetch(`${BASE_URL}/pdfs/delete-pages`, { method: 'POST', body: formData });
    await processFileResponse(response, 'deleted_pages.zip');
};

// Protection Controller
export const protectPdf = async (files: File[], password: string) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('password', password);
    const response = await fetch(`${BASE_URL}/pdfs/protect`, { method: 'POST', body: formData });
    await processFileResponse(response, 'protected.zip');
};

// Rotation Controller
export const rotatePages = async (files: File[], pages: string, degrees: number) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('pages', pages);
    formData.append('degrees', String(degrees));
    const response = await fetch(`${BASE_URL}/pdfs/rotate-pages`, { method: 'POST', body: formData });
    await processFileResponse(response, 'rotated.zip');
};

// Text Extraction Controller
export const extractText = async (files: File[]): Promise<string> => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    const response = await fetch(`${BASE_URL}/text/extract`, { method: 'POST', body: formData });
    await handleApiResponse(response);
    return await response.text();
};

// Reorder Controller
export const reorderPages = async (files: File[], order: string) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('order', order);
    const response = await fetch(`${BASE_URL}/pdfs/reorder-pages`, { method: 'POST', body: formData });
    await processFileResponse(response, 'reordered.zip');
};

// Metadata Controller
export const getPdfMetadata = async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${BASE_URL}/metadata/get`, { method: 'POST', body: formData });
    await handleApiResponse(response);
    return await response.json();
};

export const setPdfMetadata = async (file: File, metadata: { [key: string]: string }) => {
    const formData = new FormData();
    formData.append('file', file);
    Object.entries(metadata).forEach(([key, value]) => {
        formData.append(`metadata[${key}]`, value);
    });
    const response = await fetch(`${BASE_URL}/metadata/set`, { method: 'POST', body: formData });
    await processFileResponse(response, 'metadata_updated.pdf');
};