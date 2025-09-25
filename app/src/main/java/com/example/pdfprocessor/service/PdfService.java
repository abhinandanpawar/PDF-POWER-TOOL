package com.example.pdfprocessor.service;

import com.example.pdfprocessor.services.api.service.FileValidationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PdfService {

    private static final Logger logger = LoggerFactory.getLogger(PdfService.class);

    private final FileValidationService fileValidationService;

    public PdfService(FileValidationService fileValidationService) {
        this.fileValidationService = fileValidationService;
    }

    public void validateFiles(List<MultipartFile> files) {
        logger.info("Validating {} files", files.size());
        for (MultipartFile file : files) {
            fileValidationService.validateFile(file);
        }
        logger.info("Files validated successfully");
    }

    public List<InputStream> getFileInputStreams(List<MultipartFile> files) {
        logger.info("Getting input streams for {} files", files.size());
        return files.stream().map(file -> {
            try {
                return file.getInputStream();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }).collect(Collectors.toList());
    }
}