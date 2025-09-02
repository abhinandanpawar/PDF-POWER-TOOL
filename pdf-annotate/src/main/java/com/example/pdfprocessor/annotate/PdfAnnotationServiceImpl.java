package com.example.pdfprocessor.annotate;

import com.example.pdfprocessor.api.PdfAnnotationService;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.graphics.state.PDExtendedGraphicsState;
import org.apache.pdfbox.util.Matrix;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class PdfAnnotationServiceImpl implements PdfAnnotationService {

    @Override
    public byte[] addWatermarks(List<InputStream> files, String watermarkText) throws IOException {
        ByteArrayOutputStream zipStream = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(zipStream)) {
            int fileNumber = 1;
            for (InputStream file : files) {
                byte[] watermarkedPdf = addWatermarkToSinglePdf(file.readAllBytes(), watermarkText);
                ZipEntry zipEntry = new ZipEntry("watermarked_" + fileNumber++ + ".pdf");
                zos.putNextEntry(zipEntry);
                zos.write(watermarkedPdf);
                zos.closeEntry();
            }
        }
        return zipStream.toByteArray();
    }

    private byte[] addWatermarkToSinglePdf(byte[] pdfBytes, String watermarkText) throws IOException {
        try (PDDocument document = Loader.loadPDF(pdfBytes)) {
            for (PDPage page : document.getPages()) {
                try (PDPageContentStream cs = new PDPageContentStream(document, page, PDPageContentStream.AppendMode.APPEND, true, true)) {

                    float pageWidth = page.getMediaBox().getWidth();
                    float pageHeight = page.getMediaBox().getHeight();
                    float centerX = pageWidth / 2;
                    float centerY = pageHeight / 2;

                    PDType1Font font = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
                    float fontSize = 60;
                    float textWidth = font.getStringWidth(watermarkText) / 1000 * fontSize;

                    cs.saveGraphicsState();

                    // Set transparency and color
                    PDExtendedGraphicsState gs = new PDExtendedGraphicsState();
                    gs.setNonStrokingAlphaConstant(0.2f); // 20% opacity
                    cs.setGraphicsStateParameters(gs);
                    cs.setNonStrokingColor(Color.GRAY);

                    // Rotate the coordinate system
                    cs.transform(Matrix.getRotateInstance(Math.toRadians(45), centerX, centerY));

                    // Draw the text
                    cs.beginText();
                    cs.setFont(font, fontSize);
                    // Position the text in the new, rotated coordinate system
                    cs.newLineAtOffset(centerX - (textWidth / 2), centerY);
                    cs.showText(watermarkText);
                    cs.endText();

                    cs.restoreGraphicsState();
                }
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.save(baos);
            return baos.toByteArray();
        }
    }
}
