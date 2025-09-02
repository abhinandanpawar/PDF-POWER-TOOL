package com.example.pdfprocessor.extraction;

import com.example.pdfprocessor.api.TextExtractionService;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Service
public class TextExtractionServiceImpl implements TextExtractionService {

    @Override
    public String extractText(List<InputStream> files) throws IOException {
        StringBuilder combinedText = new StringBuilder();
        for (InputStream file : files) {
            try (PDDocument document = Loader.loadPDF(file.readAllBytes())) {
                PDFTextStripper textStripper = new PDFTextStripper();
                combinedText.append(textStripper.getText(document));
                combinedText.append("\n\n--- End of File ---\n\n");
            }
        }
        return combinedText.toString();
    }
}
