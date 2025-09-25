package com.example.pdfprocessor.controller;

import com.example.pdfprocessor.api.PdfCompressService;
import com.example.pdfprocessor.api.PdfMergeService;
import com.example.pdfprocessor.api.PdfSplitService;
import com.example.pdfprocessor.service.PdfService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@RestController
@RequestMapping("/api/v1/pdfs")
public class PdfController {

    private static final Logger logger = LoggerFactory.getLogger(PdfController.class);

    private final PdfMergeService pdfMergeService;
    private final PdfSplitService pdfSplitService;
    private final PdfCompressService pdfCompressService;
    private final PdfService pdfService;

    public PdfController(PdfMergeService pdfMergeService, PdfSplitService pdfSplitService,
                         PdfCompressService pdfCompressService, PdfService pdfService) {
        this.pdfMergeService = pdfMergeService;
        this.pdfSplitService = pdfSplitService;
        this.pdfCompressService = pdfCompressService;
        this.pdfService = pdfService;
    }

    @PostMapping("/merge")
    public ResponseEntity<byte[]> mergePdfs(@RequestParam("files") List<MultipartFile> files) {
        logger.info("Received request to merge {} files", files.size());
        try {
            pdfService.validateFiles(files);
            List<InputStream> fileStreams = pdfService.getFileInputStreams(files);
            byte[] mergedPdfBytes = pdfMergeService.mergePdfs(fileStreams);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "merged.pdf");
            logger.info("Successfully merged files");
            return new ResponseEntity<>(mergedPdfBytes, headers, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid argument for merging files", e);
            return ResponseEntity.badRequest().body(e.getMessage().getBytes());
        } catch (IOException e) {
            logger.error("IO exception while merging files", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/split")
    public ResponseEntity<byte[]> splitPdfs(@RequestParam("files") List<MultipartFile> files,
                                           @RequestParam(required = false) String ranges) {
        try {
            pdfService.validateFiles(files);
            List<InputStream> fileStreams = pdfService.getFileInputStreams(files);
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
            pdfService.validateFiles(files);
            List<InputStream> fileStreams = pdfService.getFileInputStreams(files);
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
