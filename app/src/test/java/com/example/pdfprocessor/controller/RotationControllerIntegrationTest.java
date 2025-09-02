package com.example.pdfprocessor.controller;

import org.apache.pdfbox.Loader;
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class RotationControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private byte[] createTestPdf(int numPages) throws IOException {
        try (PDDocument document = new PDDocument()) {
            for (int i = 0; i < numPages; i++) {
                document.addPage(new PDPage());
            }
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.save(baos);
            return baos.toByteArray();
        }
    }

    @Test
    public void testRotatePages() throws Exception {
        byte[] pdfContent = createTestPdf(2);

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test-rotate.pdf",
                MediaType.APPLICATION_PDF_VALUE,
                pdfContent
        );

        // Rotate page 1 by 90 degrees
        MvcResult result = mockMvc.perform(multipart("/api/v1/pdfs/rotate-pages")
                        .file(file)
                        .param("pages", "1")
                        .param("degrees", "90"))
                .andExpect(status().isOk())
                .andReturn();

        byte[] responseBytes = result.getResponse().getContentAsByteArray();

        // Verify the rotation of the first page
        try (PDDocument resultDoc = Loader.loadPDF(responseBytes)) {
            assertEquals(2, resultDoc.getNumberOfPages());
            assertEquals(90, resultDoc.getPage(0).getRotation());
            assertEquals(0, resultDoc.getPage(1).getRotation()); // Second page should be unaffected
        }
    }
}
