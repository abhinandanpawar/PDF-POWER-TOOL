package com.example.pdfprocessor.convert;

import com.example.pdfprocessor.api.PdfConversionService;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class PdfConversionServiceImpl implements PdfConversionService {

    @Override
    public byte[] convertPdfsToWord(List<InputStream> pdfStreams) throws IOException {
        ByteArrayOutputStream zipStream = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(zipStream)) {
            int fileNumber = 1;
            for (InputStream pdfStream : pdfStreams) {
                byte[] wordBytes = convertSinglePdfToWord(pdfStream);
                ZipEntry zipEntry = new ZipEntry("converted_" + fileNumber++ + ".docx");
                zos.putNextEntry(zipEntry);
                zos.write(wordBytes);
                zos.closeEntry();
            }
        }
        return zipStream.toByteArray();
    }

    private byte[] convertSinglePdfToWord(InputStream pdfStream) throws IOException {
        try (PDDocument document = Loader.loadPDF(pdfStream.readAllBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);

            try (XWPFDocument docx = new XWPFDocument();
                 ByteArrayOutputStream out = new ByteArrayOutputStream()) {

                String[] lines = text.split("\\r?\\n");
                for (String line : lines) {
                    XWPFParagraph paragraph = docx.createParagraph();
                    XWPFRun run = paragraph.createRun();
                    run.setText(line);
                }

                docx.write(out);
                return out.toByteArray();
            }
        }
    }
}
