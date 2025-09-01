package com.example.pdfprocessor.controller;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.cos.COSName;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import javax.imageio.ImageIO;
import java.awt.Color;
import java.awt.image.BufferedImage;
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
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class PdfControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private byte[] createDummyPdf(int numPages) throws IOException {
        try (PDDocument document = new PDDocument(); ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            for (int i = 1; i <= numPages; i++) {
                PDPage page = new PDPage();
                document.addPage(page);

                PDPageContentStream contentStream = new PDPageContentStream(document, page);
                contentStream.beginText();
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);
                contentStream.newLineAtOffset(100, 700);
                contentStream.showText("This is page " + i + ".");
                contentStream.endText();
                contentStream.close();
            }
            document.save(outputStream);
            return outputStream.toByteArray();
        }
    }

    @Test
    void shouldMergePdfsSuccessfully() throws Exception {
        byte[] pdfContent1 = createDummyPdf(1);
        byte[] pdfContent2 = createDummyPdf(1);

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

    @Test
    void shouldSplitPdfIntoAllPagesSuccessfully() throws Exception {
        int numPages = 3;
        byte[] pdfContent = createDummyPdf(numPages);

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test_3_pages.pdf",
                MediaType.APPLICATION_PDF_VALUE,
                pdfContent
        );

        MvcResult result = mockMvc.perform(multipart("/api/v1/pdfs/split")
                        .file(file))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_OCTET_STREAM))
                .andReturn();

        byte[] responseBytes = result.getResponse().getContentAsByteArray();
        try (ZipInputStream zis = new ZipInputStream(new ByteArrayInputStream(responseBytes))) {
            int fileCount = 0;
            while (zis.getNextEntry() != null) {
                fileCount++;
                ByteArrayOutputStream entryBytes = new ByteArrayOutputStream();
                byte[] buffer = new byte[1024];
                int len;
                while ((len = zis.read(buffer)) > 0) {
                    entryBytes.write(buffer, 0, len);
                }

                try (PDDocument singlePageDoc = Loader.loadPDF(entryBytes.toByteArray())) {
                    assertEquals(1, singlePageDoc.getNumberOfPages(), "Each PDF in the zip should have exactly one page.");
                }
            }
            assertEquals(numPages, fileCount, "The zip archive should contain the same number of files as pages in the source PDF.");
        }
    }

    @Test
    void shouldSplitPdfByPageRange() throws Exception {
        byte[] pdfContent = createDummyPdf(5); // Create a 5-page PDF

        MockMultipartFile file = new MockMultipartFile(
                "file", "test_5_pages.pdf", MediaType.APPLICATION_PDF_VALUE, pdfContent);

        MvcResult result = mockMvc.perform(multipart("/api/v1/pdfs/split")
                        .file(file)
                        .param("ranges", "2-3,5"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF))
                .andReturn();

        byte[] responseBytes = result.getResponse().getContentAsByteArray();
        try (PDDocument resultDoc = Loader.loadPDF(responseBytes)) {
            assertEquals(3, resultDoc.getNumberOfPages(), "The resulting PDF should have 3 pages (2, 3, and 5).");
        }
    }

    private byte[] createDummyImage(int width, int height) throws IOException {
        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        java.awt.Graphics2D g = image.createGraphics();
        g.setColor(Color.RED);
        g.fillRect(0, 0, width, height);
        g.dispose();

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            ImageIO.write(image, "bmp", baos); // BMP is uncompressed
            return baos.toByteArray();
        }
    }

    private byte[] createPdfWithImage(byte[] imageBytes) throws IOException {
        try (PDDocument doc = new PDDocument()) {
            PDPage page = new PDPage();
            doc.addPage(page);
            PDImageXObject pdImage = PDImageXObject.createFromByteArray(doc, imageBytes, "image");

            try (PDPageContentStream contentStream = new PDPageContentStream(doc, page)) {
                contentStream.drawImage(pdImage, 70, 250, pdImage.getWidth() / 2, pdImage.getHeight() / 2);
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            doc.save(baos);
            return baos.toByteArray();
        }
    }

    @Test
    void shouldCompressPdfSuccessfully() throws Exception {
        byte[] imageBytes = createDummyImage(200, 200);
        byte[] pdfWithImageBytes = createPdfWithImage(imageBytes);

        MockMultipartFile file = new MockMultipartFile(
                "file", "uncompressed.pdf", MediaType.APPLICATION_PDF_VALUE, pdfWithImageBytes);

        MvcResult result = mockMvc.perform(multipart("/api/v1/pdfs/compress")
                        .file(file))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF))
                .andReturn();

        byte[] responseBytes = result.getResponse().getContentAsByteArray();
        assertTrue(responseBytes.length > 0, "Compressed PDF should not be empty.");

        try (PDDocument compressedDoc = Loader.loadPDF(responseBytes)) {
            assertEquals(1, compressedDoc.getNumberOfPages());
            PDPage firstPage = compressedDoc.getPage(0);
            boolean jpegFound = false;
            for (COSName name : firstPage.getResources().getXObjectNames()) {
                if (firstPage.getResources().getXObject(name) instanceof PDImageXObject) {
                    PDImageXObject image = (PDImageXObject) firstPage.getResources().getXObject(name);
                    assertEquals("jpg", image.getSuffix());
                    jpegFound = true;
                }
            }
            assertTrue(jpegFound, "A JPEG image should be found in the compressed PDF.");
        }
    }
}
