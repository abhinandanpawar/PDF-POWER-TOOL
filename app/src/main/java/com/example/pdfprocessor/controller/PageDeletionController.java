package com.example.pdfprocessor.controller;

import com.example.pdfprocessor.api.PdfPageDeletionService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/pdfs")
public class PageDeletionController {

    private final PdfPageDeletionService pdfPageDeletionService;

    public PageDeletionController(PdfPageDeletionService pdfPageDeletionService) {
        this.pdfPageDeletionService = pdfPageDeletionService;
    }

    @PostMapping("/delete-pages")
    public ResponseEntity<byte[]> deletePages(
            @RequestParam("file") MultipartFile file,
            @RequestParam("pages") List<Integer> pages) {
        try {
            byte[] resultPdf = pdfPageDeletionService.deletePages(file.getBytes(), pages);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "deleted_" + file.getOriginalFilename());

            return new ResponseEntity<>(resultPdf, headers, HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
