package com.example.pdfprocessor.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.cos.COSName;
import org.apache.pdfbox.io.RandomAccessReadBuffer;
import org.apache.pdfbox.multipdf.PDFMergerUtility;
import org.apache.pdfbox.multipdf.Splitter;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDResources;
import org.apache.pdfbox.pdmodel.graphics.PDXObject;
import org.apache.pdfbox.pdmodel.graphics.image.JPEGFactory;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class PdfService {

    public byte[] mergePdfs(MultipartFile file1, MultipartFile file2) throws IOException {
        if (file1.isEmpty() || file2.isEmpty()) {
            throw new IOException("One or both files are empty.");
        }

        PDFMergerUtility pdfMerger = new PDFMergerUtility();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        pdfMerger.setDestinationStream(outputStream);

        try (InputStream is1 = file1.getInputStream(); InputStream is2 = file2.getInputStream()) {
            pdfMerger.addSource(new RandomAccessReadBuffer(is1));
            pdfMerger.addSource(new RandomAccessReadBuffer(is2));
            pdfMerger.mergeDocuments(null);
        }

        return outputStream.toByteArray();
    }

    public byte[] splitPdf(MultipartFile file, String ranges) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("File is empty.");
        }

        if (ranges == null || ranges.trim().isEmpty()) {
            // Original logic: split all pages into a zip file
            return splitToZip(file);
        } else {
            // New logic: extract specific pages into a single PDF
            return extractPages(file, ranges);
        }
    }

    private byte[] splitToZip(MultipartFile file) throws IOException {
        PDDocument document = Loader.loadPDF(file.getBytes());
        Splitter splitter = new Splitter();
        List<PDDocument> splitPages = splitter.split(document);
        document.close();

        try (ByteArrayOutputStream zipStream = new ByteArrayOutputStream();
             ZipOutputStream zos = new ZipOutputStream(zipStream)) {
            int pageNum = 1;
            for (PDDocument pageDoc : splitPages) {
                try (ByteArrayOutputStream pageOut = new ByteArrayOutputStream()) {
                    pageDoc.save(pageOut);
                    ZipEntry zipEntry = new ZipEntry("page_" + pageNum++ + ".pdf");
                    zos.putNextEntry(zipEntry);
                    zos.write(pageOut.toByteArray());
                    zos.closeEntry();
                } finally {
                    pageDoc.close();
                }
            }
            zos.finish();
            return zipStream.toByteArray();
        }
    }

    private byte[] extractPages(MultipartFile file, String ranges) throws IOException {
        Set<Integer> pageNumbers = parseRanges(ranges);
        try (PDDocument document = Loader.loadPDF(file.getBytes());
             PDDocument newDocument = new PDDocument()) {
            for (int pageNum : pageNumbers) {
                if (pageNum > 0 && pageNum <= document.getNumberOfPages()) {
                    newDocument.addPage(document.getPage(pageNum - 1));
                }
            }
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            newDocument.save(outputStream);
            return outputStream.toByteArray();
        }
    }

    private Set<Integer> parseRanges(String ranges) {
        Set<Integer> pageNumbers = new HashSet<>();
        String[] parts = ranges.split(",");
        for (String part : parts) {
            part = part.trim();
            if (part.contains("-")) {
                String[] range = part.split("-");
                int start = Integer.parseInt(range[0]);
                int end = Integer.parseInt(range[1]);
                for (int i = start; i <= end; i++) {
                    pageNumbers.add(i);
                }
            } else {
                pageNumbers.add(Integer.parseInt(part));
            }
        }
        return pageNumbers;
    }

    public byte[] compressPdf(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("File is empty.");
        }

        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            for (PDPage page : document.getPages()) {
                PDResources resources = page.getResources();
                for (COSName cosName : resources.getXObjectNames()) {
                    PDXObject xobject = resources.getXObject(cosName);
                    if (xobject instanceof PDImageXObject) {
                        PDImageXObject oldImage = (PDImageXObject) xobject;
                        BufferedImage bufferedImage = oldImage.getImage();

                        // Create a new ByteArrayOutputStream for the compressed image
                        ByteArrayOutputStream compressedImageStream = new ByteArrayOutputStream();

                        ImageWriter writer = ImageIO.getImageWritersByFormatName("jpeg").next();
                        ImageOutputStream ios = ImageIO.createImageOutputStream(compressedImageStream);
                        writer.setOutput(ios);

                        ImageWriteParam param = writer.getDefaultWriteParam();
                        if (param.canWriteCompressed()) {
                            param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
                            param.setCompressionQuality(0.75f); // 75% quality
                        }

                        writer.write(null, new IIOImage(bufferedImage, null, null), param);
                        ios.close();
                        writer.dispose();

                        // Replace the old image with the new compressed one
                        PDImageXObject newImage = JPEGFactory.createFromByteArray(document, compressedImageStream.toByteArray());
                        resources.put(cosName, newImage);
                    }
                }
            }

            // Save the modified document
            ByteArrayOutputStream finalStream = new ByteArrayOutputStream();
            document.save(finalStream);
            return finalStream.toByteArray();
        }
    }
}
