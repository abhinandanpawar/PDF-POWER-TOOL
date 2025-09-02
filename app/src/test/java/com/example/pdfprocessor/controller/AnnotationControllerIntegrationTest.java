package com.example.pdfprocessor.controller;

import org.apache.pdfbox.pdmodel.PDDocument;
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

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AnnotationControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private byte[] createTestPdf() throws IOException {
        try (PDDocument document = new PDDocument()) {
            document.addPage(new PDPage()); // Add a blank page
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.save(baos);
            return baos.toByteArray();
        }
    }

    @Test
    public void testAddWatermark() throws Exception {
        byte[] pdfContent = createTestPdf();
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.pdf",
                MediaType.APPLICATION_PDF_VALUE,
                pdfContent
        );
        String watermarkText = "CONFIDENTIAL";

        MvcResult result = mockMvc.perform(multipart("/api/v1/pdfs/annotate/watermark")
                        .file(file)
                        .param("text", watermarkText))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF))
                .andReturn();

        byte[] responseBytes = result.getResponse().getContentAsByteArray();

        // Verify that the watermarked PDF is larger than the original,
        // indicating that content has been added.
        assertTrue(responseBytes.length > pdfContent.length);
    }
}
