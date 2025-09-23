# UI Style Guide

This document outlines the color palette, typography, and usage guidelines for the PDF Power Toolbox application UI.

## Color Palette

The UI uses a semantic color palette defined in `tailwind.config.js`. Always use these theme variables instead of hardcoded colors to ensure consistency. The colors are defined with RGB values to support opacity modifiers (e.g., `bg-primary/90`).

### Primary Colors
| Name | Hex | RGB | Tailwind Class | Usage |
|---|---|---|---|---|
| Background | `#F8F9FA` | `rgb(248 249 250)` | `bg-background` | Main application background |
| Foreground | `#2C3E50` | `rgb(44 62 80)` | `text-foreground` | Default text color |
| Primary | `#3498DB` | `rgb(52 152 219)` | `bg-primary`, `text-primary` | Main interactive elements, buttons, links |
| Secondary | `#34495E` | `rgb(52 73 94)` | `bg-secondary`, `text-secondary` | Secondary buttons, less prominent elements |
| Accent | `#16A085` | `rgb(22 160 133)` | `bg-accent`, `text-accent` | Highlights, special callouts |

### State Colors
| Name | Hex | RGB | Tailwind Class | Usage |
|---|---|---|---|---|
| Success | `#27AE60` | `rgb(39 174 96)` | `bg-success` | Success messages, success states |
| Destructive/Error | `#E74C3C` | `rgb(231 76 60)` | `bg-destructive` | Error messages, destructive actions |

### UI & Component Colors
| Name | Hex | RGB | Tailwind Class | Usage |
|---|---|---|---|---|
| Card | `#FFFFFF` | `rgb(255 255 255)` | `bg-card`, `text-card-foreground` | Card backgrounds |
| Muted | `#ECF0F1` | `rgb(236 240 241)` | `bg-muted`, `text-muted-foreground` | Table headers, disabled states, subtle text |
| Border | `#BDC3C7` | `rgb(189 195 199)` | `border-border` | Component and layout borders |
| Ring | `#2980B9` | `rgb(41 128 185)` | `ring-ring` | Focus rings on interactive elements |

## Typography

- **Font Family**: The application uses a system sans-serif font stack.
- **Base Font Size**: `14px` (set globally in `index.css`).
- **Important Data**: `16px` (use `text-base` class).
- **Line Height**: `1.6` (set globally in `index.css`).
- **Headings**: Use appropriate heading tags (`<h1>`, `<h2>`, etc.) and font weight utilities (`font-bold`, `font-semibold`) to establish a clear visual hierarchy.

## Usage Example

Here is an example of a correctly styled button using the theme variables:

```jsx
<button
  className="bg-primary text-primary-foreground font-bold py-3 px-4 rounded-lg hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground"
>
  Primary Button
</button>
```
