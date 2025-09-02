package com.example.pdfprocessor.controller;

import com.example.pdfprocessor.api.PdfProtectionService;
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
@RequestMapping("/api/v1/pdfs")
public class ProtectionController {

    private final PdfProtectionService pdfProtectionService;

    public ProtectionController(PdfProtectionService pdfProtectionService) {
        this.pdfProtectionService = pdfProtectionService;
    }

    @PostMapping("/protect")
    public ResponseEntity<byte[]> protectPdfs(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("password") String password) {
        try {
            List<InputStream> fileStreams = files.stream().map(file -> {
                try {
                    return file.getInputStream();
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }).collect(Collectors.toList());
            byte[] protectedPdf = pdfProtectionService.protectPdfs(fileStreams, password);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "protected.zip");

            return new ResponseEntity<>(protectedPdf, headers, HttpStatus.OK);
        } catch (IOException e) {
            // Consider more specific error handling
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
