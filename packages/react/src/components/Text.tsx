import React, { ReactNode } from 'react';
import { TextStyle } from '@thermal-print/core';

/**
 * Text component - Displays text content
 *
 * Supports:
 * - Font sizes (maps to thermal printer character sizes)
 * - Text alignment (left/center/right)
 * - Bold text
 *
 * @example
 * ```typescript
 * <Text style={{ fontSize: 20, textAlign: 'center', fontWeight: 'bold' }}>
 *   My Store
 * </Text>
 * ```
 */
export interface TextProps {
  children?: ReactNode;
  style?: TextStyle;
}

// Mark component with displayName for reconciler
export const Text = ({ children, style }: TextProps) => {
  return React.createElement('Text', { style }, children);
};

Text.displayName = 'Text';
