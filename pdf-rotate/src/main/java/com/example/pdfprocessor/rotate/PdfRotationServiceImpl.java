package com.example.pdfprocessor.rotate;

import com.example.pdfprocessor.api.PdfRotationService;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class PdfRotationServiceImpl implements PdfRotationService {

    @Override
    public byte[] rotatePages(List<InputStream> files, List<Integer> pagesToRotate, int rotationDegrees) throws IOException {
        ByteArrayOutputStream zipStream = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(zipStream)) {
            int fileNumber = 1;
            for (InputStream file : files) {
                byte[] rotatedPdf = rotatePagesInSinglePdf(file.readAllBytes(), pagesToRotate, rotationDegrees);
                ZipEntry zipEntry = new ZipEntry("rotated_" + fileNumber++ + ".pdf");
                zos.putNextEntry(zipEntry);
                zos.write(rotatedPdf);
                zos.closeEntry();
            }
        }
        return zipStream.toByteArray();
    }

    private byte[] rotatePagesInSinglePdf(byte[] pdfBytes, List<Integer> pagesToRotate, int rotationDegrees) throws IOException {
        if (rotationDegrees % 90 != 0) {
            throw new IllegalArgumentException("Rotation must be a multiple of 90.");
        }

        try (PDDocument document = Loader.loadPDF(pdfBytes)) {
            for (Integer pageNumber : pagesToRotate) {
                // Convert from 1-based to 0-based index
                int pageIndex = pageNumber - 1;
                if (pageIndex >= 0 && pageIndex < document.getNumberOfPages()) {
                    PDPage page = document.getPage(pageIndex);
                    page.setRotation(page.getRotation() + rotationDegrees);
                }
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.save(baos);
            return baos.toByteArray();
        }
    }
}
