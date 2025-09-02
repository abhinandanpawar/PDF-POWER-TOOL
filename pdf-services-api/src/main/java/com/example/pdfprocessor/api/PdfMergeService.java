package com.example.pdfprocessor.api;

import java.io.IOException;
import java.io.InputStream;

public interface PdfMergeService {
    byte[] mergePdfs(InputStream file1, InputStream file2) throws IOException;
}
