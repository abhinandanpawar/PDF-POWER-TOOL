package com.example.pdfprocessor.controller;

import com.example.pdfprocessor.api.PdfRotationService;
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
public class RotationController {

    private final PdfRotationService pdfRotationService;

    public RotationController(PdfRotationService pdfRotationService) {
        this.pdfRotationService = pdfRotationService;
    }

    @PostMapping("/rotate-pages")
    public ResponseEntity<byte[]> rotatePages(
            @RequestParam("file") MultipartFile file,
            @RequestParam("pages") List<Integer> pages,
            @RequestParam("degrees") int degrees) {
        try {
            byte[] resultPdf = pdfRotationService.rotatePages(file.getBytes(), pages, degrees);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "rotated_" + file.getOriginalFilename());

            return new ResponseEntity<>(resultPdf, headers, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage().getBytes());
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
