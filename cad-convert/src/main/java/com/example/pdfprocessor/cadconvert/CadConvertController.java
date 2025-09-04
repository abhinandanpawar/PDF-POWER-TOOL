package com.example.pdfprocessor.cadconvert;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import org.kabeja.parser.Parser;
import org.kabeja.parser.ParserBuilder;
import org.kabeja.svg.SVGGenerator;
import org.apache.batik.transcoder.image.PDFTranscoder;
import org.apache.batik.transcoder.TranscoderInput;
import org.apache.batik.transcoder.TranscoderOutput;

@RestController
@RequestMapping("/api/v1/cad-convert")
public class CadConvertController {

    @PostMapping
    public ResponseEntity<byte[]> convertCadToPdf(@RequestParam("file") MultipartFile file) {
        try {
            // Parse the DXF file
            Parser parser = ParserBuilder.createDefaultParser();
            parser.parse(file.getInputStream(), "UTF-8");

            // Convert the DXF to SVG
            SVGGenerator generator = new SVGGenerator();
            ByteArrayOutputStream svgOutputStream = new ByteArrayOutputStream();
            generator.generate(parser.getDocument(), svgOutputStream, "UTF-8");

            // Convert the SVG to PDF
            ByteArrayOutputStream pdfOutputStream = new ByteArrayOutputStream();
            PDFTranscoder transcoder = new PDFTranscoder();
            TranscoderInput transcoderInput = new TranscoderInput(new java.io.StringReader(svgOutputStream.toString("UTF-8")));
            TranscoderOutput transcoderOutput = new TranscoderOutput(pdfOutputStream);
            transcoder.transcode(transcoderInput, transcoderOutput);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "converted.pdf");

            return new ResponseEntity<>(pdfOutputStream.toByteArray(), headers, org.springframework.http.HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
