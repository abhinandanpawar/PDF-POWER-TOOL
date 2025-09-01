package com.example.pdfprocessor.controller;

import org.apache.pdfbox.Loader;
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

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class PdfControllerIntegrationTest {

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
    void shouldMergePdfsSuccessfully() throws Exception {
        byte[] pdfContent1 = createDummyPdf("This is the first PDF.");
        byte[] pdfContent2 = createDummyPdf("This is the second PDF.");

        MockMultipartFile file1 = new MockMultipartFile(
                "file1",
                "first.pdf",
                MediaType.APPLICATION_PDF_VALUE,
                pdfContent1
        );

        MockMultipartFile file2 = new MockMultipartFile(
                "file2",
                "second.pdf",
                MediaType.APPLICATION_PDF_VALUE,
                pdfContent2
        );

        MvcResult result = mockMvc.perform(multipart("/api/v1/pdfs/merge")
                        .file(file1)
                        .file(file2))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF))
                .andReturn();

        byte[] responseBytes = result.getResponse().getContentAsByteArray();
        try (PDDocument mergedDoc = Loader.loadPDF(responseBytes)) {
            assertEquals(2, mergedDoc.getNumberOfPages());
        }
    }
}
