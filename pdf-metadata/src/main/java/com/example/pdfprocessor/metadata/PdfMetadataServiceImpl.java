package com.example.pdfprocessor.metadata;

import com.example.pdfprocessor.api.PdfMetadata;
import com.example.pdfprocessor.api.PdfMetadataService;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentInformation;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class PdfMetadataServiceImpl implements PdfMetadataService {

    @Override
    public PdfMetadata getMetadata(byte[] pdfBytes) throws IOException {
        try (PDDocument document = Loader.loadPDF(pdfBytes)) {
            PDDocumentInformation info = document.getDocumentInformation();
            PdfMetadata metadata = new PdfMetadata();
            metadata.setTitle(info.getTitle());
            metadata.setAuthor(info.getAuthor());
            metadata.setSubject(info.getSubject());
            metadata.setKeywords(info.getKeywords());
            return metadata;
        }
    }

    @Override
    public byte[] setMetadata(byte[] pdfBytes, PdfMetadata metadata) throws IOException {
        try (PDDocument document = Loader.loadPDF(pdfBytes)) {
            PDDocumentInformation info = new PDDocumentInformation();
            info.setTitle(metadata.getTitle());
            info.setAuthor(metadata.getAuthor());
            info.setSubject(metadata.getSubject());
            info.setKeywords(metadata.getKeywords());
            document.setDocumentInformation(info);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.save(baos);
            return baos.toByteArray();
        }
    }
}
