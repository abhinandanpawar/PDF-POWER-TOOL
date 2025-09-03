# PDF Processor API Documentation

This document provides detailed information about the API endpoints for the PDF Processor application. It is intended for UI developers who need to interact with the backend services.

## General Information

- **Base URL:** `/api/v1`
- **Authentication:** No authentication is required for the current version of the API.
- **Error Handling:** In case of an error, the API will return a standard HTTP error response with a status code and a message in the response body.

## Endpoints

### PDF Controller (`/api/v1/pdfs`)

#### Merge PDFs

- **URL:** `/merge`
- **Method:** `POST`
- **Description:** Merges multiple PDF files into a single PDF document.
- **Request:**
  - **Content-Type:** `multipart/form-data`
  - **Body:**
    - `files`: A list of PDF files to merge.
- **Response:**
  - **Content-Type:** `application/pdf`
  - **Body:** The merged PDF document.

#### Split PDF

- **URL:** `/split`
- **Method:** `POST`
- **Description:** Splits PDF files into multiple pages. If no range is specified, each page of each PDF is returned as a separate PDF file. If a range is specified, the specified pages are extracted from each PDF and returned as a single PDF.
- **Request:**
  - **Content-Type:** `multipart/form-data`
  - **Body:**
    - `files`: A list of PDF files to split.
    - `ranges` (optional): A string specifying the page ranges to extract (e.g., "1-3,5,7").
- **Response:**
  - **Content-Type:** `application/octet-stream`
  - **Body:** A ZIP file containing the split PDF documents.

#### Compress PDF

- **URL:** `/compress`
- **Method:** `POST`
- **Description:** Compresses multiple PDF files by reducing the quality of the images within them.
- **Request:**
  - **Content-Type:** `multipart/form-data`
  - **Body:**
    - `files`: A list of PDF files to compress.
- **Response:**
  - **Content-Type:** `application/octet-stream`
  - **Body:** A ZIP file containing the compressed PDF documents.

### Annotation Controller (`/api/v1/pdfs/annotate`)

#### Add Watermark

- **URL:** `/watermark`
- **Method:** `POST`
- **Description:** Adds a text watermark to each page of multiple PDF documents.
- **Request:**
  - **Content-Type:** `multipart/form-data`
  - **Body:**
    - `files`: A list of PDF files to watermark.
    - `text`: The watermark text.
- **Response:**
  - **Content-Type:** `application/octet-stream`
  - **Body:** A ZIP file containing the watermarked PDF documents.

### Conversion Controller (`/api/v1/convert`)

#### Convert PDF to Word

- **URL:** `/pdf-to-word`
- **Method:** `POST`
- **Description:** Converts multiple PDF files to Word documents.
- **Request:**
  - **Content-Type:** `multipart/form-data`
  - **Body:**
    - `files`: A list of PDF files to convert.
- **Response:**
  - **Content-Type:** `application/octet-stream`
  - **Body:** A ZIP file containing the converted Word documents.

#### Convert PDF to Images

- **URL:** `/pdf-to-images`
- **Method:** `POST`
- **Description:** Converts each page of multiple PDF documents into images.
- **Request:**
  - **Content-Type:** `multipart/form-data`
  - **Body:**
    - `files`: A list of PDF files to convert.
    - `format` (optional): The desired image format (e.g., "png", "jpg"). Default is "png".
    - `dpi` (optional): The resolution of the output images in dots per inch. Default is 300.
- **Response:**
  - **Content-Type:** `application/octet-stream`
  - **Body:** A ZIP file containing the images.

### Page Deletion Controller (`/api/v1/pdfs`)

#### Delete Pages

- **URL:** `/delete-pages`
- **Method:** `POST`
- **Description:** Deletes specified pages from multiple PDF documents.
- **Request:**
  - **Content-Type:** `multipart/form-data`
  - **Body:**
    - `files`: A list of PDF files.
    - `pages`: A list of 1-based page numbers to delete.
- **Response:**
  - **Content-Type:** `application/octet-stream`
  - **Body:** A ZIP file containing the modified PDF documents.

### Protection Controller (`/api/v1/pdfs`)

#### Protect PDF

- **URL:** `/protect`
- **Method:** `POST`
- **Description:** Protects multiple PDF files with a password.
- **Request:**
  - **Content-Type:** `multipart/form-data`
  - **Body:**
    - `files`: A list of PDF files to protect.
    - `password`: The password to use for encryption.
- **Response:**
  - **Content-Type:** `application/octet-stream`
  - **Body:** A ZIP file containing the protected PDF documents.

### Rotation Controller (`/api/v1/pdfs`)

#### Rotate Pages

- **URL:** `/rotate-pages`
- **Method:** `POST`
- **Description:** Rotates specified pages in multiple PDF documents.
- **Request:**
  - **Content-Type:** `multipart/form-data`
  - **Body:**
    - `files`: A list of PDF files.
    - `pages`: A list of 1-based page numbers to rotate.
    - `degrees`: The degrees of rotation (must be a multiple of 90).
- **Response:**
  - **Content-Type:** `application/octet-stream`
  - **Body:** A ZIP file containing the rotated PDF documents.

### Text Extraction Controller (`/api/v1/text`)

#### Extract Text

- **URL:** `/extract`
- **Method:** `POST`
- **Description:** Extracts text from multiple PDF documents and concatenates it into a single string.
- **Request:**
  - **Content-Type:** `multipart/form-data`
  - **Body:**
    - `files`: A list of PDF files.
- **Response:**
  - **Content-Type:** `text/plain`
  - **Body:** A string containing the extracted text from all the files.


### Reorder Controller (`/api/v1/pdfs`)

#### Reorder Pages

- **URL:** `/reorder-pages`
- **Method:** `POST`
- **Description:** Reorders the pages of multiple PDF documents according to a new specified order.
- **Request:**
  - **Content-Type:** `multipart/form-data`
  - **Body:**
    - `files`: A list of PDF files.
    - `order`: A list of 1-based page numbers in the desired new order.
- **Response:**
  - **Content-Type:** `application/octet-stream`
  - **Body:** A ZIP file containing the reordered PDF documents.

### Metadata Controller (`/api/v1/metadata`)

#### Get PDF Metadata

- **URL:** `/get`
- **Method:** `POST`
- **Description:** Retrieves the metadata from a PDF file.
- **Request:**
  - **Content-Type:** `multipart/form-data`
  - **Body:**
    - `file`: The PDF file from which to extract metadata.
- **Response:**
  - **Content-Type:** `application/json`
  - **Body:** A JSON object containing the PDF metadata.

#### Set PDF Metadata

- **URL:** `/set`
- **Method:** `POST`
- **Description:** Sets the metadata for a PDF file.
- **Request:**
  - **Content-Type:** `multipart/form-data`
  - **Body:**
    - `file`: The PDF file to modify.
    - `metadata`: A map of key-value pairs representing the metadata to set.
- **Response:**
  - **Content-Type:** `application/pdf`
  - **Body:** The PDF document with the updated metadata.
