package com.example.pdfprocessor.controller;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.encryption.InvalidPasswordException;
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

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

@SpringBootTest
@AutoConfigureMockMvc
public class ProtectionControllerIntegrationTest {

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
    public void testProtectPdf() throws Exception {
        byte[] pdfContent = createTestPdf();
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.pdf",
                MediaType.APPLICATION_PDF_VALUE,
                pdfContent
        );
        String password = "testpassword";

        MvcResult result = mockMvc.perform(multipart("/api/v1/pdfs/protect")
                        .file(file)
                        .param("password", password))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF))
                .andReturn();

        byte[] responseBytes = result.getResponse().getContentAsByteArray();

        // 1. Try to load without a password (should fail)
        assertThrows(InvalidPasswordException.class, () -> {
            Loader.loadPDF(responseBytes);
        });

        // 2. Try to load with the correct password (should succeed)
        PDDocument protectedDoc = Loader.loadPDF(responseBytes, password);
        assertTrue(protectedDoc.isEncrypted());
        protectedDoc.close();
    }
}
