package com.example.pdfprocessor.controller;

import com.example.pdfprocessor.api.PdfConversionService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/convert")
public class ConversionController {

    private final PdfConversionService pdfConversionService;

    public ConversionController(PdfConversionService pdfConversionService) {
        this.pdfConversionService = pdfConversionService;
    }

    @PostMapping("/pdf-to-word")
    public ResponseEntity<byte[]> convertPdfToWord(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            byte[] docxBytes = pdfConversionService.convertPdfToWord(file.getInputStream());

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=converted.docx");
            headers.add(HttpHeaders.CONTENT_TYPE, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

            return new ResponseEntity<>(docxBytes, headers, HttpStatus.OK);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
