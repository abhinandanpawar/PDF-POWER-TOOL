## Specialized Formats: CAD to PDF Converter

This document outlines the work done to implement the "CAD to PDF" converter, which is part of the "Specialized Formats" task.

### Summary

The goal of this task was to add a new feature to the PDF Power Toolbox that allows users to convert CAD files (specifically DXF files) to PDF. The implementation was done entirely on the frontend using JavaScript libraries, which simplifies the architecture and avoids the need for a dedicated backend service for this conversion.

### Changes Made

1.  **Frontend Implementation:**
    *   A new tool, "CAD to PDF," was added to the user interface.
    *   A new view component, `CadConvertView.tsx`, was created to handle the user interaction for the new tool.
    *   The following JavaScript libraries were added to the project:
        *   `dxf-parser`: To parse the uploaded DXF file.
        *   `three`: To render the parsed DXF data to a 3D scene.
        *   `three-dxf`: A helper library to render `dxf-parser` output with `three.js`.
        *   `jspdf`: To convert the rendered scene (from a canvas element) to a PDF document.
    *   The conversion logic is implemented entirely in the browser:
        1.  The user selects a DXF file.
        2.  The file is read as text.
        3.  `dxf-parser` parses the text into a JavaScript object.
        4.  `three.js` and `three-dxf` render the object to a hidden canvas element.
        5.  `jspdf` captures the canvas content as an image and creates a PDF document.
        6.  The generated PDF is downloaded to the user's computer.

2.  **Backend (Removed):**
    *   Initially, a backend service was created for this feature. However, due to the difficulty of finding a suitable open-source Java library for DXF conversion, this approach was abandoned.
    *   The `cad-convert` Maven module and all related backend code have been removed from the project. This includes:
        *   The `cad-convert` directory and its contents.
        *   All references to the `cad-convert` module in the `pom.xml` files.

### How to Test

1.  Start the frontend development server (`npm run dev`).
2.  Open the application in a browser (e.g., `http://localhost:5173/`).
3.  Navigate to the "CAD to PDF" tool in the "Convert & Extract" section.
4.  Upload a DXF file.
5.  Click the "Convert to PDF" button.
6.  A PDF file named `converted.pdf` should be downloaded.
7.  Open the downloaded PDF to verify that it contains the converted DXF drawing.
