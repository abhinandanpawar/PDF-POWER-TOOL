package com.example.cadconvert;

import com.aspose.cad.Image;
import com.aspose.cad.imageoptions.CadRasterizationOptions;
import com.aspose.cad.imageoptions.PdfOptions;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;

@Service
public class CadConvertService {

    public byte[] convertCadToPdf(MultipartFile file) {
        try {
            // Load the CAD file
            Image image = Image.load(file.getInputStream());

            // Create PDF options
            PdfOptions pdfOptions = new PdfOptions();
            CadRasterizationOptions rasterizationOptions = new CadRasterizationOptions();
            rasterizationOptions.setPageWidth(1600);
            rasterizationOptions.setPageHeight(1600);
            pdfOptions.setVectorRasterizationOptions(rasterizationOptions);

            // Convert to PDF
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            image.save(outputStream, pdfOptions);

            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new CadConversionException("Failed to convert CAD file to PDF", e);
        }
    }
}
