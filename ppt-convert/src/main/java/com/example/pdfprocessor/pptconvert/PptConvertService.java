package com.example.pdfprocessor.pptconvert;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.apache.poi.sl.usermodel.Slide;
import org.apache.poi.sl.usermodel.SlideShow;
import org.apache.poi.sl.usermodel.SlideShowFactory;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.Dimension;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class PptConvertService {

    /**
     * Converts a PPT or PPTX file into a single PDF document.
     */
    public byte[] convertPptToPdf(InputStream inputStream) throws IOException {
        try (SlideShow<?, ?> slideShow = SlideShowFactory.create(inputStream);
             PDDocument document = new PDDocument()) {

            Dimension pageSize = slideShow.getPageSize();

            for (Slide<?, ?> slide : slideShow.getSlides()) {
                BufferedImage image = renderSlideToImage(slide, pageSize);
                PDPage page = new PDPage(new PDRectangle(pageSize.width, pageSize.height));
                document.addPage(page);

                PDImageXObject pdImage = PDImageXObject.createFromByteArray(document, toByteArray(image, "png"), "slide");

                try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                    contentStream.drawImage(pdImage, 0, 0, pageSize.width, pageSize.height);
                }
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            document.save(outputStream);
            return outputStream.toByteArray();
        }
    }

    /**
     * Converts a PPT or PPTX file into a ZIP archive of PNG images.
     */
    public byte[] convertPptToImages(InputStream inputStream) throws IOException {
        try (SlideShow<?, ?> slideShow = SlideShowFactory.create(inputStream)) {
            Dimension pageSize = slideShow.getPageSize();
            ByteArrayOutputStream zipOutputStream = new ByteArrayOutputStream();

            try (ZipOutputStream zos = new ZipOutputStream(zipOutputStream)) {
                int slideNumber = 1;
                for (Slide<?, ?> slide : slideShow.getSlides()) {
                    BufferedImage image = renderSlideToImage(slide, pageSize);
                    byte[] imageBytes = toByteArray(image, "png");

                    ZipEntry entry = new ZipEntry("slide_" + slideNumber + ".png");
                    zos.putNextEntry(entry);
                    zos.write(imageBytes);
                    zos.closeEntry();
                    slideNumber++;
                }
            }
            return zipOutputStream.toByteArray();
        }
    }

    private BufferedImage renderSlideToImage(Slide<?, ?> slide, Dimension pageSize) {
        BufferedImage image = new BufferedImage(pageSize.width, pageSize.height, BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics = image.createGraphics();
        // Use a white background for the slide
        graphics.setColor(java.awt.Color.WHITE);
        graphics.fillRect(0, 0, pageSize.width, pageSize.height);

        // Draw the slide content
        slide.draw(graphics);
        graphics.dispose();
        return image;
    }

    private byte[] toByteArray(BufferedImage image, String format) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(image, format, baos);
        return baos.toByteArray();
    }
}
