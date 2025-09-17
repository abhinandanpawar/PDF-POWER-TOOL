package com.example.pdfprocessor.controller;

import com.example.pdfprocessor.api.PdfMetadata;
import com.example.pdfprocessor.api.PdfMetadataService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.pdfprocessor.api.PdfMetadata;
import com.example.pdfprocessor.api.PdfMetadataService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/pdfs/metadata")
public class MetadataController {

    private final PdfMetadataService pdfMetadataService;

    public MetadataController(PdfMetadataService pdfMetadataService) {
        this.pdfMetadataService = pdfMetadataService;
    }

    @PostMapping("/get")
    public ResponseEntity<PdfMetadata> getMetadata(@RequestParam("file") MultipartFile file) {
        try {
            PdfMetadata metadata = pdfMetadataService.getMetadata(file.getBytes());
            return ResponseEntity.ok(metadata);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<byte[]> setMetadata(
            @RequestPart("file") MultipartFile file,
            @RequestPart("metadata") Map<String, String> metadataMap) {
        try {
            PdfMetadata metadata = new PdfMetadata();
            metadataMap.forEach((key, value) -> {
                if ("title".equalsIgnoreCase(key)) {
                    metadata.setTitle(value);
                } else if ("author".equalsIgnoreCase(key)) {
                    metadata.setAuthor(value);
                } else if ("subject".equalsIgnoreCase(key)) {
                    metadata.setSubject(value);
                } else if ("keywords".equalsIgnoreCase(key)) {
                    metadata.setKeywords(value);
                }
            });

            byte[] resultPdf = pdfMetadataService.setMetadata(file.getBytes(), metadata);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "metadata_updated_" + file.getOriginalFilename());

            return new ResponseEntity<>(resultPdf, headers, HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
