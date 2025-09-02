package com.example.pdfprocessor.compress;

import com.example.pdfprocessor.api.PdfCompressService;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.cos.COSName;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDResources;
import org.apache.pdfbox.pdmodel.graphics.PDXObject;
import org.apache.pdfbox.pdmodel.graphics.image.JPEGFactory;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.stereotype.Service;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class PdfCompressServiceImpl implements PdfCompressService {

    @Override
    public byte[] compressPdfs(List<InputStream> files) throws IOException {
        ByteArrayOutputStream zipStream = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(zipStream)) {
            int fileNumber = 1;
            for (InputStream file : files) {
                byte[] compressedPdf = compressSinglePdf(file);
                ZipEntry zipEntry = new ZipEntry("compressed_" + fileNumber++ + ".pdf");
                zos.putNextEntry(zipEntry);
                zos.write(compressedPdf);
                zos.closeEntry();
            }
        }
        return zipStream.toByteArray();
    }

    private byte[] compressSinglePdf(InputStream file) throws IOException {
        try (PDDocument document = Loader.loadPDF(file.readAllBytes())) {
            for (PDPage page : document.getPages()) {
                PDResources resources = page.getResources();
                for (COSName cosName : resources.getXObjectNames()) {
                    PDXObject xobject = resources.getXObject(cosName);
                    if (xobject instanceof PDImageXObject) {
                        PDImageXObject oldImage = (PDImageXObject) xobject;
                        BufferedImage bufferedImage = oldImage.getImage();

                        ByteArrayOutputStream compressedImageStream = new ByteArrayOutputStream();

                        ImageWriter writer = ImageIO.getImageWritersByFormatName("jpeg").next();
                        ImageOutputStream ios = ImageIO.createImageOutputStream(compressedImageStream);
                        writer.setOutput(ios);

                        ImageWriteParam param = writer.getDefaultWriteParam();
                        if (param.canWriteCompressed()) {
                            param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
                            param.setCompressionQuality(0.75f);
                        }

                        writer.write(null, new IIOImage(bufferedImage, null, null), param);
                        ios.close();
                        writer.dispose();

                        PDImageXObject newImage = JPEGFactory.createFromByteArray(document, compressedImageStream.toByteArray());
                        resources.put(cosName, newImage);
                    }
                }
            }

            ByteArrayOutputStream finalStream = new ByteArrayOutputStream();
            document.save(finalStream);
            return finalStream.toByteArray();
        }
    }
}
