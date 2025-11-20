/**
 * Type definitions for @thermal-print/react
 */

import type { RendererAdapter, ComponentMapping } from './adapters';
import type { PrintNodeToESCPOSOptions } from '@thermal-print/escpos';

/**
 * Options for converting React components to ESC/POS
 * Combines renderer options (adapter) with ESC/POS options
 */
export interface ConversionOptions extends PrintNodeToESCPOSOptions {
  adapter?: RendererAdapter | ComponentMapping; // Custom adapter or component mapping (default: ReactPDFAdapter)
}
