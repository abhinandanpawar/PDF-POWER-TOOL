package com.example.pdfprocessor.api;

import java.io.InputStream;
import java.io.IOException;

public interface FontConverterService {
    byte[] convertFont(InputStream inputStream, String fromFormat, String toFormat) throws IOException;
}
