# PDF Processor

PDF Processor is a powerful web-based application for performing various operations on PDF files. It provides a simple and intuitive interface for users to merge, split, compress, protect, and manipulate their PDF documents with ease. The backend is built with Java and Spring Boot, offering a robust set of RESTful APIs, while the frontend is a modern and responsive single-page application built with React.

## Features

- **Merge:** Combine multiple PDF files into a single document.
- **Split:** Extract specific page ranges from a PDF.
- **Compress:** Reduce the file size of a PDF.
- **Protect:** Add a password to a PDF.
- **Annotate:** Add watermarks to documents.
- **Convert:** Convert PDFs to other formats like Word and images.
- **And more...**

## Prerequisites

To run this project, you will need the following software installed on your machine:

- **Java 21:** The backend is built with Java 21.
- **Maven:** The project uses Maven for dependency management and building.
- **Node.js:** The frontend is a React application and requires Node.js and npm.

## Running the Application

### Backend

1.  **Build the application:** Navigate to the root directory of the project and run the following command to build the backend:

    ```bash
    mvn clean install
    ```

2.  **Run the backend:** Once the build is complete, you can run the application with the following command:

    ```bash
    java -jar app/target/app-0.0.1-SNAPSHOT.jar
    ```

    The backend server will start on port `8080`.

### Frontend

1.  **Navigate to the frontend directory:**

    ```bash
    cd frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    ```

    The frontend development server will start on port `5173` by default.

## Accessing the Application

Once both the backend and frontend are running, you can access the application by opening your web browser and navigating to:

[http://localhost:5173](http://localhost:5173)

## API Documentation

The backend provides a comprehensive set of RESTful APIs. For detailed information about the available endpoints, please refer to the [API_DOCUMENTATION.md](API_DOCUMENTATION.md) file.