package com.example.pdfprocessor.spreadsheetconvert;

import com.opencsv.CSVReader;
import com.opencsv.CSVWriter;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;

import org.apache.poi.hssf.converter.ExcelToHtmlConverter;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

@Service
public class SpreadsheetConvertService {

    // --- XLS/XLSX to HTML/PDF ---

    public String convertXlsToHtml(InputStream inputStream, String originalFilename) throws Exception {
        Workbook workbook = WorkbookFactory.create(inputStream);
        if (workbook instanceof HSSFWorkbook) {
            // Logic for .xls files
            ExcelToHtmlConverter converter = new ExcelToHtmlConverter(DocumentBuilderFactory.newInstance().newDocumentBuilder().newDocument());
            converter.setOutputColumnHeaders(false);
            converter.setOutputRowNumbers(false);
            converter.processWorkbook((HSSFWorkbook) workbook);
            Document htmlDocument = converter.getDocument();

            StringWriter stringWriter = new StringWriter();
            Transformer transformer = TransformerFactory.newInstance().newTransformer();
            transformer.transform(new DOMSource(htmlDocument), new StreamResult(stringWriter));
            return stringWriter.toString();
        } else if (workbook instanceof XSSFWorkbook) {
            // Simplified logic for .xlsx files (a full converter is more complex)
            // This will create a basic HTML table.
            StringBuilder html = new StringBuilder("<html><body><table border='1'>");
            Sheet sheet = workbook.getSheetAt(0);
            for (Row row : sheet) {
                html.append("<tr>");
                for (Cell cell : row) {
                    html.append("<td>").append(new DataFormatter().formatCellValue(cell)).append("</td>");
                }
                html.append("</tr>");
            }
            html.append("</table></body></html>");
            return html.toString();
        }
        throw new IllegalArgumentException("Unsupported Excel format.");
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
