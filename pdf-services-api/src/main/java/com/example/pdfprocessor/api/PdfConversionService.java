package com.example.pdfprocessor.api;

import java.io.IOException;
import java.io.InputStream;

public interface PdfConversionService {
    byte[] convertPdfToWord(InputStream pdfStream) throws IOException;
}
