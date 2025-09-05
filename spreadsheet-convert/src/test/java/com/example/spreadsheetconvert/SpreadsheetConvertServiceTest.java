package com.example.spreadsheetconvert;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(classes = {SpreadsheetConvertService.class, SpreadsheetConvertController.class})
class SpreadsheetConvertServiceTest {

    @Autowired
    private SpreadsheetConvertService spreadsheetConvertService;

    @Test
    void testConvertXlsxToHtml() throws Exception {
        // Create a new workbook
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Test Sheet");
            Row row = sheet.createRow(0);
            Cell cell = row.createCell(0);
            cell.setCellValue("Hello");
            Cell cell2 = row.createCell(1);
            cell2.setCellValue("World");

            // Write the workbook to a byte array
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            workbook.write(baos);
            InputStream is = new ByteArrayInputStream(baos.toByteArray());

            // Convert the workbook to HTML
            String html = spreadsheetConvertService.convertXlsToHtml(is, "test.xlsx");

            // Assert that the HTML is not null and contains the expected content
            assertNotNull(html);
            assertTrue(html.contains("Hello"));
            assertTrue(html.contains("World"));
            assertTrue(html.contains("<table"));
            assertTrue(html.contains("</html>"));
        }
    }
}
