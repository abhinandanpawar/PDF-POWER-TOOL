package com.example.pdfprocessor.reorder;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.text.PDFTextStripper;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;
import java.util.zip.ZipInputStream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class PdfReorderServiceImplTest {

    private final PdfReorderServiceImpl pdfReorderService = new PdfReorderServiceImpl();

    private byte[] createPdfWithNumberedPages(int numPages) throws IOException {
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
    public void testReorderPages() throws IOException {
        // Create a PDF with 3 pages
        byte[] pdf = createPdfWithNumberedPages(3);

        // Create a list of InputStreams
        List<InputStream> pdfStreams = Arrays.asList(new ByteArrayInputStream(pdf));

        // Reorder the pages
        List<Integer> newOrder = Arrays.asList(3, 1, 2);
        byte[] reorderedPdfZip = pdfReorderService.reorderPages(pdfStreams, newOrder);

        // Verify the reordered PDF
        try (ZipInputStream zis = new ZipInputStream(new ByteArrayInputStream(reorderedPdfZip))) {
            zis.getNextEntry();
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            byte[] buffer = new byte[1024];
            int len;
            while ((len = zis.read(buffer)) > 0) {
                baos.write(buffer, 0, len);
            }
            byte[] reorderedPdfBytes = baos.toByteArray();

            try (PDDocument reorderedDocument = Loader.loadPDF(reorderedPdfBytes)) {
                assertEquals(3, reorderedDocument.getNumberOfPages());
                PDFTextStripper stripper = new PDFTextStripper();
                stripper.setStartPage(1);
                stripper.setEndPage(1);
                String text = stripper.getText(reorderedDocument);
                assertTrue(text.contains("This is page 3"));

                stripper.setStartPage(2);
                stripper.setEndPage(2);
                text = stripper.getText(reorderedDocument);
                assertTrue(text.contains("This is page 1"));

                stripper.setStartPage(3);
                stripper.setEndPage(3);
                text = stripper.getText(reorderedDocument);
                assertTrue(text.contains("This is page 2"));
            }
        }
    }
}
