package com.example.pdfprocessor.api;

import java.io.IOException;

public interface PdfAnnotationService {
    /**
     * Adds a text watermark to each page of a PDF document.
     *
     * @param pdfBytes The content of the PDF file.
     * @param watermarkText The text to use as a watermark.
     * @return A byte array representing the watermarked PDF.
     * @throws IOException If an I/O error occurs during processing.
     */
    byte[] addWatermark(byte[] pdfBytes, String watermarkText) throws IOException;
}
