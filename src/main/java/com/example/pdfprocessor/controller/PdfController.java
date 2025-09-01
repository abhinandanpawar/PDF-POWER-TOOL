package com.example.pdfprocessor.controller;

import com.example.pdfprocessor.service.PdfService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/pdfs")
public class PdfController {

    private final PdfService pdfService;

    public PdfController(PdfService pdfService) {
        this.pdfService = pdfService;
    }

    @PostMapping("/merge")
    public ResponseEntity<byte[]> mergePdfs(@RequestParam("file1") MultipartFile file1,
                                            @RequestParam("file2") MultipartFile file2) {
        if (file1.isEmpty() || file2.isEmpty()) {
            return ResponseEntity.badRequest().body("Please provide two files to merge.".getBytes());
        }

        try {
            byte[] mergedPdfBytes = pdfService.mergePdfs(file1, file2);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "merged.pdf");

            return new ResponseEntity<>(mergedPdfBytes, headers, HttpStatus.OK);
        } catch (IOException e) {
            // A simple error handling. In a real app, we would log this and might have a more sophisticated error response.
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(("Failed to merge PDFs: " + e.getMessage()).getBytes());
        }
    }
}
