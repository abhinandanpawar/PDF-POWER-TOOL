package com.example.pdfprocessor.controller;

import com.example.pdfprocessor.api.PdfCompressService;
import com.example.pdfprocessor.api.PdfMergeService;
import com.example.pdfprocessor.api.PdfSplitService;
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

    private final PdfMergeService pdfMergeService;
    private final PdfSplitService pdfSplitService;
    private final PdfCompressService pdfCompressService;

    public PdfController(PdfMergeService pdfMergeService, PdfSplitService pdfSplitService, PdfCompressService pdfCompressService) {
        this.pdfMergeService = pdfMergeService;
        this.pdfSplitService = pdfSplitService;
        this.pdfCompressService = pdfCompressService;
    }

    @PostMapping("/merge")
    public ResponseEntity<byte[]> mergePdfs(@RequestParam("file1") MultipartFile file1,
                                            @RequestParam("file2") MultipartFile file2) {
        if (file1.isEmpty() || file2.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            byte[] mergedPdfBytes = pdfMergeService.mergePdfs(file1.getInputStream(), file2.getInputStream());
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "merged.pdf");
            return new ResponseEntity<>(mergedPdfBytes, headers, HttpStatus.OK);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/split")
    public ResponseEntity<byte[]> splitPdf(@RequestParam("file") MultipartFile file,
                                           @RequestParam(required = false) String ranges) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            byte[] resultBytes = pdfSplitService.splitPdf(file.getInputStream(), ranges);
            HttpHeaders headers = new HttpHeaders();

            if (ranges == null || ranges.trim().isEmpty()) {
                headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
                headers.setContentDispositionFormData("attachment", "split_documents.zip");
            } else {
                headers.setContentType(MediaType.APPLICATION_PDF);
                headers.setContentDispositionFormData("attachment", "split_pages.pdf");
            }

            return new ResponseEntity<>(resultBytes, headers, HttpStatus.OK);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/compress")
    public ResponseEntity<byte[]> compressPdf(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            byte[] compressedPdfBytes = pdfCompressService.compressPdf(file.getInputStream());
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "compressed.pdf");
            return new ResponseEntity<>(compressedPdfBytes, headers, HttpStatus.OK);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
