package com.example.pdfprocessor.controller;

import com.example.pdfprocessor.api.TextExtractionService;
import com.example.pdfprocessor.services.api.service.FileValidationService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/text")
public class TextExtractionController {

    private final TextExtractionService textExtractionService;
    private final FileValidationService fileValidationService;

    public TextExtractionController(TextExtractionService textExtractionService, FileValidationService fileValidationService) {
        this.textExtractionService = textExtractionService;
        this.fileValidationService = fileValidationService;
    }

    @PostMapping("/extract")
    public ResponseEntity<String> extractText(@RequestParam("files") List<MultipartFile> files) {
        try {
            for (MultipartFile file : files) {
                fileValidationService.validateFile(file);
            }
            List<InputStream> fileStreams = files.stream().map(file -> {
                try {
                    return file.getInputStream();
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }).collect(Collectors.toList());
            String extractedText = textExtractionService.extractText(fileStreams);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.TEXT_PLAIN);
            return new ResponseEntity<>(extractedText, headers, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error extracting text from PDF: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
