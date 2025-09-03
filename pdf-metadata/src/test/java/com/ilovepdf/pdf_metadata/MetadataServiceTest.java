package com.ilovepdf.pdf_metadata;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDDocumentInformation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class MetadataServiceTest {

    private MetadataService metadataService = new MetadataService();
    private byte[] testPdfBytes;

    @BeforeEach
    void setUp() throws IOException {
        try (PDDocument document = new PDDocument()) {
            document.addPage(new PDPage()); // Add a page to make it a valid PDF

            PDDocumentInformation info = document.getDocumentInformation();
            info.setAuthor("Test Author");
            info.setTitle("Test Title");
            info.setSubject("Test Subject");
            info.setKeywords("keyword1, keyword2");
            info.setCreator("Test Creator");
            info.setProducer("Test Producer");
            // Setting dates can be tricky with timezones, so we'll skip asserting them for simplicity

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.save(baos);
            testPdfBytes = baos.toByteArray();
        }
    }

    @Test
    void getMetadata() throws IOException {
        Map<String, Object> metadata = metadataService.getMetadata(testPdfBytes);

        assertEquals("Test Title", metadata.get("title"));
        assertEquals("Test Author", metadata.get("author"));
        assertEquals("Test Subject", metadata.get("subject"));
        assertEquals("keyword1, keyword2", metadata.get("keywords"));
        assertEquals("Test Creator", metadata.get("creator"));
        assertEquals("Test Producer", metadata.get("producer"));
    }

    @Test
    void setMetadata() throws IOException {
        Map<String, String> newMetadata = new HashMap<>();
        newMetadata.put("title", "New Title");
        newMetadata.put("author", "New Author");

        byte[] updatedPdfBytes = metadataService.setMetadata(testPdfBytes, newMetadata);

        // Verify the new metadata
        Map<String, Object> updatedMetadata = metadataService.getMetadata(updatedPdfBytes);

        assertEquals("New Title", updatedMetadata.get("title"));
        assertEquals("New Author", updatedMetadata.get("author"));
        // The other fields should be preserved
        assertEquals("Test Subject", updatedMetadata.get("subject"));
    }
}
