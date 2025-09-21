package com.example.pdfprocessor.controller;

import com.example.pdfprocessor.api.PdfAnnotationService;
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
@RequestMapping("/api/v1/pdfs/annotate")
public class AnnotationController {

    private final PdfAnnotationService pdfAnnotationService;
    private final FileValidationService fileValidationService;

    public AnnotationController(PdfAnnotationService pdfAnnotationService, FileValidationService fileValidationService) {
        this.pdfAnnotationService = pdfAnnotationService;
        this.fileValidationService = fileValidationService;
    }

    @PostMapping("/watermark")
    public ResponseEntity<byte[]> addWatermarks(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("text") String text) {
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
            byte[] watermarkedPdf = pdfAnnotationService.addWatermarks(fileStreams, text);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "watermarked.zip");

            return new ResponseEntity<>(watermarkedPdf, headers, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage().getBytes());
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
