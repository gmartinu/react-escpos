import React, { ReactNode } from 'react';

/**
 * Document component - Root wrapper for thermal printer documents
 *
 * @example
 * ```typescript
 * <Document>
 *   <Page>
 *     <Text>Content</Text>
 *   </Page>
 * </Document>
 * ```
 */
export interface DocumentProps {
  children: ReactNode;
}

// Mark component with displayName for reconciler
export const Document = ({ children }: DocumentProps) => {
  return React.createElement('Document', {}, children);
};

Document.displayName = 'Document';
