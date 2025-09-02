package com.example.pdfprocessor.api;

import java.io.IOException;
import java.util.List;

public interface PdfRotationService {
    /**
     * Rotates specified pages in a PDF document.
     *
     * @param pdfBytes The content of the PDF file.
     * @param pagesToRotate A list of 1-based page numbers to rotate.
     * @param rotationDegrees The degrees of rotation (must be a multiple of 90).
     * @return A byte array representing the PDF with pages rotated.
     * @throws IOException If an I/O error occurs.
     * @throws IllegalArgumentException if rotationDegrees is not a multiple of 90.
     */
    byte[] rotatePages(byte[] pdfBytes, List<Integer> pagesToRotate, int rotationDegrees) throws IOException;
}
