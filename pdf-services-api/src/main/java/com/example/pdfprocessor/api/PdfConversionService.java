package com.example.pdfprocessor.api;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public interface PdfConversionService {
    byte[] convertPdfsToWord(List<InputStream> pdfStreams) throws IOException;
}
