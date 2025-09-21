package com.example.pdfprocessor.services.api.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class FileValidationService {

    @Value("${file.upload.max-size}")
    private long maxFileSize;

    @Value("${file.upload.allowed-types}")
    private List<String> allowedFileTypes;

    public void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("File size exceeds the maximum allowed size of " + maxFileSize + " bytes");
        }

        if (!allowedFileTypes.contains(file.getContentType())) {
            throw new IllegalArgumentException("File type not allowed: " + file.getContentType());
        }
    }
}
