package com.example.pdfprocessor.toimage;

import com.example.pdfprocessor.api.PdfToImageService;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class PdfToImageServiceImpl implements PdfToImageService {

    @Override
    public byte[] convertPdfToImages(byte[] pdfBytes, String format, int dpi) throws IOException {
        ByteArrayOutputStream zipBaos = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(zipBaos);
             PDDocument document = Loader.loadPDF(pdfBytes)) {

            PDFRenderer pdfRenderer = new PDFRenderer(document);
            for (int page = 0; page < document.getNumberOfPages(); ++page) {
                BufferedImage bim = pdfRenderer.renderImageWithDPI(page, dpi);

                ByteArrayOutputStream imageBaos = new ByteArrayOutputStream();
                ImageIO.write(bim, format, imageBaos);

                ZipEntry zipEntry = new ZipEntry("page_" + (page + 1) + "." + format);
                zos.putNextEntry(zipEntry);
                zos.write(imageBaos.toByteArray());
                zos.closeEntry();
            }
        }
        return zipBaos.toByteArray();
    }
}
