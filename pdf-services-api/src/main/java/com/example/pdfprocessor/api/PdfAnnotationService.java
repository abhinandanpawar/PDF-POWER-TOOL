package com.example.pdfprocessor.api;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public interface PdfAnnotationService {
    /**
     * Adds a text watermark to each page of a PDF document.
     *
     * @param files The content of the PDF file.
     * @param watermarkText The text to use as a watermark.
     * @return A byte array representing the watermarked PDF.
     * @throws IOException If an I/O error occurs during processing.
     */
    byte[] addWatermarks(List<InputStream> files, String watermarkText) throws IOException;
}
