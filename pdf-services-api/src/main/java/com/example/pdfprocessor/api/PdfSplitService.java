package com.example.pdfprocessor.api;

import java.io.IOException;
import java.io.InputStream;

public interface PdfSplitService {
    byte[] splitPdf(InputStream file, String ranges) throws IOException;
}
