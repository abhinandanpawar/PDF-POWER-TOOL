package com.example.pdfprocessor.controller;

import com.example.pdfprocessor.api.PdfConversionService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

import com.example.pdfprocessor.api.PdfToImageService;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/v1/convert")
public class ConversionController {

    private final PdfConversionService pdfConversionService;
    private final PdfToImageService pdfToImageService;

    public ConversionController(PdfConversionService pdfConversionService, PdfToImageService pdfToImageService) {
        this.pdfConversionService = pdfConversionService;
        this.pdfToImageService = pdfToImageService;
    }

    @PostMapping("/pdf-to-word")
    public ResponseEntity<byte[]> convertPdfsToWord(@RequestParam("files") List<MultipartFile> files) {
        if (files.isEmpty() || files.stream().anyMatch(MultipartFile::isEmpty)) {
            return ResponseEntity.badRequest().build();
        }

        try {
            List<InputStream> fileStreams = files.stream().map(file -> {
                try {
                    return file.getInputStream();
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }).collect(Collectors.toList());
            byte[] docxBytes = pdfConversionService.convertPdfsToWord(fileStreams);

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=converted.zip");
            headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_OCTET_STREAM_VALUE);

            return new ResponseEntity<>(docxBytes, headers, HttpStatus.OK);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/pdf-to-images")
    public ResponseEntity<byte[]> convertPdfsToImages(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam(value = "format", defaultValue = "png") String format,
            @RequestParam(value = "dpi", defaultValue = "300") int dpi) {
        if (files.isEmpty() || files.stream().anyMatch(MultipartFile::isEmpty)) {
            return ResponseEntity.badRequest().build();
        }
        try {
            List<InputStream> fileStreams = files.stream().map(file -> {
                try {
                    return file.getInputStream();
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }).collect(Collectors.toList());
            byte[] zipBytes = pdfToImageService.convertPdfsToImages(fileStreams, format, dpi);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"images.zip\"");

            return new ResponseEntity<>(zipBytes, headers, HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
