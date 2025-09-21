package com.example.pdfprocessor.controller;

import com.example.pdfprocessor.api.PdfRotationService;
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
@RequestMapping("/api/v1/pdfs")
public class RotationController {

    private final PdfRotationService pdfRotationService;
    private final FileValidationService fileValidationService;

    public RotationController(PdfRotationService pdfRotationService, FileValidationService fileValidationService) {
        this.pdfRotationService = pdfRotationService;
        this.fileValidationService = fileValidationService;
    }

    @PostMapping("/rotate-pages")
    public ResponseEntity<byte[]> rotatePages(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("pages") List<Integer> pages,
            @RequestParam("degrees") int degrees) {
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
            byte[] resultPdf = pdfRotationService.rotatePages(fileStreams, pages, degrees);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "rotated.zip");

            return new ResponseEntity<>(resultPdf, headers, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage().getBytes());
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
