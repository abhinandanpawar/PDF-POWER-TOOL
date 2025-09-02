package com.example.pdfprocessor.api;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public interface PdfReorderService {
    /**
     * Reorders the pages of a PDF document according to a new specified order.
     *
     * @param files The content of the PDF file.
     * @param newOrder A list of 1-based page numbers in the desired new order.
     * @return A byte array representing the reordered PDF.
     * @throws IOException If an I/O error occurs.
     * @throws IllegalArgumentException if the new order is invalid (e.g., duplicate pages, out-of-bounds pages).
     */
    byte[] reorderPages(List<InputStream> files, List<Integer> newOrder) throws IOException;
}
