# Potential Issues and Areas for Improvement

This document outlines potential issues, bugs, and areas for improvement identified in the codebase.

## Frontend (React/TypeScript)

### Bugs

*   **[RESOLVED] Duplicate `Tool` enum entries:** The `Tool` enum in `types.ts` had duplicate entries for `CadConvert`. This has been resolved.
*   **[RESOLVED] `ImageEditorView.tsx` has a bug:** The `handleDimensionChange` function was defined twice. This has been resolved.

### Refactoring and Improvements

*   **[RESOLVED] Inconsistent `FileUpload` component:** The `FileUpload` component usage has been centralized and refactored across relevant feature files.
*   **[RESOLVED] Redundant code in `features/*.tsx` files:** Common logic for file uploads, loading states, and toasts has been abstracted into the `useToolLogic` hook, and relevant feature components have been refactored to use it.
*   **Inconsistent styling:** There are some inconsistencies in styling across different components. A style guide and a more consistent use of the design system would improve the overall look and feel of the application. (Partial: `Button.tsx` has been updated for better consistency).
*   **`ConfigConverterView.tsx` has a potential bug:** The XML to JSON conversion is using `xml-js` which might not handle all XML structures correctly. Also, the error handling is basic. Consider using a more robust XML parsing library and providing more informative error messages.
*   **`PasswordGeneratorView.tsx` has a potential bug:** The password generation logic could be improved to ensure a more random distribution of characters.
*   **`TimelineRoadmapBuilderView.tsx` has a potential bug:** The drag and drop functionality is basic and could be improved with better visual feedback and constraints.


### Testing

*   **[RESOLVED] Missing tests:** A basic test for the `useToolLogic` hook has been added.

## Backend (Java)

### Bugs

*   **`FontConverterServiceImpl.java`:** The `woff` to `ttf` conversion assumes the input is `woff`, which might not always be the case. The implementation should be more robust and ideally auto-detect the input format to avoid unexpected errors.

### Refactoring and Improvements

*   **`CadConvertController.java`:** The controller handles all the logic for the conversion. This should be refactored into a service layer to separate concerns and improve the overall architecture of the application.
*   **Basic exception handling:** The exception handling in the backend is very basic. It should be improved to provide more meaningful error messages to the user and to log errors effectively.

### Testing

*   **Missing unit tests:** The Java backend lacks unit tests. Adding tests would improve the stability and reliability of the application. (Partial: `FontConverterServiceImplTest.java` has been added, but it's a basic test).

## Deprecated Dependencies

The following dependencies are deprecated and should be updated:

*   `glob@7.2.3`
*   `are-we-there-yet@2.0.0`
*   `@codemirror/rangeset@0.19.9`
*   `@codemirror/history@0.19.2`
*   `@codemirror/fold@0.19.4`
*   `@codemirror/text@0.19.6`
*   `@codemirror/gutter@0.19.9`
*   `abab@2.0.6`
*   `w3c-hr-time@1.0.2`
*   `rimraf@3.0.2`
*   `npmlog@5.0.1`
*   `gauge@3.0.2`
*   `har-validator@5.1.5`
*   `domexception@4.0.0`
*   `mkdirp@0.5.1`
*   `request@2.88.2`
*   `uuid@3.4.0`

## Build Issues

*   **[TEMPORARILY RESOLVED] `cad-convert` module build failure:** The `cad-convert` module was failing to build due to an unresolved `kabeja` dependency. This module has been temporarily removed from the parent `pom.xml` to allow the rest of the application to build successfully. A more robust solution for DXF to PDF conversion should be investigated separately.