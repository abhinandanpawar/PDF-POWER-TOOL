package com.example.pdfprocessor.api;

import java.io.IOException;

public interface PdfProtectionService {
    /**
     * Protects a PDF file with a password.
     *
     * @param pdfBytes The content of the PDF file to protect.
     * @param password The password to use for encryption.
     * @return A byte array representing the protected PDF.
     * @throws IOException If an I/O error occurs.
     */
    byte[] protectPdf(byte[] pdfBytes, String password) throws IOException;
}
