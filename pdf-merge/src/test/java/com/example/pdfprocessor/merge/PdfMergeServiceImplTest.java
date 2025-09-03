package com.example.pdfprocessor.merge;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class PdfMergeServiceImplTest {

    private final PdfMergeServiceImpl pdfMergeService = new PdfMergeServiceImpl();

    @Test
    public void testMergePdfs() throws IOException {
        // Create two simple PDF documents in memory
        byte[] pdf1 = createPdfWithOnePage();
        byte[] pdf2 = createPdfWithOnePage();

        // Create a list of InputStreams
        List<InputStream> pdfStreams = Arrays.asList(
                new ByteArrayInputStream(pdf1),
                new ByteArrayInputStream(pdf2)
        );

        // Merge the PDFs
        byte[] mergedPdfBytes = pdfMergeService.mergePdfs(pdfStreams);

        // Verify the merged PDF
        try (PDDocument mergedDocument = Loader.loadPDF(mergedPdfBytes)) {
            assertEquals(2, mergedDocument.getNumberOfPages());
        }
    }

    private byte[] createPdfWithOnePage() throws IOException {
        try (PDDocument document = new PDDocument()) {
            document.addPage(new PDPage());
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.save(baos);
            return baos.toByteArray();
        }
    }
}
