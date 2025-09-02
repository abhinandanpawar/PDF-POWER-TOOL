package com.example.pdfprocessor.split;

import com.example.pdfprocessor.api.PdfSplitService;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.multipdf.Splitter;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class PdfSplitServiceImpl implements PdfSplitService {

    @Override
    public byte[] splitPdf(InputStream file, String ranges) throws IOException {
        byte[] fileBytes = file.readAllBytes();

        if (ranges == null || ranges.trim().isEmpty()) {
            return splitToZip(fileBytes);
        } else {
            return extractPages(fileBytes, ranges);
        }
    }

    private byte[] splitToZip(byte[] fileBytes) throws IOException {
        PDDocument document = Loader.loadPDF(fileBytes);
        Splitter splitter = new Splitter();
        List<PDDocument> splitPages = splitter.split(document);
        document.close();

        try (ByteArrayOutputStream zipStream = new ByteArrayOutputStream();
             ZipOutputStream zos = new ZipOutputStream(zipStream)) {
            int pageNum = 1;
            for (PDDocument pageDoc : splitPages) {
                try (ByteArrayOutputStream pageOut = new ByteArrayOutputStream()) {
                    pageDoc.save(pageOut);
                    ZipEntry zipEntry = new ZipEntry("page_" + pageNum++ + ".pdf");
                    zos.putNextEntry(zipEntry);
                    zos.write(pageOut.toByteArray());
                    zos.closeEntry();
                } finally {
                    pageDoc.close();
                }
            }
            zos.finish();
            return zipStream.toByteArray();
        }
    }

    private byte[] extractPages(byte[] fileBytes, String ranges) throws IOException {
        Set<Integer> pageNumbers = parseRanges(ranges);
        try (PDDocument document = Loader.loadPDF(fileBytes);
             PDDocument newDocument = new PDDocument()) {
            for (int pageNum : pageNumbers) {
                if (pageNum > 0 && pageNum <= document.getNumberOfPages()) {
                    newDocument.addPage(document.getPage(pageNum - 1));
                }
            }
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            newDocument.save(outputStream);
            return outputStream.toByteArray();
        }
    }

    private Set<Integer> parseRanges(String ranges) {
        Set<Integer> pageNumbers = new HashSet<>();
        String[] parts = ranges.split(",");
        for (String part : parts) {
            part = part.trim();
            if (part.contains("-")) {
                String[] range = part.split("-");
                int start = Integer.parseInt(range[0]);
                int end = Integer.parseInt(range[1]);
                for (int i = start; i <= end; i++) {
                    pageNumbers.add(i);
                }
            } else {
                pageNumbers.add(Integer.parseInt(part));
            }
        }
        return pageNumbers;
    }
}
