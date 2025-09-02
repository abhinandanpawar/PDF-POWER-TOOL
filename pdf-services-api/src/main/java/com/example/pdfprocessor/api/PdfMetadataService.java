package com.example.pdfprocessor.api;

import java.io.IOException;

public interface PdfMetadataService {
    /**
     * Reads the metadata from a PDF document.
     *
     * @param pdfBytes The content of the PDF file.
     * @return A PdfMetadata object containing the document's properties.
     * @throws IOException If an I/O error occurs.
     */
    PdfMetadata getMetadata(byte[] pdfBytes) throws IOException;

    /**
     * Sets the metadata for a PDF document.
     *
     * @param pdfBytes The content of the PDF file.
     * @param metadata A PdfMetadata object containing the new properties.
     * @return A byte array representing the PDF with the updated metadata.
     * @throws IOException If an I/O error occurs.
     */
    byte[] setMetadata(byte[] pdfBytes, PdfMetadata metadata) throws IOException;
}
