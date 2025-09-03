package com.ilovepdf.pdf_metadata;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/metadata")
public class MetadataController {

    @Autowired
    private MetadataService metadataService;

    @PostMapping("/get")
    public ResponseEntity<Map<String, Object>> getMetadata(@RequestParam("file") MultipartFile file) {
        try {
            Map<String, Object> metadata = metadataService.getMetadata(file.getBytes());
            return ResponseEntity.ok(metadata);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/set")
    public ResponseEntity<byte[]> setMetadata(@RequestParam("file") MultipartFile file,
                                              @RequestParam Map<String, String> metadata) {
        try {
            byte[] updatedPdf = metadataService.setMetadata(file.getBytes(), metadata);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "updated_" + file.getOriginalFilename());

            return new ResponseEntity<>(updatedPdf, headers, HttpStatus.OK);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
