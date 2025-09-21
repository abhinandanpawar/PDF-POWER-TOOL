package com.example.pdfprocessor.markdownconvert;

import com.example.pdfprocessor.services.api.service.FileValidationService;
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
    private final FileValidationService fileValidationService;

    public MarkdownConvertController(MarkdownConvertService markdownConvertService, FileValidationService fileValidationService) {
        this.markdownConvertService = markdownConvertService;
        this.fileValidationService = fileValidationService;
    }

    @PostMapping("/to-html")
    public ResponseEntity<String> convertMdToHtml(@RequestParam("file") MultipartFile file) {
        try {
            fileValidationService.validateFile(file);
            String markdownText = markdownConvertService.readStringFromInputStream(file.getInputStream());
            String htmlContent = markdownConvertService.convertMdToHtml(markdownText);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.TEXT_HTML);

            return new ResponseEntity<>(htmlContent, headers, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/to-pdf")
    public ResponseEntity<byte[]> convertMdToPdf(@RequestParam("file") MultipartFile file) {
        try {
            fileValidationService.validateFile(file);
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
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage().getBytes());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
