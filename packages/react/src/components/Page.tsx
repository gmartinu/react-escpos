import React, { ReactNode } from 'react';
import { ViewStyle } from '@thermal-print/core';

/**
 * Page component - Represents a page in the document
 *
 * Note: For thermal printers, this is mostly semantic.
 * Thermal printers print continuously without page breaks.
 *
 * @example
 * ```typescript
 * <Page style={{ padding: 20 }}>
 *   <Text>Page content</Text>
 * </Page>
 * ```
 */
export interface PageProps {
  children: ReactNode;
  style?: ViewStyle;
}

// Mark component with displayName for reconciler
export const Page = ({ children, style }: PageProps) => {
  return React.createElement('Page', { style }, children);
};

Page.displayName = 'Page';
