package com.example.pdfprocessor.reorder;

import com.example.pdfprocessor.api.PdfReorderService;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class PdfReorderServiceImpl implements PdfReorderService {

    @Override
    public byte[] reorderPages(byte[] pdfBytes, List<Integer> newOrder) throws IOException {
        try (PDDocument originalDoc = Loader.loadPDF(pdfBytes)) {
            int pageCount = originalDoc.getNumberOfPages();

            // Validate the newOrder list
            if (newOrder == null || newOrder.size() != pageCount) {
                throw new IllegalArgumentException("The new order must contain the same number of pages as the original document.");
            }
            Set<Integer> pageSet = new HashSet<>(newOrder);
            if (pageSet.size() != pageCount) {
                throw new IllegalArgumentException("The new order cannot contain duplicate page numbers.");
            }

            try (PDDocument newDoc = new PDDocument()) {
                for (int pageNumber : newOrder) {
                    // Convert 1-based page number to 0-based index
                    int pageIndex = pageNumber - 1;
                    if (pageIndex < 0 || pageIndex >= pageCount) {
                        throw new IllegalArgumentException("Invalid page number in new order: " + pageNumber);
                    }
                    newDoc.addPage(originalDoc.getPage(pageIndex));
                }

                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                newDoc.save(baos);
                return baos.toByteArray();
            }
        }
    }
}
