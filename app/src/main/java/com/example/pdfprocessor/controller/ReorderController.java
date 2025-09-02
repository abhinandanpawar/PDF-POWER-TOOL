package com.example.pdfprocessor.controller;

import com.example.pdfprocessor.api.PdfReorderService;
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
public class ReorderController {

    private final PdfReorderService pdfReorderService;

    public ReorderController(PdfReorderService pdfReorderService) {
        this.pdfReorderService = pdfReorderService;
    }

    @PostMapping("/reorder-pages")
    public ResponseEntity<byte[]> reorderPages(
            @RequestParam("file") MultipartFile file,
            @RequestParam("order") List<Integer> order) {
        try {
            byte[] resultPdf = pdfReorderService.reorderPages(file.getBytes(), order);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "reordered_" + file.getOriginalFilename());

            return new ResponseEntity<>(resultPdf, headers, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage().getBytes());
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
