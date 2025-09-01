package com.example.pdfprocessor.controller;

import com.example.pdfprocessor.api.PdfAnnotationService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/pdfs/annotate")
public class AnnotationController {

    private final PdfAnnotationService pdfAnnotationService;

    public AnnotationController(PdfAnnotationService pdfAnnotationService) {
        this.pdfAnnotationService = pdfAnnotationService;
    }

    @PostMapping("/watermark")
    public ResponseEntity<byte[]> addWatermark(
            @RequestParam("file") MultipartFile file,
            @RequestParam("text") String text) {
        try {
            byte[] watermarkedPdf = pdfAnnotationService.addWatermark(file.getBytes(), text);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "watermarked_" + file.getOriginalFilename());

            return new ResponseEntity<>(watermarkedPdf, headers, HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
