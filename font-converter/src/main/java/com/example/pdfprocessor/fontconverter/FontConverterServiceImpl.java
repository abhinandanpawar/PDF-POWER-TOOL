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
    public byte[] convertFont(InputStream inputStream, String fromFormat, String toFormat) throws IOException {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            if ("ttf".equalsIgnoreCase(fromFormat)) {
                if ("woff".equalsIgnoreCase(toFormat)) {
                    FontVerter.convertTtfToWoff(inputStream, baos);
                } else if ("woff2".equalsIgnoreCase(toFormat)) {
                    FontVerter.convertTtfToWoff2(inputStream, baos);
                } else {
                    throw new IllegalArgumentException("Unsupported conversion from " + fromFormat + " to " + toFormat);
                }
            } else if ("woff".equalsIgnoreCase(fromFormat)) {
                if ("ttf".equalsIgnoreCase(toFormat)) {
                    FontVerter.convertWoffToTtf(inputStream, baos);
                } else {
                    throw new IllegalArgumentException("Unsupported conversion from " + fromFormat + " to " + toFormat);
                }
            } else if ("woff2".equalsIgnoreCase(fromFormat)) {
                if ("ttf".equalsIgnoreCase(toFormat)) {
                    FontVerter.convertWoff2ToTtf(inputStream, baos);
                } else {
                    throw new IllegalArgumentException("Unsupported conversion from " + fromFormat + " to " + toFormat);
                }
            } else {
                throw new IllegalArgumentException("Unsupported input format: " + fromFormat);
            }
            return baos.toByteArray();
        }
    }
}
