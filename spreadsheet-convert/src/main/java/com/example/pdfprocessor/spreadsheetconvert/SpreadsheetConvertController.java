package com.example.pdfprocessor.spreadsheetconvert;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/spreadsheet-convert")
public class SpreadsheetConvertController {

    private final SpreadsheetConvertService spreadsheetConvertService;

    public SpreadsheetConvertController(SpreadsheetConvertService spreadsheetConvertService) {
        this.spreadsheetConvertService = spreadsheetConvertService;
    }

    @PostMapping("/xls-to-html")
    public ResponseEntity<String> convertXlsToHtml(@RequestParam("file") MultipartFile file) {
        try {
            String html = spreadsheetConvertService.convertXlsToHtml(file.getInputStream(), file.getOriginalFilename());
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.TEXT_HTML);
            return new ResponseEntity<>(html, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/xls-to-pdf")
    public ResponseEntity<byte[]> convertXlsToPdf(@RequestParam("file") MultipartFile file) {
        try {
            byte[] pdfBytes = spreadsheetConvertService.convertXlsToPdf(file.getInputStream(), file.getOriginalFilename());
            return createResponse(pdfBytes, "pdf", file.getOriginalFilename());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/csv-to-xlsx")
    public ResponseEntity<byte[]> convertCsvToXlsx(@RequestParam("file") MultipartFile file) {
        try {
            byte[] xlsxBytes = spreadsheetConvertService.convertCsvToXlsx(file.getInputStream());
            return createResponse(xlsxBytes, "xlsx", file.getOriginalFilename());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/xlsx-to-csv")
    public ResponseEntity<String> convertXlsxToCsv(@RequestParam("file") MultipartFile file) {
        try {
            String csv = spreadsheetConvertService.convertXlsxToCsv(file.getInputStream());
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.TEXT_PLAIN);
            String outputFilename = "converted.csv";
             String originalFilename = file.getOriginalFilename();
            if (originalFilename != null) {
                int dotIndex = originalFilename.lastIndexOf('.');
                if (dotIndex > 0) {
                    outputFilename = originalFilename.substring(0, dotIndex) + ".csv";
                }
            }
            headers.setContentDispositionFormData("attachment", outputFilename);
            return new ResponseEntity<>(csv, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private ResponseEntity<byte[]> createResponse(byte[] data, String format, String originalFilename) {
        HttpHeaders headers = new HttpHeaders();
        if ("pdf".equals(format)) {
            headers.setContentType(MediaType.APPLICATION_PDF);
        } else if ("xlsx".equals(format)) {
            headers.setContentType(new MediaType("application", "vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
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
