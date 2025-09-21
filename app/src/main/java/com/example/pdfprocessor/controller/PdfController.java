package com.example.pdfprocessor.controller;

import com.example.pdfprocessor.api.PdfCompressService;
import com.example.pdfprocessor.api.PdfMergeService;
import com.example.pdfprocessor.api.PdfSplitService;
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
public class PdfController {

    private final PdfMergeService pdfMergeService;
    private final PdfSplitService pdfSplitService;
    private final PdfCompressService pdfCompressService;
    private final FileValidationService fileValidationService;

    public PdfController(PdfMergeService pdfMergeService, PdfSplitService pdfSplitService, PdfCompressService pdfCompressService, FileValidationService fileValidationService) {
        this.pdfMergeService = pdfMergeService;
        this.pdfSplitService = pdfSplitService;
        this.pdfCompressService = pdfCompressService;
        this.fileValidationService = fileValidationService;
    }

    @PostMapping("/merge")
    public ResponseEntity<byte[]> mergePdfs(@RequestParam("files") List<MultipartFile> files) {
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
            byte[] mergedPdfBytes = pdfMergeService.mergePdfs(fileStreams);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "merged.pdf");
            return new ResponseEntity<>(mergedPdfBytes, headers, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage().getBytes());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/split")
    public ResponseEntity<byte[]> splitPdfs(@RequestParam("files") List<MultipartFile> files,
                                           @RequestParam(required = false) String ranges) {
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
            byte[] resultBytes = pdfSplitService.splitPdfs(fileStreams, ranges);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "split.zip");
            return new ResponseEntity<>(resultBytes, headers, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage().getBytes());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/compress")
    public ResponseEntity<byte[]> compressPdfs(@RequestParam("files") List<MultipartFile> files) {
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
            byte[] compressedPdfBytes = pdfCompressService.compressPdfs(fileStreams);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "compressed.zip");
            return new ResponseEntity<>(compressedPdfBytes, headers, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage().getBytes());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
