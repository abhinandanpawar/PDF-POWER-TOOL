# Application Features

This document provides an overview of the key features of the application and the recent enhancements made to them.

## Spreadsheet Converter

The spreadsheet converter allows you to convert Excel spreadsheets (`.xls` and `.xlsx`) into HTML files.

### Enhancements
The original spreadsheet converter had limited functionality and did not preserve any of the styling from the original spreadsheet. The converter has been significantly enhanced to:

*   **Preserve Styling:** The new converter now preserves a wide range of styling from the original spreadsheet, including cell colors, fonts, borders, and more.
*   **Support for both `.xls` and `.xlsx` formats:** The converter now correctly handles both old (`.xls`) and new (`.xlsx`) Excel formats.
*   **Robust HTML Output:** The generated HTML is well-structured and includes the necessary CSS to render the spreadsheet accurately in a browser.

This was achieved by integrating a new set of Java classes based on the robust Apache POI library, including `HtmlConverter`, `HSSFHtmlHelper`, and `XSSFHtmlHelper`.

## Audio & Video Converters

The application provides tools to convert audio and video files to various formats.

### Enhancements
The audio and video converters have been enhanced to support a wider range of formats and provide more control over the output quality.

#### New Audio Formats
The audio converter now supports the following additional output formats:
*   AAC (`.aac`)
*   AIFF (`.aiff`)
*   M4A (`.m4a`)

#### New Video Formats
The video converter now supports the following additional output formats:
*   MOV (`.mov`)
*   AVI (`.avi`)
*   MKV (`.mkv`)

#### Audio Bitrate Control
The audio converter now includes a bitrate slider, allowing you to control the quality of the output audio. You can select a bitrate from 64 kbps to 320 kbps. This gives you more control over the trade-off between file size and audio quality.

## Future Enhancements

This section outlines the remaining work to be done on the application, focusing on UI/UX improvements and fixing development environment issues.

### UI/UX Improvements
*   **Implement Routing:** The application currently uses a simple state management system to switch between views. Implementing a proper routing solution (like React Router) would enable deep linking and improve the overall user experience.
*   **General UI Polish:** The overall UI is functional but could benefit from a more polished and consistent design. This includes improving layout, typography, and color schemes across all tool pages.
*   **Improved User Feedback:** Enhance user feedback mechanisms, such as providing more informative loading and success/error messages.
*   **Responsive Design:** Ensure the application is fully responsive and usable on a variety of screen sizes, from mobile devices to large desktop monitors.

### Development Environment
*   **Fix the Vite Dev Server:** The local development server (`npm run dev`) is currently not working, which is a critical blocker for frontend development. This needs to be investigated and fixed.
