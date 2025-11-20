/**
 * @thermal-print/pdf
 *
 * Framework-agnostic PDF generation from DOM elements
 * Works with React, Vue, vanilla JS, or any framework
 */

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { PDFOptions, PDFResult } from './types';

/**
 * Converts a DOM element to a PDF blob
 *
 * @param elementOrId - Element ID string or HTMLElement reference
 * @param options - PDF generation options
 * @returns Promise resolving to PDF Blob and utility functions
 *
 * @example
 * ```typescript
 * // Using element ID
 * const result = await convertToPDF('thermal-receipt', {
 *   paperSize: '80mm',
 *   scale: 2
 * });
 *
 * // Open in new window for printing
 * window.open(result.url);
 *
 * // Clean up when done
 * result.cleanup();
 * ```
 *
 * @example
 * ```typescript
 * // Using HTMLElement reference
 * const element = document.getElementById('my-receipt');
 * const result = await convertToPDF(element, {
 *   paperSize: 'A4',
 *   filename: 'receipt.pdf' // Auto-download
 * });
 * ```
 */
export async function convertToPDF(
  elementOrId: string | HTMLElement,
  options: PDFOptions = {}
): Promise<PDFResult> {
  // Get the element
  const element = typeof elementOrId === 'string'
    ? document.getElementById(elementOrId)
    : elementOrId;

  if (!element) {
    throw new Error(
      typeof elementOrId === 'string'
        ? `Element with id "${elementOrId}" not found`
        : 'Invalid element provided'
    );
  }

  // Default options
  const {
    paperSize = 'A4',
    orientation = 'portrait',
    scale = 2,
    margin = 10,
    imageQuality = 0.95,
    backgroundColor = '#ffffff',
    filename
  } = options;

  // Convert paper size to dimensions in mm
  const dimensions = getPaperDimensions(paperSize, orientation);

  // Capture the element as canvas
  const canvas = await html2canvas(element, {
    scale,
    backgroundColor,
    useCORS: true,
    logging: false,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight
  });

  // Calculate PDF dimensions
  const imgWidth = dimensions.width - (margin * 2);
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  // Create PDF
  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format: [dimensions.width, dimensions.height]
  });

  // Add image to PDF
  const imgData = canvas.toDataURL('image/jpeg', imageQuality);
  pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight);

  // Generate blob
  const blob = pdf.output('blob');

  // Create object URL
  const url = URL.createObjectURL(blob);

  // Auto-download if filename provided
  if (filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Return result with cleanup function
  return {
    blob,
    url,
    cleanup: () => URL.revokeObjectURL(url)
  };
}

/**
 * Get paper dimensions in mm based on paper size and orientation
 */
function getPaperDimensions(
  paperSize: PDFOptions['paperSize'],
  orientation: PDFOptions['orientation']
): { width: number; height: number } {
  let width: number;
  let height: number;

  if (typeof paperSize === 'object') {
    // Custom dimensions
    width = paperSize.width;
    height = paperSize.height;
  } else {
    // Predefined paper sizes
    switch (paperSize) {
      case 'A4':
        width = 210;
        height = 297;
        break;
      case 'Letter':
        width = 215.9;
        height = 279.4;
        break;
      case '80mm':
        width = 80;
        height = 297; // Default height, can be adjusted
        break;
      case '58mm':
        width = 58;
        height = 297; // Default height, can be adjusted
        break;
      default:
        width = 210;
        height = 297;
    }
  }

  // Swap dimensions for landscape
  if (orientation === 'landscape') {
    [width, height] = [height, width];
  }

  return { width, height };
}

// Export types
export * from './types';
