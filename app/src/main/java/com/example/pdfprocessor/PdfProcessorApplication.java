package com.example.pdfprocessor;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
@SpringBootApplication
@OpenAPIDefinition(info = @Info(title = "PDF Processor API", version = "1.0", description = "API for processing and manipulating PDF documents"))
public class PdfProcessorApplication {

    public static void main(String[] args) {
        SpringApplication.run(PdfProcessorApplication.class, args);
    }

}
