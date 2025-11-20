import { ReactElement } from 'react';
import { PrintNode, ElementNode } from '@thermal-print/core';
import { RendererAdapter, ReactPDFAdapter } from './adapters';
import { renderToElementTree as reconcilerRenderToTree } from './reconciler';

/**
 * Converts a React component to a PrintNode tree (universal IR).
 *
 * This is the main entry point for @thermal-print/react.
 * It converts React components to the universal PrintNode intermediate representation
 * that can be consumed by any printer format converter.
 *
 * @param component - The React component to render
 * @param adapter - The renderer adapter to use (defaults to ReactPDFAdapter for @react-pdf/renderer compatibility)
 * @returns The PrintNode tree, or null if rendering fails
 *
 * @example
 * ```typescript
 * import { Document, Page, Text } from '@react-pdf/renderer';
 * import { convertToPrintNodes } from '@thermal-print/react';
 *
 * const printNodes = convertToPrintNodes(
 *   <Document>
 *     <Page>
 *       <Text>Hello World</Text>
 *     </Page>
 *   </Document>
 * );
 * ```
 */
export function convertToPrintNodes(
  component: ReactElement,
  adapter?: RendererAdapter
): PrintNode | null {
  // Use provided adapter or default to ReactPDFAdapter for backward compatibility
  const rendererAdapter = adapter || new ReactPDFAdapter();

  return rendererAdapter.renderToTree(component);
}

/**
 * @deprecated Use convertToPrintNodes() instead. Will be removed in v1.0
 */
export function renderToElementTree(
  component: ReactElement,
  adapter?: RendererAdapter
): ElementNode | null {
  return convertToPrintNodes(component, adapter);
}

/**
 * Direct rendering function using the custom reconciler.
 * This is exported for advanced use cases where you want to bypass the adapter system.
 *
 * @param component - The React component to render
 * @returns The rendered element tree, or null if rendering fails
 */
export { reconcilerRenderToTree as renderToTree };
