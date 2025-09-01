# PDF Processor API

PDF Processor is a Spring Boot REST API for performing various operations on PDF documents. This project provides a foundation for a larger suite of document management tools.

## API Documentation

### Merge PDFs

Merges two PDF documents into a single document.

- **URL:** `/api/v1/pdfs/merge`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`

**Request Body:**
- `file1`: The first PDF file.
- `file2`: The second PDF file.

**Success Response:**
- **Code:** `200 OK`
- **Content-Type:** `application/pdf`
- **Body:** The binary content of the newly merged PDF document.

---

### Split PDF

Splits a single PDF document into multiple, single-page PDF documents. The result is returned as a zip archive.

- **URL:** `/api/v1/pdfs/split`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`

**Request Body:**
- `file`: The PDF file to be split.

**Success Response:**
- **Code:** `200 OK`
- **Content-Type:** `application/zip`
- **Body:** A zip archive containing each page as a separate PDF file (e.g., `page_1.pdf`, `page_2.pdf`, etc.).

## Local Development

### Prerequisites
- Java 17 or later
- Apache Maven

### Setup & Running
1.  **Build the project:** `mvn clean install`
2.  **Run the application:** `mvn spring-boot:run`

The application will be available at `http://localhost:8080`.

### Running Tests
To run the automated test suite, execute: `mvn clean test`
