# PDF Processor API

PDF Processor is a Spring Boot REST API for performing various operations on PDF documents. This project is the foundation for a larger SaaS application aimed at providing a comprehensive suite of document management tools.

The initial feature is the ability to merge two PDF files.

## API Documentation

### Merge PDFs

Merges two PDF documents into a single document.

- **URL:** `/api/v1/pdfs/merge`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`

**Request Body:**

The request must contain two parts, each with a PDF file.

- `file1`: The first PDF file.
- `file2`: The second PDF file.

**Example cURL Request:**

```bash
curl -X POST \
  http://localhost:8080/api/v1/pdfs/merge \
  -F "file1=@/path/to/your/first.pdf" \
  -F "file2=@/path/to/your/second.pdf" \
  --output merged_document.pdf
```

**Success Response:**

- **Code:** `200 OK`
- **Content-Type:** `application/pdf`
- **Body:** The binary content of the newly merged PDF document.

**Error Responses:**

- **Code:** `400 Bad Request`
  - If one or both files are missing from the request.
  - If one or both uploaded files are not valid PDF documents.

## Local Development

### Prerequisites

- Java 17 or later
- Apache Maven

### Setup & Running the Application

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd pdf-processor
    ```

2.  **Build the project:**
    ```bash
    mvn clean install
    ```

3.  **Run the application:**
    ```bash
    mvn spring-boot:run
    ```
    The application will be available at `http://localhost:8080`.

### Running Tests

To run the automated test suite, execute the following command:

```bash
mvn clean test
```
