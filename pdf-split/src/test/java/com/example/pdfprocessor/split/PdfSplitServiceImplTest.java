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
import java.util.zip.ZipInputStream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class PdfSplitServiceImplTest {

    private final PdfSplitServiceImpl pdfSplitService = new PdfSplitServiceImpl();

    @Test
    public void testSplitPdf() throws IOException {
        // Create a simple PDF document with 3 pages in memory
        byte[] pdf = createPdfWithPages(3);

        // Create an InputStream
        InputStream pdfStream = new ByteArrayInputStream(pdf);

        // Split the PDF
        byte[] zipBytes = pdfSplitService.split(pdfStream);

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
}