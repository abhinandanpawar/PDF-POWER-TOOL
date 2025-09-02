package com.example.pdfprocessor.controller;

import com.example.pdfprocessor.api.TextExtractionService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/text")
public class TextExtractionController {

    private final TextExtractionService textExtractionService;

    public TextExtractionController(TextExtractionService textExtractionService) {
        this.textExtractionService = textExtractionService;
    }

    @PostMapping("/extract")
    public ResponseEntity<String> extractText(@RequestParam("file") MultipartFile file) {
        try {
            String extractedText = textExtractionService.extractText(file.getBytes());
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.TEXT_PLAIN);
            return new ResponseEntity<>(extractedText, headers, HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error extracting text from PDF: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
