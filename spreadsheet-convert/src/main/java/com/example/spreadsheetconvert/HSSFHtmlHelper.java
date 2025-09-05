package com.example.spreadsheetconvert;

import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFPalette;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.CellStyle;

import java.util.Formatter;

public class HSSFHtmlHelper implements HtmlHelper {
    private final HSSFWorkbook wb;
    private final HSSFPalette colors;

    private static final HSSFColor HSSF_AUTO = HSSFColor.HSSFColorPredefined.AUTOMATIC.getColor();

    public HSSFHtmlHelper(HSSFWorkbook wb) {
        this.wb = wb;
        colors = wb.getCustomPalette();
    }

    public void colorStyles(CellStyle style, Formatter out) {
        HSSFCellStyle cs = (HSSFCellStyle) style;
        out.format("  /* fill pattern = %s */%n", cs.getFillPattern());
        styleColor(out, "background-color", cs.getFillForegroundColor());
        styleColor(out, "color", cs.getFont(wb).getColor());
        styleColor(out, "border-left-color", cs.getLeftBorderColor());
        styleColor(out, "border-right-color", cs.getRightBorderColor());
        styleColor(out, "border-top-color", cs.getTopBorderColor());
        styleColor(out, "border-bottom-color", cs.getBottomBorderColor());
    }

    private void styleColor(Formatter out, String attr, short index) {
        HSSFColor color = colors.getColor(index);
        if (index == HSSF_AUTO.getIndex() || color == null) {
            return;
        }
        short[] rgb = color.getTriplet();
        out.format("  %s: #%02x%02x%02x; /* index = %d */%n", attr, rgb[0],
                rgb[1], rgb[2], index);
    }
}
