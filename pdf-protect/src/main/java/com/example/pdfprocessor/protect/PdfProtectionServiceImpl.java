package com.example.pdfprocessor.protect;

import com.example.pdfprocessor.api.PdfProtectionService;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.encryption.AccessPermission;
import org.apache.pdfbox.pdmodel.encryption.StandardProtectionPolicy;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class PdfProtectionServiceImpl implements PdfProtectionService {

    @Override
    public byte[] protectPdfs(List<InputStream> files, String password) throws IOException {
        ByteArrayOutputStream zipStream = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(zipStream)) {
            int fileNumber = 1;
            for (InputStream file : files) {
                byte[] protectedPdf = protectSinglePdf(file.readAllBytes(), password);
                ZipEntry zipEntry = new ZipEntry("protected_" + fileNumber++ + ".pdf");
                zos.putNextEntry(zipEntry);
                zos.write(protectedPdf);
                zos.closeEntry();
            }
        }
        return zipStream.toByteArray();
    }

    private byte[] protectSinglePdf(byte[] pdfBytes, String password) throws IOException {
        try (PDDocument document = Loader.loadPDF(pdfBytes)) {
            AccessPermission ap = new AccessPermission();
            // Disallow all modifications
            ap.setCanAssembleDocument(false);
            ap.setCanExtractContent(false);
            ap.setCanExtractForAccessibility(false);
            ap.setCanFillInForm(false);
            ap.setCanModify(false);
            ap.setCanModifyAnnotations(false);
            ap.setCanPrint(false);

            // Encrypt the document with the given password
            StandardProtectionPolicy spp = new StandardProtectionPolicy(password, password, ap);
            spp.setEncryptionKeyLength(128); // 128-bit key
            document.protect(spp);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.save(baos);
            return baos.toByteArray();
        }
    }
}
