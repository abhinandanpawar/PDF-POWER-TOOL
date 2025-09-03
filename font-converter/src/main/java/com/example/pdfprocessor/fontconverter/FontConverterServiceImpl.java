package com.example.pdfprocessor.fontconverter;

import com.example.pdfprocessor.api.FontConverterService;
import net.mabboud.fontverter.FontVerter;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class FontConverterServiceImpl implements FontConverterService {

    @Override
    public byte[] convertFont(InputStream inputStream, String toFormat) throws IOException {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            if ("woff".equalsIgnoreCase(toFormat)) {
                FontVerter.convertTtfToWoff(inputStream, baos);
            } else if ("woff2".equalsIgnoreCase(toFormat)) {
                FontVerter.convertTtfToWoff2(inputStream, baos);
            } else if ("ttf".equalsIgnoreCase(toFormat)) {
                // Assuming the input is WOFF or WOFF2, we need to know which one.
                // The API does not seem to support auto-detection.
                // For now, we will assume WOFF to TTF. A more robust implementation
                // would require sniffing the input format.
                FontVerter.convertWoffToTtf(inputStream, baos);
            } else {
                throw new IllegalArgumentException("Unsupported format: " + toFormat);
            }
            return baos.toByteArray();
        }
    }
}
