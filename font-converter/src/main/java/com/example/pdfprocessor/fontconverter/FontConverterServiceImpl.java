package com.example.pdfprocessor.fontconverter;

import com.example.pdfprocessor.api.FontConverterService;
import org.mabb.fontverter.FontVerter;
import org.mabb.fontverter.FVFont;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PushbackInputStream;

@Service
public class FontConverterServiceImpl implements FontConverterService {

    @Override
    public byte[] convertFont(InputStream inputStream, String fromFormat, String toFormat) throws IOException {
        // Use a PushbackInputStream to peek at the first few bytes
        PushbackInputStream pushbackInputStream = new PushbackInputStream(inputStream, 4);
        byte[] magic = new byte[4];
        int read = pushbackInputStream.read(magic);
        if (read != 4) {
             throw new IllegalArgumentException("Input stream is too short to determine font format");
        }
        pushbackInputStream.unread(magic);

        // Read all bytes from the stream for FontVerter
        byte[] inputBytes = pushbackInputStream.readAllBytes();

        String detectedFormat = detectFormat(magic, fromFormat);

        try {
            FVFont font = FontVerter.readFont(inputBytes);
            FontVerter.FontFormat targetFormat;

            if ("woff".equalsIgnoreCase(toFormat)) {
                targetFormat = FontVerter.FontFormat.WOFF1;
            } else if ("woff2".equalsIgnoreCase(toFormat)) {
                targetFormat = FontVerter.FontFormat.WOFF2;
            } else if ("ttf".equalsIgnoreCase(toFormat)) {
                targetFormat = FontVerter.FontFormat.TTF;
            } else if ("otf".equalsIgnoreCase(toFormat)) {
                targetFormat = FontVerter.FontFormat.OTF;
            } else {
                throw new IllegalArgumentException("Unsupported output format: " + toFormat);
            }

            FVFont convertedFont = FontVerter.convertFont(font, targetFormat);
            return convertedFont.getData();

        } catch (Exception e) {
             throw new IOException("Font conversion failed", e);
        }
    }

    private String detectFormat(byte[] magic, String providedFormat) {
        // Simple magic number check
        if (isWoff(magic)) {
            return "woff";
        }
        if (isWoff2(magic)) {
            return "woff2";
        }
        if (isTtf(magic)) {
            return "ttf";
        }
        return providedFormat;
    }

    private boolean isWoff(byte[] magic) {
        return magic[0] == 0x77 && magic[1] == 0x4F && magic[2] == 0x46 && magic[3] == 0x46;
    }

    private boolean isWoff2(byte[] magic) {
        return magic[0] == 0x77 && magic[1] == 0x4F && magic[2] == 0x46 && magic[3] == 0x32;
    }

    private boolean isTtf(byte[] magic) {
         // Check for 0x00010000
        if (magic[0] == 0x00 && magic[1] == 0x01 && magic[2] == 0x00 && magic[3] == 0x00) {
            return true;
        }
        // Check for "OTTO" (which can be OTF or TTF with CFF, but often handled similarly)
        if (magic[0] == 0x4F && magic[1] == 0x54 && magic[2] == 0x54 && magic[3] == 0x4F) {
            return true;
        }
        return false;
    }
}
