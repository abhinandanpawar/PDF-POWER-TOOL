package com.example.pdfprocessor.controller;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
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
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class ConversionControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private byte[] createDummyPdf(String text) throws IOException {
        try (PDDocument document = new PDDocument(); ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PDPage page = new PDPage();
            document.addPage(page);

            PDPageContentStream contentStream = new PDPageContentStream(document, page);
            contentStream.beginText();
            contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);
            contentStream.newLineAtOffset(100, 700);
            contentStream.showText(text);
            contentStream.endText();
            contentStream.close();

            document.save(outputStream);
            return outputStream.toByteArray();
        }
    }

    @Test
    void shouldConvertPdfToWord() throws Exception {
        byte[] pdfContent = createDummyPdf("This is a test.");

        MockMultipartFile file = new MockMultipartFile(
                "files",
                "test.pdf",
                MediaType.APPLICATION_PDF_VALUE,
                pdfContent
        );

        MvcResult result = mockMvc.perform(multipart("/api/v1/convert/pdf-to-word")
                        .file(file))
                .andExpect(status().isOk())
                .andReturn();

        byte[] responseBytes = result.getResponse().getContentAsByteArray();
        String contentType = result.getResponse().getContentType();

        assertEquals(MediaType.APPLICATION_OCTET_STREAM_VALUE, contentType);
        assertTrue(responseBytes.length > 0, "zip file should not be empty.");
    }

    @Test
    void shouldConvertPdfToImages() throws Exception {
        byte[] pdfContent = createDummyPdf("This is a test.");

        MockMultipartFile file = new MockMultipartFile(
                "files",
                "test.pdf",
                MediaType.APPLICATION_PDF_VALUE,
                pdfContent
        );

        mockMvc.perform(multipart("/api/v1/convert/pdf-to-images")
                        .file(file))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", "attachment; filename=\"images.zip\""))
                .andExpect(mvcResult -> {
                    byte[] responseBytes = mvcResult.getResponse().getContentAsByteArray();
                    try (ZipInputStream zis = new ZipInputStream(new ByteArrayInputStream(responseBytes))) {
                        ZipEntry entry = zis.getNextEntry();
                        assertNotNull(entry);
                        assertTrue(entry.getName().endsWith(".png"));
                    }
                });
    }
}
