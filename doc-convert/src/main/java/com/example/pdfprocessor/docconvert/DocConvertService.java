package com.example.pdfprocessor.docconvert;

import org.docx4j.Docx4J;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.StringWriter;

@Service
public class DocConvertService {

    /**
     * Converts a DOC or DOCX input stream to a PDF byte array.
     *
     * @param inputStream The input stream of the DOC or DOCX file.
     * @return A byte array representing the converted PDF file.
     * @throws Exception if the conversion fails.
     */
    public byte[] convertDocToPdf(InputStream inputStream) throws Exception {
        // Load the Word document from the input stream.
        // Docx4j can handle both .doc and .docx formats.
        WordprocessingMLPackage wordMLPackage = WordprocessingMLPackage.load(inputStream);

        // Create an output stream to hold the PDF data.
        ByteArrayOutputStream pdfOutputStream = new ByteArrayOutputStream();

        // Perform the conversion to PDF.
        Docx4J.toPDF(wordMLPackage, pdfOutputStream);

        // Return the PDF data as a byte array.
        return pdfOutputStream.toByteArray();
    }

    /**
     * Extracts text from a DOC or DOCX input stream.
     *
     * @param inputStream The input stream of the DOC or DOCX file.
     * @return A string containing the extracted text.
     * @throws Exception if the text extraction fails.
     */
    public String convertDocToTxt(InputStream inputStream) throws Exception {
        WordprocessingMLPackage wordMLPackage = WordprocessingMLPackage.load(inputStream);
        StringWriter sw = new StringWriter();
        org.docx4j.TextUtils.extractText(wordMLPackage.getMainDocumentPart(), sw);
        return sw.toString();
    }
}
