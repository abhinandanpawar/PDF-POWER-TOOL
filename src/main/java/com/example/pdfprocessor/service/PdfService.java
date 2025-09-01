package com.example.pdfprocessor.service;

import org.apache.pdfbox.io.RandomAccessReadBuffer;
import org.apache.pdfbox.multipdf.PDFMergerUtility;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

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
}
