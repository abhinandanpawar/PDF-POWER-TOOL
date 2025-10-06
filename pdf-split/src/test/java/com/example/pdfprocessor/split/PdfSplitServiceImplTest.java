package com.example.pdfprocessor.split;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class PdfSplitServiceImplTest {

    private final PdfSplitServiceImpl pdfSplitService = new PdfSplitServiceImpl();

    @Test
    public void testSplitPdf() throws IOException {
        // Create a simple PDF document with 3 pages in memory
        byte[] pdf = createPdfWithPages(3);

        // Create an InputStream
        InputStream pdfStream = new ByteArrayInputStream(pdf);

        // Split the PDF
        byte[] zipBytes = pdfSplitService.splitPdfs(List.of(pdfStream), null);

        // Verify the created ZIP file
        assertNotNull(zipBytes);
        ZipInputStream zis = new ZipInputStream(new ByteArrayInputStream(zipBytes));
        int entryCount = 0;
        while (zis.getNextEntry() != null) {
            entryCount++;
        }
        assertEquals(3, entryCount);
    }

    private byte[] createPdfWithPages(int numPages) throws IOException {
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
    public void testSplitPdf_withInvalidRange() throws IOException {
        // Create a simple PDF document with 5 pages in memory
        byte[] pdf = createPdfWithPages(5);

        // Create an InputStream
        InputStream pdfStream = new ByteArrayInputStream(pdf);

        // Split the PDF with an invalid range. "a" should be ignored, and pages 1 and 3 should be extracted.
        byte[] zipBytes = pdfSplitService.splitPdfs(List.of(pdfStream), "1,a,3");

        // Verify the created ZIP file
        assertNotNull(zipBytes);
        try (ZipInputStream zis = new ZipInputStream(new ByteArrayInputStream(zipBytes))) {
            ZipEntry entry = zis.getNextEntry();
            assertNotNull(entry);
            assertEquals("file_1_extracted.pdf", entry.getName());

            // check that the extracted pdf has 2 pages
            try (PDDocument doc = Loader.loadPDF(zis.readAllBytes())) {
                assertEquals(2, doc.getNumberOfPages());
            }

            // No more entries
            assertNull(zis.getNextEntry());
        }
    }

    @Test
    public void testSplitPdf_withReversedRange() throws IOException {
        // Create a simple PDF document with 5 pages in memory
        byte[] pdf = createPdfWithPages(5);

        // Create an InputStream
        InputStream pdfStream = new ByteArrayInputStream(pdf);

        // Split the PDF with a reversed range
        byte[] zipBytes = pdfSplitService.splitPdfs(List.of(pdfStream), "5-1");

        // Verify the created ZIP file
        assertNotNull(zipBytes);
        ZipInputStream zis = new ZipInputStream(new ByteArrayInputStream(zipBytes));
        // Expecting 0 files, as the range is invalid
        assertEquals(null, zis.getNextEntry());
    }
}