package com.example.pdfprocessor.api;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public interface PdfPageDeletionService {
    /**
     * Deletes specified pages from a PDF document.
     *
     * @param files The content of the PDF file.
     * @param pagesToDelete A list of 1-based page numbers to delete.
     * @return A byte array representing the PDF with pages removed.
     * @throws IOException If an I/O error occurs or if page numbers are invalid.
     */
    byte[] deletePages(List<InputStream> files, List<Integer> pagesToDelete) throws IOException;
}
