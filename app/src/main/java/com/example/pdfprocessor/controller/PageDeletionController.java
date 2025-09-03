package com.example.pdfprocessor.controller;

import com.example.pdfprocessor.api.PdfPageDeletionService;
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
public class PageDeletionController {

    private final PdfPageDeletionService pdfPageDeletionService;

    public PageDeletionController(PdfPageDeletionService pdfPageDeletionService) {
        this.pdfPageDeletionService = pdfPageDeletionService;
    }

    @PostMapping("/delete-pages")
    public ResponseEntity<byte[]> deletePages(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("pages") List<Integer> pages) {
        try {
            List<InputStream> fileStreams = files.stream().map(file -> {
                try {
                    return file.getInputStream();
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }).collect(Collectors.toList());
            byte[] resultPdf = pdfPageDeletionService.deletePages(fileStreams, pages);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "deleted_pages.zip");

            return new ResponseEntity<>(resultPdf, headers, HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
