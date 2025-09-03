package com.example.markdownconvert;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/markdown-convert")
public class MarkdownConvertController {

    private final MarkdownConvertService markdownConvertService;

    public MarkdownConvertController(MarkdownConvertService markdownConvertService) {
        this.markdownConvertService = markdownConvertService;
    }

    @PostMapping("/to-html")
    public ResponseEntity<String> convertMdToHtml(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            String markdownText = markdownConvertService.readStringFromInputStream(file.getInputStream());
            String htmlContent = markdownConvertService.convertMdToHtml(markdownText);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.TEXT_HTML);

            return new ResponseEntity<>(htmlContent, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/to-pdf")
    public ResponseEntity<byte[]> convertMdToPdf(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            String markdownText = markdownConvertService.readStringFromInputStream(file.getInputStream());
            byte[] pdfBytes = markdownConvertService.convertMdToPdf(markdownText);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            String outputFilename = "converted.pdf";
            String originalFilename = file.getOriginalFilename();
            if (originalFilename != null) {
                int dotIndex = originalFilename.lastIndexOf('.');
                if (dotIndex > 0) {
                    outputFilename = originalFilename.substring(0, dotIndex) + ".pdf";
                }
            }
            headers.setContentDispositionFormData("attachment", outputFilename);

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
