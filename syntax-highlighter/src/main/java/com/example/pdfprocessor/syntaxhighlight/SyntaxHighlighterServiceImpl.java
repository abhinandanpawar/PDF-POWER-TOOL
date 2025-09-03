package com.example.pdfprocessor.syntaxhighlight;

import com.example.pdfprocessor.api.SyntaxHighlighterService;
import org.springframework.stereotype.Service;
import com.uwyn.jhighlight.renderer.XhtmlRendererFactory;
import java.io.InputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class SyntaxHighlighterServiceImpl implements SyntaxHighlighterService {

    @Override
    public byte[] highlight(InputStream inputStream, String language) throws IOException {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            XhtmlRendererFactory.getRenderer(language).highlight("code", inputStream, baos, "UTF-8", true);
            return baos.toByteArray();
        }
    }
}
