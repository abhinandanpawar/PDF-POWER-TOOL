package com.example.pdfprocessor.controller;

import com.example.pdfprocessor.api.PdfReorderService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/pdfs")
public class ReorderController {

    private final PdfReorderService pdfReorderService;

    public ReorderController(PdfReorderService pdfReorderService) {
        this.pdfReorderService = pdfReorderService;
    }

    @PostMapping("/reorder-pages")
    public ResponseEntity<byte[]> reorderPages(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("order") List<Integer> order) {
        try {
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
}
