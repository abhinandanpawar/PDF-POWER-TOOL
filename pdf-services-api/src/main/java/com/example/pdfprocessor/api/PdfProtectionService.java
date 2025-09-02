package com.example.pdfprocessor.api;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public interface PdfProtectionService {
    /**
     * Protects a PDF file with a password.
     *
     * @param files The content of the PDF file to protect.
     * @param password The password to use for encryption.
     * @return A byte array representing the protected PDF.
     * @throws IOException If an I/O error occurs.
     */
    byte[] protectPdfs(List<InputStream> files, String password) throws IOException;
}
