package com.example.pdfprocessor.api;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public interface PdfCompressService {
    byte[] compressPdfs(List<InputStream> files) throws IOException;
}
