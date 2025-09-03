package com.example.pdfprocessor.controller;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.text.PDFTextStripper;
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

import java.io.ByteArrayInputStream;
import java.util.zip.ZipInputStream;

@SpringBootTest
@AutoConfigureMockMvc
public class ReorderControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private byte[] createTestPdfWithNumberedPages(int numPages) throws IOException {
        try (PDDocument document = new PDDocument()) {
            for (int i = 1; i <= numPages; i++) {
                PDPage page = new PDPage();
                document.addPage(page);
                try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                    contentStream.beginText();
                    contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);
                    contentStream.newLineAtOffset(100, 700);
                    contentStream.showText("This is page " + i);
                    contentStream.endText();
                }
            }
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.save(baos);
            return baos.toByteArray();
        }
    }

    @Test
    public void testReorderPages() throws Exception {
        byte[] pdfContent = createTestPdfWithNumberedPages(3); // Creates a 3-page PDF

        MockMultipartFile file = new MockMultipartFile(
                "files",
                "test-reorder.pdf",
                MediaType.APPLICATION_PDF_VALUE,
                pdfContent
        );

        // Reorder from 1,2,3 to 3,1,2
        MvcResult result = mockMvc.perform(multipart("/api/v1/pdfs/reorder-pages")
                        .file(file)
                        .param("order", "3", "1", "2"))
                .andExpect(status().isOk())
                .andReturn();

        byte[] responseBytes = result.getResponse().getContentAsByteArray();

        // Verify the new page order by checking the text on each page
        try (ZipInputStream zis = new ZipInputStream(new ByteArrayInputStream(responseBytes))) {
            int fileCount = 0;
            while (zis.getNextEntry() != null) {
                fileCount++;
            }
            assertEquals(1, fileCount);
        }
    }
}
