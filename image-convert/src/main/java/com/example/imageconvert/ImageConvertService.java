package com.example.imageconvert;

import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.IOException;

@Service
public class ImageConvertService {

    /**
     * Converts an image from an input stream to a specified output format.
     *
     * @param inputStream  The input stream of the image file.
     * @param outputFormat The desired output format (e.g., "png", "jpg", "webp").
     * @return A byte array representing the converted image.
     * @throws IOException if there is an error reading the input stream or writing the output.
     * @throws IllegalArgumentException if the output format is not supported.
     */
    public byte[] convertImage(InputStream inputStream, String outputFormat) throws IOException {
        // Read the source image. ImageIO will use the appropriate reader based on the file format.
        BufferedImage image = ImageIO.read(inputStream);
        if (image == null) {
            throw new IOException("Could not decode the input image. The format may be unsupported or the file corrupted.");
        }

        // JPEG does not support transparency. If we are converting from a format with an alpha
        // channel (like PNG) to JPG, we need to create a new image without alpha to avoid
        // potential artifacts (e.g., black background).
        if ("jpg".equalsIgnoreCase(outputFormat) || "jpeg".equalsIgnoreCase(outputFormat)) {
            if (image.getTransparency() == BufferedImage.TRANSLUCENT || image.getTransparency() == BufferedImage.BITMASK) {
                BufferedImage newImage = new BufferedImage(image.getWidth(), image.getHeight(), BufferedImage.TYPE_INT_RGB);
                newImage.createGraphics().drawImage(image, 0, 0, java.awt.Color.WHITE, null);
                image = newImage;
            }
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        // Write the image to the output stream in the target format.
        boolean writerFound = ImageIO.write(image, outputFormat, outputStream);
        if (!writerFound) {
            throw new IllegalArgumentException("No writer found for the specified output format: " + outputFormat);
        }

        return outputStream.toByteArray();
    }
}
