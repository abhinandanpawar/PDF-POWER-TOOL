package com.example.pdfprocessor.controller;

import com.example.cadconvert.CadConvertService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/cad-convert")
public class CadConvertController {

    private static final Logger logger = LoggerFactory.getLogger(CadConvertController.class);
    private final CadConvertService cadConvertService;

    public CadConvertController(CadConvertService cadConvertService) {
        this.cadConvertService = cadConvertService;
    }

    @PostMapping
    public ResponseEntity<byte[]> convertCadToPdf(@RequestParam("file") MultipartFile file) {
        try {
            byte[] pdfBytes = cadConvertService.convertCadToPdf(file);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "converted.pdf");
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Failed to convert CAD file to PDF", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
