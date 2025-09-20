package com.example.pdfprocessor.multimediaconvert;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/v1/multimedia-convert")
public class MultimediaConvertController {

    private final MultimediaConvertService multimediaConvertService;

    private static final List<String> ALLOWED_AUDIO_FORMATS = Arrays.asList("mp3", "wav", "flac", "ogg", "aac", "aiff", "m4a");
    private static final List<String> ALLOWED_VIDEO_FORMATS = Arrays.asList("mp4", "webm", "gif", "mov", "avi", "mkv");

    public MultimediaConvertController(MultimediaConvertService multimediaConvertService) {
        this.multimediaConvertService = multimediaConvertService;
    }

    @PostMapping("/audio")
    public ResponseEntity<byte[]> convertAudio(
            @RequestParam("file") MultipartFile file,
            @RequestParam("format") String format,
            @RequestParam(value = "audioBitrate", required = false) Integer audioBitrate) {

        if (!ALLOWED_AUDIO_FORMATS.contains(format.toLowerCase())) {
            return ResponseEntity.badRequest().build();
        }
        return processConversion(file, format, true, audioBitrate);
    }

    @PostMapping("/video")
    public ResponseEntity<byte[]> convertVideo(
            @RequestParam("file") MultipartFile file,
            @RequestParam("format") String format) {

        if (!ALLOWED_VIDEO_FORMATS.contains(format.toLowerCase())) {
            return ResponseEntity.badRequest().build();
        }
        return processConversion(file, format, false, null);
    }

    private ResponseEntity<byte[]> processConversion(MultipartFile file, String format, boolean isAudio, Integer audioBitrate) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        try {
            byte[] resultBytes = isAudio
                ? multimediaConvertService.convertAudio(file.getInputStream(), format, audioBitrate)
                : multimediaConvertService.convertVideo(file.getInputStream(), format);

            return createResponse(resultBytes, format, file.getOriginalFilename());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage().getBytes());
        }
    }

    private ResponseEntity<byte[]> createResponse(byte[] data, String format, String originalFilename) {
        HttpHeaders headers = new HttpHeaders();
        String mimeType = "application/octet-stream";
        if ("mp3".equalsIgnoreCase(format)) mimeType = "audio/mpeg";
        if ("wav".equalsIgnoreCase(format)) mimeType = "audio/wav";
        if ("flac".equalsIgnoreCase(format)) mimeType = "audio/flac";
        if ("ogg".equalsIgnoreCase(format)) mimeType = "audio/ogg";
        if ("aac".equalsIgnoreCase(format)) mimeType = "audio/aac";
        if ("aiff".equalsIgnoreCase(format)) mimeType = "audio/aiff";
        if ("m4a".equalsIgnoreCase(format)) mimeType = "audio/mp4";
        if ("mp4".equalsIgnoreCase(format)) mimeType = "video/mp4";
        if ("webm".equalsIgnoreCase(format)) mimeType = "video/webm";
        if ("gif".equalsIgnoreCase(format)) mimeType = "image/gif";
        if ("mov".equalsIgnoreCase(format)) mimeType = "video/quicktime";
        if ("avi".equalsIgnoreCase(format)) mimeType = "video/x-msvideo";
        if ("mkv".equalsIgnoreCase(format)) mimeType = "video/x-matroska";

        headers.setContentType(MediaType.parseMediaType(mimeType));

        String outputFilename = "converted." + format;
        if (originalFilename != null) {
            int dotIndex = originalFilename.lastIndexOf('.');
            if (dotIndex > 0) {
                outputFilename = originalFilename.substring(0, dotIndex) + "." + format;
            }
        }
        headers.setContentDispositionFormData("attachment", outputFilename);

        return new ResponseEntity<>(data, headers, HttpStatus.OK);
    }
}
