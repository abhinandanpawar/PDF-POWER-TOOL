package com.example.imageconvert;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/image-convert")
public class ImageConvertController {

    private final ImageConvertService imageConvertService;

    public ImageConvertController(ImageConvertService imageConvertService) {
        this.imageConvertService = imageConvertService;
    }

    @PostMapping("/convert")
    public ResponseEntity<byte[]> convertImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("format") String format) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            byte[] imageBytes = imageConvertService.convertImage(file.getInputStream(), format);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("image/" + format.toLowerCase()));

            String originalFilename = file.getOriginalFilename();
            String outputFilename = "converted." + format.toLowerCase();
            if (originalFilename != null) {
                int dotIndex = originalFilename.lastIndexOf('.');
                if (dotIndex > 0) {
                    outputFilename = originalFilename.substring(0, dotIndex) + "." + format.toLowerCase();
                }
            }
            headers.setContentDispositionFormData("attachment", outputFilename);

            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage().getBytes());
        }
    }
}
