package com.example.pdfprocessor.fontconverter;

import com.example.pdfprocessor.api.FontConverterService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class FontConverterServiceImplTest {

    @InjectMocks
    private FontConverterServiceImpl fontConverterService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testConvertFont_ttfToWoff() throws IOException {
        // Mocking FontVerter static methods is complex. For a real test, you'd use a library like PowerMock or refactor FontVerter usage.
        // For now, we'll assume FontVerter works as expected and focus on the service logic.
        // This test primarily checks if the correct FontVerter method is called with the correct arguments.

        InputStream mockInputStream = new ByteArrayInputStream("mock ttf content".getBytes());
        String toFormat = "woff";

        // Since FontVerter methods are static, we can't mock them directly with Mockito without PowerMock.
        // This test will pass if the service method doesn't throw an exception and returns a byte array.
        // A more robust test would involve verifying the output content, which requires mocking FontVerter.

        byte[] result = fontConverterService.convertFont(mockInputStream, toFormat);

        assertNotNull(result);
        assertTrue(result.length > 0);
    }

    @Test
    void testConvertFont_ttfToWoff2() throws IOException {
        InputStream mockInputStream = new ByteArrayInputStream("mock ttf content".getBytes());
        String toFormat = "woff2";

        byte[] result = fontConverterService.convertFont(mockInputStream, toFormat);

        assertNotNull(result);
        assertTrue(result.length > 0);
    }

    @Test
    void testConvertFont_woffToTtf() throws IOException {
        InputStream mockInputStream = new ByteArrayInputStream("mock woff content".getBytes());
        String toFormat = "ttf";

        byte[] result = fontConverterService.convertFont(mockInputStream, toFormat);

        assertNotNull(result);
        assertTrue(result.length > 0);
    }

    @Test
    void testConvertFont_unsupportedFormat() {
        InputStream mockInputStream = new ByteArrayInputStream("mock content".getBytes());
        String toFormat = "unsupported";

        assertThrows(IllegalArgumentException.class, () -> {
            fontConverterService.convertFont(mockInputStream, toFormat);
        });
    }
}
