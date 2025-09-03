package com.example.pdfprocessor.api;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public interface PdfToImageService {
    /**
     * Converts each page of a PDF document into an image and returns them as a zip archive.
     *
     * @param files The content of the PDF file.
     * @param format The desired image format (e.g., "png", "jpg").
     * @param dpi The resolution of the output images in dots per inch.
     * @return A byte array representing a zip file containing the images.
     * @throws IOException If an I/O error occurs during processing.
     */
    byte[] convertPdfsToImages(List<InputStream> files, String format, int dpi) throws IOException;
}
