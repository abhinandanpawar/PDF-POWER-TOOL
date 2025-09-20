package com.example.pdfprocessor.multimediaconvert;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class MultimediaConvertServiceTest {

    @TempDir
    Path tempDir;

    @Test
    void testConvertAudioCommand() throws IOException, InterruptedException {
        // Arrange
        final List<String> capturedCommand = new ArrayList<>();
        final Process mockProcess = mock(Process.class);

        when(mockProcess.exitValue()).thenReturn(0);
        when(mockProcess.waitFor(1, java.util.concurrent.TimeUnit.MINUTES)).thenReturn(true);
        when(mockProcess.getInputStream()).thenReturn(new ByteArrayInputStream(new byte[0]));

        MultimediaConvertService service = new MultimediaConvertService() {
            @Override
            protected Process buildAndStartProcess(List<String> command, File directory) throws IOException {
                capturedCommand.addAll(command);
                // The last argument is the output file path. Create it so readAllBytes doesn't fail.
                String outputFilePath = command.get(command.size() - 1);
                File outputFile = new File(outputFilePath);
                outputFile.createNewFile();
                return mockProcess;
            }
        };

        InputStream inputStream = new ByteArrayInputStream("dummy audio data".getBytes());
        String outputFormat = "mp3";
        Integer audioBitrate = 256;

        // Act
        byte[] result = service.convertAudio(inputStream, outputFormat, audioBitrate);

        // Assert
        assertTrue(capturedCommand.stream().anyMatch(s -> s.equals("-b:a")), "Command should contain audio bitrate flag");
        int bitrateFlagIndex = capturedCommand.indexOf("-b:a");
        assertTrue(bitrateFlagIndex != -1 && capturedCommand.size() > bitrateFlagIndex + 1, "Bitrate flag should have a value");
        assertEquals(audioBitrate + "k", capturedCommand.get(bitrateFlagIndex + 1), "Command should contain correct bitrate value");
        assertEquals(0, result.length, "Result should be an empty byte array as the dummy file is empty");
    }
}
