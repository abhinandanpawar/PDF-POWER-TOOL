package com.example.pptconvert;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/ppt-convert")
public class PptConvertController {

    private final PptConvertService pptConvertService;

    public PptConvertController(PptConvertService pptConvertService) {
        this.pptConvertService = pptConvertService;
    }

    @PostMapping("/to-pdf")
    public ResponseEntity<byte[]> convertPptToPdf(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            byte[] pdfBytes = pptConvertService.convertPptToPdf(file.getInputStream());
            return createResponse(pdfBytes, "pdf", file.getOriginalFilename());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/to-images")
    public ResponseEntity<byte[]> convertPptToImages(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            byte[] zipBytes = pptConvertService.convertPptToImages(file.getInputStream());
            return createResponse(zipBytes, "zip", file.getOriginalFilename());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private ResponseEntity<byte[]> createResponse(byte[] data, String format, String originalFilename) {
        HttpHeaders headers = new HttpHeaders();
        if ("pdf".equals(format)) {
            headers.setContentType(MediaType.APPLICATION_PDF);
        } else {
            headers.setContentType(new MediaType("application", "zip"));
        }

        String outputFilename = "converted." + format;
        if (originalFilename != null) {
            int dotIndex = originalFilename.lastIndexOf('.');
            if (dotIndex > 0) {
                outputFilename = originalFilename.substring(0, dotIndex) + "." + format;
            }
        }
        headers.setContentDispositionFormData("attachment", outputFilename);

        return new ResponseEntity<>(data, headers, HttpStatus.OK);
    }
}
