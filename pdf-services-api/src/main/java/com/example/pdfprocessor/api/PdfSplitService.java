package com.example.pdfprocessor.api;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public interface PdfSplitService {
    byte[] splitPdfs(List<InputStream> files, String ranges) throws IOException;
}
