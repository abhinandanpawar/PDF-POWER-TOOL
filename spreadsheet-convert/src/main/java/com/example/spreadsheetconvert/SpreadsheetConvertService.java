package com.example.spreadsheetconvert;

import com.opencsv.CSVReader;
import com.opencsv.CSVWriter;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import com.example.spreadsheetconvert.util.ToHtml;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

@Service
public class SpreadsheetConvertService {

    // --- XLS/XLSX to HTML/PDF ---

    public String convertXlsToHtml(InputStream inputStream, String originalFilename) throws Exception {
        StringWriter stringWriter = new StringWriter();
        ToHtml toHtml = ToHtml.create(inputStream, stringWriter);
        toHtml.setCompleteHTML(true);
        toHtml.printPage();
        return stringWriter.toString();
    }

    public byte[] convertXlsToPdf(InputStream inputStream, String originalFilename) throws Exception {
        String htmlContent = convertXlsToHtml(inputStream, originalFilename);
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();
            builder.withHtmlContent(htmlContent, "/");
            builder.toStream(outputStream);
            builder.run();
            return outputStream.toByteArray();
        }
    }

    // --- CSV <=> XLSX Interchange ---

    public byte[] convertCsvToXlsx(InputStream inputStream) throws IOException {
        try (CSVReader reader = new CSVReader(new InputStreamReader(inputStream));
             Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Sheet 1");
            String[] line;
            int rowNum = 0;
            while ((line = reader.readNext()) != null) {
                Row row = sheet.createRow(rowNum++);
                for (int i = 0; i < line.length; i++) {
                    row.createCell(i).setCellValue(line[i]);
                }
            }
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            workbook.write(baos);
            return baos.toByteArray();
        } catch (Exception e) {
            throw new IOException("Failed to convert CSV to XLSX", e);
        }
    }

    public String convertXlsxToCsv(InputStream inputStream) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(inputStream)) {
            Sheet sheet = workbook.getSheetAt(0);
            StringWriter stringWriter = new StringWriter();
            try (CSVWriter writer = new CSVWriter(stringWriter)) {
                for (Row row : sheet) {
                    List<String> rowData = new ArrayList<>();
                    for (Cell cell : row) {
                        rowData.add(new DataFormatter().formatCellValue(cell));
                    }
                    writer.writeNext(rowData.toArray(new String[0]));
                }
            }
            return stringWriter.toString();
        }
    }
}
