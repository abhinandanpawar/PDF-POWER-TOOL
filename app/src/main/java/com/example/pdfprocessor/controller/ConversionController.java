package com.example.pdfprocessor.controller;

import com.example.pdfprocessor.api.PdfConversionService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import com.example.pdfprocessor.api.PdfToImageService;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/v1/convert")
public class ConversionController {

    private final PdfConversionService pdfConversionService;
    private final PdfToImageService pdfToImageService;

    public ConversionController(PdfConversionService pdfConversionService, PdfToImageService pdfToImageService) {
        this.pdfConversionService = pdfConversionService;
        this.pdfToImageService = pdfToImageService;
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

    @PostMapping("/pdf-to-images")
    public ResponseEntity<byte[]> convertPdfToImages(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "format", defaultValue = "png") String format,
            @RequestParam(value = "dpi", defaultValue = "300") int dpi) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        try {
            byte[] zipBytes = pdfToImageService.convertPdfToImages(file.getBytes(), format, dpi);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "images.zip");

            return new ResponseEntity<>(zipBytes, headers, HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
