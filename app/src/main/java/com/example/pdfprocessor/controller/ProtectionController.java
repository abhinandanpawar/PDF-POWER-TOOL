package com.example.pdfprocessor.controller;

import com.example.pdfprocessor.api.PdfProtectionService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/pdfs")
public class ProtectionController {

    private final PdfProtectionService pdfProtectionService;

    public ProtectionController(PdfProtectionService pdfProtectionService) {
        this.pdfProtectionService = pdfProtectionService;
    }

    @PostMapping("/protect")
    public ResponseEntity<byte[]> protectPdf(
            @RequestParam("file") MultipartFile file,
            @RequestParam("password") String password) {
        try {
            byte[] protectedPdf = pdfProtectionService.protectPdf(file.getBytes(), password);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "protected_" + file.getOriginalFilename());

            return new ResponseEntity<>(protectedPdf, headers, HttpStatus.OK);
        } catch (IOException e) {
            // Consider more specific error handling
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
