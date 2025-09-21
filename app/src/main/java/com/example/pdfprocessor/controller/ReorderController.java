package com.example.pdfprocessor.controller;

import com.example.pdfprocessor.api.PdfReorderService;
import com.example.pdfprocessor.services.api.service.FileValidationService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/pdfs")
public class ReorderController {

    private final PdfReorderService pdfReorderService;
    private final FileValidationService fileValidationService;

    public ReorderController(PdfReorderService pdfReorderService, FileValidationService fileValidationService) {
        this.pdfReorderService = pdfReorderService;
        this.fileValidationService = fileValidationService;
    }

    @PostMapping("/reorder-pages")
    public ResponseEntity<byte[]> reorderPages(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("order") String orderStr) {
        try {
            for (MultipartFile file : files) {
                fileValidationService.validateFile(file);
            }
            List<Integer> order = parseOrderString(orderStr);
            List<InputStream> fileStreams = files.stream().map(file -> {
                try {
                    return file.getInputStream();
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }).collect(Collectors.toList());
            byte[] resultPdf = pdfReorderService.reorderPages(fileStreams, order);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "reordered.zip");

            return new ResponseEntity<>(resultPdf, headers, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage().getBytes());
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private List<Integer> parseOrderString(String orderStr) {
        List<Integer> order = new ArrayList<>();
        if (orderStr != null && !orderStr.isEmpty()) {
            String[] parts = orderStr.split(",");
            for (String part : parts) {
                part = part.trim();
                if (part.contains("-")) {
                    String[] range = part.split("-");
                    if (range.length == 2) {
                        try {
                            int start = Integer.parseInt(range[0]);
                            int end = Integer.parseInt(range[1]);
                            if (start <= end) {
                                for (int i = start; i <= end; i++) {
                                    order.add(i);
                                }
                            }
                        } catch (NumberFormatException e) {
                            // ignore invalid range
                        }
                    }
                } else {
                    try {
                        order.add(Integer.parseInt(part));
                    } catch (NumberFormatException e) {
                        // ignore invalid number
                    }
                }
            }
        }
        return order;
    }
}
