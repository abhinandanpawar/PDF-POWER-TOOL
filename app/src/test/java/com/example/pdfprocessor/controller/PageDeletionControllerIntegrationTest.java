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

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.zip.ZipInputStream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class PageDeletionControllerIntegrationTest {

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
    public void testDeletePages() throws Exception {
        int initialPages = 5;
        byte[] pdfContent = createTestPdf(initialPages);

        MockMultipartFile file = new MockMultipartFile(
                "files",
                "test-delete.pdf",
                MediaType.APPLICATION_PDF_VALUE,
                pdfContent
        );

        // Delete pages 2 and 4 (1-based index)
        MvcResult result = mockMvc.perform(multipart("/api/v1/pdfs/delete-pages")
                        .file(file)
                        .param("pages", "2", "4"))
                .andExpect(status().isOk())
                .andReturn();

        byte[] responseBytes = result.getResponse().getContentAsByteArray();

        // Verify the new page count
        try (ZipInputStream zis = new ZipInputStream(new ByteArrayInputStream(responseBytes))) {
            int fileCount = 0;
            while (zis.getNextEntry() != null) {
                fileCount++;
            }
            assertEquals(1, fileCount);
        }
    }
}
