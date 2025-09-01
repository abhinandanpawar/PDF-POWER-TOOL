package com.example.pdfprocessor.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class ConversionService {

    public byte[] convertPdfToWord(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("File is empty.");
        }

        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);

            try (XWPFDocument docx = new XWPFDocument();
                 ByteArrayOutputStream out = new ByteArrayOutputStream()) {

                // In a real application, we might split the text by lines or paragraphs.
                // For this basic implementation, we'll put all text into one paragraph.
                XWPFParagraph paragraph = docx.createParagraph();
                XWPFRun run = paragraph.createRun();
                run.setText(text);

                docx.write(out);
                return out.toByteArray();
            }
        }
    }
}
