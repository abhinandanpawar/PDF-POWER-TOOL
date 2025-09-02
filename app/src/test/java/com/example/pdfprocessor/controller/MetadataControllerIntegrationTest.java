package com.example.pdfprocessor.controller;

import com.example.pdfprocessor.api.PdfMetadata;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentInformation;
import org.apache.pdfbox.pdmodel.PDPage;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class MetadataControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private byte[] createTestPdfWithMetadata() throws IOException {
        try (PDDocument document = new PDDocument()) {
            document.addPage(new PDPage());
            PDDocumentInformation info = new PDDocumentInformation();
            info.setTitle("Test Title");
            info.setAuthor("Test Author");
            info.setSubject("Test Subject");
            info.setKeywords("test, pdf, metadata");
            document.setDocumentInformation(info);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.save(baos);
            return baos.toByteArray();
        }
    }

    @Test
    public void testGetMetadata() throws Exception {
        byte[] pdfContent = createTestPdfWithMetadata();
        MockMultipartFile file = new MockMultipartFile("file", "meta.pdf", MediaType.APPLICATION_PDF_VALUE, pdfContent);

        MvcResult result = mockMvc.perform(multipart("/api/v1/pdfs/metadata/get").file(file))
                .andExpect(status().isOk())
                .andReturn();

        String jsonResponse = result.getResponse().getContentAsString();
        PdfMetadata metadata = objectMapper.readValue(jsonResponse, PdfMetadata.class);

        assertEquals("Test Title", metadata.getTitle());
        assertEquals("Test Author", metadata.getAuthor());
        assertEquals("Test Subject", metadata.getSubject());
        assertEquals("test, pdf, metadata", metadata.getKeywords());
    }

    @Test
    public void testSetMetadata() throws Exception {
        // Create a blank PDF
        byte[] pdfContent = createTestPdfWithMetadata(); // Can reuse this, we are overwriting anyway
        MockMultipartFile file = new MockMultipartFile("file", "meta.pdf", MediaType.APPLICATION_PDF_VALUE, pdfContent);

        // Create new metadata
        PdfMetadata newMetadata = new PdfMetadata();
        newMetadata.setTitle("New Title");
        newMetadata.setAuthor("New Author");

        MockMultipartFile metadataPart = new MockMultipartFile("metadata", "", MediaType.APPLICATION_JSON_VALUE, objectMapper.writeValueAsBytes(newMetadata));

        MvcResult result = mockMvc.perform(multipart("/api/v1/pdfs/metadata")
                        .file(file)
                        .file(metadataPart))
                .andExpect(status().isOk())
                .andReturn();

        byte[] responseBytes = result.getResponse().getContentAsByteArray();

        // Verify the metadata in the new PDF
        try (PDDocument resultDoc = Loader.loadPDF(responseBytes)) {
            PDDocumentInformation info = resultDoc.getDocumentInformation();
            assertEquals("New Title", info.getTitle());
            assertEquals("New Author", info.getAuthor());
        }
    }
}
