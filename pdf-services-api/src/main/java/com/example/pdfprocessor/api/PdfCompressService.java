package com.example.pdfprocessor.api;

import java.io.IOException;
import java.io.InputStream;

public interface PdfCompressService {
    byte[] compressPdf(InputStream file) throws IOException;
}
