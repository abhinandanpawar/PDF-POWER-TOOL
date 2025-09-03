package com.example.pdfprocessor.api;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public interface TextExtractionService {
    /**
     * Extracts machine-readable text from a PDF document.
     * This method does not perform OCR on images.
     *
     * @param files The content of the PDF file.
     * @return A string containing the extracted text.
     * @throws IOException If an I/O error occurs during processing.
     */
    String extractText(List<InputStream> files) throws IOException;
}
