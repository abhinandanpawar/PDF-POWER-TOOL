package com.example.pdfprocessor.docconvert;

import com.example.pdfprocessor.services.api.service.FileValidationService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/doc-convert")
public class DocConvertController {

    private final DocConvertService docConvertService;
    private final FileValidationService fileValidationService;

    public DocConvertController(DocConvertService docConvertService, FileValidationService fileValidationService) {
        this.docConvertService = docConvertService;
        this.fileValidationService = fileValidationService;
    }

    @PostMapping("/to-pdf")
    public ResponseEntity<byte[]> convertDocToPdf(@RequestParam("file") MultipartFile file) {
        try {
            fileValidationService.validateFile(file);
            byte[] pdfBytes = docConvertService.convertDocToPdf(file.getInputStream());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            String originalFilename = file.getOriginalFilename();
            String outputFilename = "converted.pdf";
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
            // Log the exception properly in a real application
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/to-txt")
    public ResponseEntity<String> convertDocToTxt(@RequestParam("file") MultipartFile file) {
        try {
            fileValidationService.validateFile(file);
            String textContent = docConvertService.convertDocToTxt(file.getInputStream());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.TEXT_PLAIN);

            return new ResponseEntity<>(textContent, headers, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
