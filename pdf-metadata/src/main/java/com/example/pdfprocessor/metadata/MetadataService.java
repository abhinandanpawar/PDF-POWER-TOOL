package com.example.pdfprocessor.metadata;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentInformation;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

@Service
public class MetadataService {

    public Map<String, Object> getMetadata(byte[] pdfBytes) throws IOException {
        try (PDDocument document = Loader.loadPDF(pdfBytes)) {
            PDDocumentInformation info = document.getDocumentInformation();
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("title", info.getTitle());
            metadata.put("author", info.getAuthor());
            metadata.put("subject", info.getSubject());
            metadata.put("keywords", info.getKeywords());
            metadata.put("creator", info.getCreator());
            metadata.put("producer", info.getProducer());
            metadata.put("creationDate", info.getCreationDate());
            metadata.put("modificationDate", info.getModificationDate());
            return metadata;
        }
    }

    public byte[] setMetadata(byte[] pdfBytes, Map<String, String> metadata) throws IOException {
        try (PDDocument document = Loader.loadPDF(pdfBytes)) {
            PDDocumentInformation info = document.getDocumentInformation();

            metadata.forEach((key, value) -> {
                if ("title".equalsIgnoreCase(key)) {
                    info.setTitle(value);
                } else if ("author".equalsIgnoreCase(key)) {
                    info.setAuthor(value);
                } else if ("subject".equalsIgnoreCase(key)) {
                    info.setSubject(value);
                } else if ("keywords".equalsIgnoreCase(key)) {
                    info.setKeywords(value);
                } else if ("creator".equalsIgnoreCase(key)) {
                    info.setCreator(value);
                } else if ("producer".equalsIgnoreCase(key)) {
                    info.setProducer(value);
                }
            });
            info.setModificationDate(Calendar.getInstance());


            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.save(baos);
            return baos.toByteArray();
        }
    }
}
