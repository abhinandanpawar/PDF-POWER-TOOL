package com.example.pdfprocessor.pagedeletion;

import com.example.pdfprocessor.api.PdfPageDeletionService;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class PdfPageDeletionServiceImpl implements PdfPageDeletionService {

    @Override
    public byte[] deletePages(List<InputStream> files, List<Integer> pagesToDelete) throws IOException {
        ByteArrayOutputStream zipStream = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(zipStream)) {
            int fileNumber = 1;
            for (InputStream file : files) {
                byte[] modifiedPdf = deletePagesInSinglePdf(file.readAllBytes(), pagesToDelete);
                ZipEntry zipEntry = new ZipEntry("modified_" + fileNumber++ + ".pdf");
                zos.putNextEntry(zipEntry);
                zos.write(modifiedPdf);
                zos.closeEntry();
            }
        }
        return zipStream.toByteArray();
    }

    private byte[] deletePagesInSinglePdf(byte[] pdfBytes, List<Integer> pagesToDelete) throws IOException {
        if (pagesToDelete == null || pagesToDelete.isEmpty()) {
            return pdfBytes; // Return original if no pages are specified for deletion
        }

        try (PDDocument document = Loader.loadPDF(pdfBytes)) {
            int initialPageCount = document.getNumberOfPages();

            // Sort pages in descending order to avoid index shifting issues
            pagesToDelete.sort(Collections.reverseOrder());

            for (int pageNumber : pagesToDelete) {
                // Convert from 1-based to 0-based index
                int pageIndex = pageNumber - 1;
                if (pageIndex >= 0 && pageIndex < document.getNumberOfPages()) {
                    document.removePage(pageIndex);
                } else {
                    // Optionally, throw an exception for invalid page numbers
                    // For now, we just ignore them
                }
            }

            // Ensure we don't delete all pages
            if (document.getNumberOfPages() == 0 && initialPageCount > 0) {
                throw new IOException("Cannot delete all pages from the document.");
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.save(baos);
            return baos.toByteArray();
        }
    }
}
