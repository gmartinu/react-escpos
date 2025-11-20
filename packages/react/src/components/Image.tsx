import React from 'react';
import { ViewStyle, TextStyle } from '@thermal-print/core';

/**
 * Image component - Displays images (converted to monochrome for thermal printing)
 *
 * Images are automatically:
 * - Resized to fit paper width
 * - Converted to grayscale
 * - Converted to monochrome (black/white)
 *
 * @example
 * ```typescript
 * // Base64 image
 * <Image src="data:image/png;base64,..." />
 *
 * // With alignment
 * <Image
 *   src="data:image/png;base64,..."
 *   style={{ textAlign: 'center' }}
 * />
 * ```
 */
export interface ImageProps {
  src: string; // base64 or data URI or {uri: string}
  style?: ViewStyle & TextStyle; // For alignment
}

// Mark component with displayName for reconciler
export const Image = ({ src, style }: ImageProps) => {
  // Handle both string src and {uri: string} format
  const source = typeof src === 'string' ? src : (src as any)?.uri || src;
  return React.createElement('Image', { source, style });
};

Image.displayName = 'Image';
