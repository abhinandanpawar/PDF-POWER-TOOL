package com.example.pdfprocessor.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.io.RandomAccessReadBuffer;
import org.apache.pdfbox.multipdf.PDFMergerUtility;
import org.apache.pdfbox.multipdf.Splitter;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class PdfService {

    public byte[] mergePdfs(MultipartFile file1, MultipartFile file2) throws IOException {
        if (file1.isEmpty() || file2.isEmpty()) {
            throw new IOException("One or both files are empty.");
        }

        PDFMergerUtility pdfMerger = new PDFMergerUtility();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        pdfMerger.setDestinationStream(outputStream);

        try (InputStream is1 = file1.getInputStream(); InputStream is2 = file2.getInputStream()) {
            // As of PDFBox 3.x, InputStreams must be wrapped in a RandomAccessReadBuffer
            pdfMerger.addSource(new RandomAccessReadBuffer(is1));
            pdfMerger.addSource(new RandomAccessReadBuffer(is2));

            // Passing null uses the default in-memory usage
            pdfMerger.mergeDocuments(null);
        }

        return outputStream.toByteArray();
    }

    public byte[] splitPdf(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("File is empty.");
        }

        PDDocument document = Loader.loadPDF(file.getBytes());
        Splitter splitter = new Splitter();
        List<PDDocument> splitPages = splitter.split(document);
        document.close(); // Close the original document as soon as we're done splitting

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
}
