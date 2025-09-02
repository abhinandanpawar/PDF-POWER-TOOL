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
    public byte[] splitPdfs(List<InputStream> files, String ranges) throws IOException {
        try (ByteArrayOutputStream zipStream = new ByteArrayOutputStream();
             ZipOutputStream zos = new ZipOutputStream(zipStream)) {
            int fileNum = 1;
            for (InputStream file : files) {
                byte[] fileBytes = file.readAllBytes();
                if (ranges == null || ranges.trim().isEmpty()) {
                    splitToZip(zos, fileBytes, fileNum);
                } else {
                    extractPagesToZip(zos, fileBytes, ranges, fileNum);
                }
                fileNum++;
            }
            zos.finish();
            return zipStream.toByteArray();
        }
    }

    private void splitToZip(ZipOutputStream zos, byte[] fileBytes, int fileNum) throws IOException {
        PDDocument document = Loader.loadPDF(fileBytes);
        Splitter splitter = new Splitter();
        List<PDDocument> splitPages = splitter.split(document);
        document.close();

        int pageNum = 1;
        for (PDDocument pageDoc : splitPages) {
            try (ByteArrayOutputStream pageOut = new ByteArrayOutputStream()) {
                pageDoc.save(pageOut);
                ZipEntry zipEntry = new ZipEntry("file_" + fileNum + "_page_" + pageNum++ + ".pdf");
                zos.putNextEntry(zipEntry);
                zos.write(pageOut.toByteArray());
                zos.closeEntry();
            } finally {
                pageDoc.close();
            }
        }
    }

    private void extractPagesToZip(ZipOutputStream zos, byte[] fileBytes, String ranges, int fileNum) throws IOException {
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

            ZipEntry zipEntry = new ZipEntry("file_" + fileNum + "_extracted.pdf");
            zos.putNextEntry(zipEntry);
            zos.write(outputStream.toByteArray());
            zos.closeEntry();
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
