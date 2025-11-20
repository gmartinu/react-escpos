# @thermal-print/pdf

Framework-agnostic PDF generation from DOM elements. Perfect for converting thermal printer previews to printable PDFs.

## Features

- 🎯 **Framework-agnostic** - Works with React, Vue, vanilla JS, or any framework
- 📄 **Simple API** - Just pass an element ID or reference
- 🖨️ **Browser printing** - Generate PDFs ready for `window.print()`
- 📥 **Auto-download** - Optional automatic file download
- 🎨 **Flexible sizing** - Supports standard paper sizes and thermal paper widths
- 🔧 **Customizable** - Control quality, margins, orientation, and more

## Installation

```bash
npm install @thermal-print/pdf
# or
pnpm add @thermal-print/pdf
# or
yarn add @thermal-print/pdf
```

## Usage

### Basic Example

```typescript
import { convertToPDF } from '@thermal-print/pdf';

// Your HTML element with thermal printer content
<div id="thermal-receipt">
  <!-- Thermal printer content here -->
</div>

// Convert to PDF
const result = await convertToPDF('thermal-receipt');

// Open in new window for printing
window.open(result.url);

// Clean up when done
result.cleanup();
```

### With React Components

```tsx
import { Preview, Document, Page, Text } from '@thermal-print/react';
import { convertToPDF } from '@thermal-print/pdf';

function ReceiptApp() {
  const handlePrint = async () => {
    const result = await convertToPDF('my-receipt', {
      paperSize: '80mm',
      scale: 2
    });

    // Open print dialog
    window.open(result.url);
  };

  return (
    <>
      <Preview id="my-receipt" paperWidth={48}>
        <Document>
          <Page>
            <Text>My Receipt Content</Text>
          </Page>
        </Document>
      </Preview>

      <button onClick={handlePrint}>Print as PDF</button>
    </>
  );
}
```

### Using HTMLElement Reference

```typescript
const element = document.getElementById('my-receipt');

if (element) {
  const result = await convertToPDF(element, {
    paperSize: 'A4',
    orientation: 'portrait'
  });

  window.open(result.url);
  result.cleanup();
}
```

### Auto-Download PDF

```typescript
// Automatically download the PDF
await convertToPDF('thermal-receipt', {
  filename: 'receipt.pdf'
});
```

## API Reference

### `convertToPDF(elementOrId, options?)`

Converts a DOM element to a PDF blob.

#### Parameters

- **`elementOrId`** (`string | HTMLElement`) - Element ID or HTMLElement reference
- **`options`** (`PDFOptions`) - Optional configuration object

#### Returns

`Promise<PDFResult>` - Object containing:
- `blob`: The generated PDF as a Blob
- `url`: Object URL for the blob (usable with `window.open`)
- `cleanup()`: Function to revoke the object URL

### PDFOptions

```typescript
interface PDFOptions {
  /**
   * Paper size for the PDF
   * @default 'A4'
   */
  paperSize?: 'A4' | 'Letter' | '80mm' | '58mm' | { width: number; height: number };

  /**
   * Page orientation
   * @default 'portrait'
   */
  orientation?: 'portrait' | 'landscape';

  /**
   * Scale factor for rendering quality (higher = better quality)
   * @default 2
   */
  scale?: number;

  /**
   * PDF margins in mm
   * @default 10
   */
  margin?: number;

  /**
   * JPEG quality for images (0-1)
   * @default 0.95
   */
  imageQuality?: number;

  /**
   * Background color for transparent areas
   * @default '#ffffff'
   */
  backgroundColor?: string;

  /**
   * Optional filename for automatic download
   */
  filename?: string;
}
```

## Paper Sizes

### Standard Sizes
- **A4**: 210mm × 297mm
- **Letter**: 215.9mm × 279.4mm

### Thermal Paper Sizes
- **80mm**: 80mm width (common for receipts)
- **58mm**: 58mm width (common for small receipts)

### Custom Size
```typescript
await convertToPDF('my-element', {
  paperSize: { width: 100, height: 200 } // mm
});
```

## Examples

### High-Quality PDF for Archival

```typescript
const result = await convertToPDF('receipt', {
  paperSize: 'A4',
  scale: 3, // Higher quality
  imageQuality: 1.0, // Maximum quality
  margin: 15
});
```

### Thermal Receipt PDF

```typescript
const result = await convertToPDF('thermal-preview', {
  paperSize: '80mm',
  scale: 2,
  margin: 5
});
```

### Landscape PDF

```typescript
const result = await convertToPDF('wide-content', {
  paperSize: 'A4',
  orientation: 'landscape'
});
```

## How It Works

1. Captures the DOM element using **html2canvas**
2. Converts the canvas to a high-quality image
3. Generates a PDF using **jsPDF**
4. Returns a Blob ready for printing or download

## Browser Compatibility

Works in all modern browsers that support:
- HTML5 Canvas
- Blob URLs
- ES2020+

## Integration with @thermal-print/react

This package is designed to work seamlessly with `@thermal-print/react` but can be used independently with any HTML content.

```tsx
import { Preview } from '@thermal-print/react';
import { convertToPDF } from '@thermal-print/pdf';

// Render thermal content
<Preview id="receipt">
  {/* Your thermal content */}
</Preview>

// Convert to PDF
await convertToPDF('receipt');
```

## License

MIT © Gabriel Martinusso
