package com.example.pdfprocessor.fontconverter;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

import static org.junit.jupiter.api.Assertions.*;

public class FontConverterServiceImplTest {

    @InjectMocks
    private FontConverterServiceImpl fontConverterService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testConvertFont_ttfToWoff() throws IOException {
        InputStream mockInputStream = new ByteArrayInputStream("mock ttf content".getBytes());
        byte[] result = fontConverterService.convertFont(mockInputStream, "ttf", "woff");
        assertNotNull(result);
        assertTrue(result.length > 0);
    }

    @Test
    void testConvertFont_ttfToWoff2() throws IOException {
        InputStream mockInputStream = new ByteArrayInputStream("mock ttf content".getBytes());
        byte[] result = fontConverterService.convertFont(mockInputStream, "ttf", "woff2");
        assertNotNull(result);
        assertTrue(result.length > 0);
    }

    @Test
    void testConvertFont_woffToTtf() throws IOException {
        InputStream mockInputStream = new ByteArrayInputStream("mock woff content".getBytes());
        byte[] result = fontConverterService.convertFont(mockInputStream, "woff", "ttf");
        assertNotNull(result);
        assertTrue(result.length > 0);
    }

    @Test
    void testConvertFont_woff2ToTtf() throws IOException {
        // This is a basic test. A real test would need a valid woff2 file content.
        InputStream mockInputStream = new ByteArrayInputStream("mock woff2 content".getBytes());
        byte[] result = fontConverterService.convertFont(mockInputStream, "woff2", "ttf");
        assertNotNull(result);
        assertTrue(result.length > 0);
    }

    @Test
    void testConvertFont_unsupportedToFormat() {
        InputStream mockInputStream = new ByteArrayInputStream("mock content".getBytes());
        assertThrows(IllegalArgumentException.class, () -> {
            fontConverterService.convertFont(mockInputStream, "ttf", "unsupported");
        });
    }

    @Test
    void testConvertFont_unsupportedFromFormat() {
        InputStream mockInputStream = new ByteArrayInputStream("mock content".getBytes());
        assertThrows(IllegalArgumentException.class, () -> {
            fontConverterService.convertFont(mockInputStream, "unsupported", "ttf");
        });
    }
}
