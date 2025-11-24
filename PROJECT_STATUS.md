# Project Status

## Overview
The project is a PDF processing application with a Spring Boot backend and React frontend. It supports merging, splitting, compressing, and converting PDF files.

## Current State
- **Backend:**
  - Build is fixed and passing.
  - Application starts successfully on port 8080.
  - Core PDF services (Merge, Split, Compress) are implemented.
  - `cad-convert` module is excluded from the build.
  - Actuator enabled for health checks.
- **Frontend:**
  - Runs on Vite (port 5173).
  - Redesigned with a "Year 2077" Cyberpunk theme.
  - Connected to backend API for Merge and Split features.
- **Testing:**
  - Backend tests exist but coverage is low. `pdf-split` tests were fixed.
  - Frontend tests are minimal.

## Technology Stack
- **Backend:** Java 21, Spring Boot 3.4.0, Apache PDFBox, Apache POI.
- **Frontend:** React, Vite, Tailwind CSS.
- **Build:** Maven (Backend), NPM (Frontend).
