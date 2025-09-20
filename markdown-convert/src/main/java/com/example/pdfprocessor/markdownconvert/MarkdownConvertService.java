package com.example.pdfprocessor.markdownconvert;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import com.vladsch.flexmark.html.HtmlRenderer;
import com.vladsch.flexmark.parser.Parser;
import com.vladsch.flexmark.util.ast.Node;
import com.vladsch.flexmark.util.data.MutableDataSet;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Service
public class MarkdownConvertService {

    private final Parser parser;
    private final HtmlRenderer renderer;

    public MarkdownConvertService() {
        MutableDataSet options = new MutableDataSet();
        this.parser = Parser.builder(options).build();
        this.renderer = HtmlRenderer.builder(options).build();
    }

    /**
     * Converts a Markdown string to an HTML string.
     *
     * @param markdownText The Markdown content as a string.
     * @return The converted HTML content.
     */
    public String convertMdToHtml(String markdownText) {
        Node document = parser.parse(markdownText);
        return renderer.render(document);
    }

    /**
     * Converts a Markdown string to a PDF byte array.
     *
     * @param markdownText The Markdown content as a string.
     * @return A byte array representing the converted PDF file.
     * @throws IOException if the conversion fails.
     */
    public byte[] convertMdToPdf(String markdownText) throws IOException {
        String htmlContent = convertMdToHtml(markdownText);

        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();
            // Note: A base URI is needed to resolve relative paths for images, CSS, etc.
            // For simple conversions without external resources, a dummy base is fine.
            builder.withHtmlContent(htmlContent, "/");
            builder.toStream(outputStream);
            builder.run();
            return outputStream.toByteArray();
        }
    }

    /**
     * Helper to read an InputStream from a MultipartFile into a String.
     */
    public String readStringFromInputStream(java.io.InputStream inputStream) throws IOException {
        try (java.util.Scanner scanner = new java.util.Scanner(inputStream, StandardCharsets.UTF_8.name()).useDelimiter("\\A")) {
            return scanner.hasNext() ? scanner.next() : "";
        }
    }
}
