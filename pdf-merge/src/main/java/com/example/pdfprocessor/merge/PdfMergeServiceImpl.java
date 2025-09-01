package com.example.pdfprocessor.merge;

import com.example.pdfprocessor.api.PdfMergeService;
import org.apache.pdfbox.io.RandomAccessReadBuffer;
import org.apache.pdfbox.multipdf.PDFMergerUtility;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

@Service
public class PdfMergeServiceImpl implements PdfMergeService {

    @Override
    public byte[] mergePdfs(InputStream file1, InputStream file2) throws IOException {
        PDFMergerUtility pdfMerger = new PDFMergerUtility();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        pdfMerger.setDestinationStream(outputStream);

        pdfMerger.addSource(new RandomAccessReadBuffer(file1));
        pdfMerger.addSource(new RandomAccessReadBuffer(file2));
        pdfMerger.mergeDocuments(null);

        return outputStream.toByteArray();
    }
}
