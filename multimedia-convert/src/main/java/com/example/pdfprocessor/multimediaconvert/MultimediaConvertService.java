package com.example.pdfprocessor.multimediaconvert;

import org.apache.commons.io.FileUtils;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class MultimediaConvertService {

    private static final String FFMPEG_PATH = "ffmpeg"; // Assuming ffmpeg is in the system's PATH

    public byte[] convertAudio(InputStream inputStream, String outputFormat, Integer audioBitrate) throws IOException, InterruptedException {
        List<String> command = new ArrayList<>();
        command.add("-i");
        command.add("input"); // Placeholder for input file
        command.add("-y"); // Overwrite output file if it exists
        if (audioBitrate != null) {
            command.add("-b:a");
            command.add(audioBitrate + "k");
        }
        command.add("output." + outputFormat); // Placeholder for output file

        return executeFfmpeg(inputStream, command, outputFormat);
    }

    public byte[] convertVideo(InputStream inputStream, String outputFormat) throws IOException, InterruptedException {
        List<String> command = new ArrayList<>();
        command.add("-i");
        command.add("input");
        command.add("-y");

        if ("gif".equals(outputFormat)) {
            // GIF conversion often requires a two-pass approach for good quality
            // This is a simplified one-pass version
            command.add("-vf");
            command.add("fps=10,scale=320:-1:flags=lanczos");
        }

        command.add("output." + outputFormat);

        return executeFfmpeg(inputStream, command, outputFormat);
    }

    protected byte[] executeFfmpeg(InputStream inputStream, List<String> command, String outputFormat) throws IOException, InterruptedException {
        Path tempDir = null;
        try {
            tempDir = Files.createTempDirectory("ffmpeg-work-" + UUID.randomUUID());
            File inputFile = tempDir.resolve("input").toFile();
            FileUtils.copyInputStreamToFile(inputStream, inputFile);

            command.set(command.indexOf("input"), inputFile.getAbsolutePath());
            command.set(command.indexOf("output." + outputFormat), tempDir.resolve("output." + outputFormat).toString());

            List<String> fullCommand = new ArrayList<>();
            fullCommand.add(FFMPEG_PATH);
            fullCommand.addAll(command);

            System.out.println("Executing FFmpeg command: " + String.join(" ", fullCommand));

            Process process = buildAndStartProcess(fullCommand, tempDir.toFile());

            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }

            boolean finished = process.waitFor(1, TimeUnit.MINUTES);
            if (!finished) {
                process.destroy();
                throw new IOException("FFmpeg process timed out.");
            }

            if (process.exitValue() != 0) {
                throw new IOException("FFmpeg process failed with exit code " + process.exitValue() + ". Output:\n" + output.toString());
            }

            return Files.readAllBytes(tempDir.resolve("output." + outputFormat));

        } finally {
            if (tempDir != null) {
                FileUtils.deleteDirectory(tempDir.toFile());
            }
        }
    }

    protected Process buildAndStartProcess(List<String> command, File directory) throws IOException {
        ProcessBuilder processBuilder = new ProcessBuilder(command);
        processBuilder.directory(directory);
        processBuilder.redirectErrorStream(true);
        return processBuilder.start();
    }
}
