package com.example.spreadsheetconvert;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.Test;

import java.io.StringWriter;

import static org.junit.jupiter.api.Assertions.assertTrue;

class HtmlConverterTest {

    @Test
    void testConvertXlsxToHtml() throws Exception {
        try (Workbook wb = new XSSFWorkbook()) {
            Sheet sheet = wb.createSheet("Test Sheet");
            Row row = sheet.createRow(0);
            Cell cell = row.createCell(0);
            cell.setCellValue("Hello");

            CellStyle style = wb.createCellStyle();
            style.setFillForegroundColor(IndexedColors.AQUA.getIndex());
            style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            cell.setCellStyle(style);

            StringWriter sw = new StringWriter();
            HtmlConverter converter = HtmlConverter.create(wb, sw);
            converter.setCompleteHTML(true);
            converter.printPage();

            String html = sw.toString();
            assertTrue(html.contains("Hello"));
            assertTrue(html.contains("background-color: #33cccc;"));
        }
    }
}
