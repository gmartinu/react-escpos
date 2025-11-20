/**
 * Paper size options for PDF generation
 */
export type PaperSize =
  | 'A4'
  | 'Letter'
  | '80mm'
  | '58mm'
  | { width: number; height: number }; // Custom size in mm

/**
 * Page orientation for PDF
 */
export type Orientation = 'portrait' | 'landscape';

/**
 * Options for PDF conversion
 */
export interface PDFOptions {
  /**
   * Paper size for the PDF
   * - 'A4': 210mm x 297mm
   * - 'Letter': 215.9mm x 279.4mm
   * - '80mm': 80mm x auto (thermal paper)
   * - '58mm': 58mm x auto (thermal paper)
   * - Custom: { width, height } in mm
   * @default 'A4'
   */
  paperSize?: PaperSize;

  /**
   * Page orientation
   * @default 'portrait'
   */
  orientation?: Orientation;

  /**
   * Scale factor for html2canvas rendering quality
   * Higher values produce better quality but larger file sizes
   * @default 2
   */
  scale?: number;

  /**
   * PDF margins in mm
   * @default 10
   */
  margin?: number;

  /**
   * Optional filename for automatic download
   * If provided, the PDF will be automatically downloaded
   * If not provided, only the Blob is returned
   */
  filename?: string;

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
}

/**
 * Result of PDF conversion
 */
export interface PDFResult {
  /**
   * The generated PDF as a Blob
   */
  blob: Blob;

  /**
   * Object URL for the blob (can be used with window.open)
   */
  url: string;

  /**
   * Function to revoke the object URL (call when done)
   */
  cleanup: () => void;
}
