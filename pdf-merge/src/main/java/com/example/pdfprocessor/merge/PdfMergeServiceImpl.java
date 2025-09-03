package com.example.pdfprocessor.merge;

import com.example.pdfprocessor.api.PdfMergeService;
import org.apache.pdfbox.io.IOUtils;
import org.apache.pdfbox.io.RandomAccessReadBuffer;
import org.apache.pdfbox.multipdf.PDFMergerUtility;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Service
public class PdfMergeServiceImpl implements PdfMergeService {

    @Override
    public byte[] mergePdfs(List<InputStream> files) throws IOException {
        PDFMergerUtility pdfMerger = new PDFMergerUtility();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        pdfMerger.setDestinationStream(outputStream);

        for (InputStream file : files) {
            pdfMerger.addSource(new RandomAccessReadBuffer(file));
        }
        pdfMerger.mergeDocuments(IOUtils.createMemoryOnlyStreamCache());

        return outputStream.toByteArray();
    }
}
