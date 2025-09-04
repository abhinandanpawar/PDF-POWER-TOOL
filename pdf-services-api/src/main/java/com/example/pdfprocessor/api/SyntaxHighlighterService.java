package com.example.pdfprocessor.api;

import java.io.InputStream;
import java.io.IOException;

public interface SyntaxHighlighterService {
    byte[] highlight(InputStream inputStream, String language) throws IOException;
}
