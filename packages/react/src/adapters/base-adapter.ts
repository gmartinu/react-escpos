import { ReactElement } from 'react';
import { ElementNode } from '@thermal-print/core';
import { RendererAdapter } from './types';
import { renderToElementTree } from '../reconciler';

/**
 * Base adapter class that provides common rendering functionality.
 * Child classes only need to implement the normalizeElementType method
 * to define their component name mappings.
 */
export abstract class BaseAdapter implements RendererAdapter {
  /**
   * Renders a React component to an ElementNode tree structure.
   * Uses a custom React reconciler to create the element tree.
   *
   * @param component - The React component to render
   * @returns The rendered element tree, or null if rendering fails
   */
  renderToTree(component: ReactElement): ElementNode | null {
    try {
      return renderToElementTree(component);
    } catch (error) {
      console.error('Failed to render component:', error);
      return null;
    }
  }

  /**
   * Normalizes a component type name to a standard element type.
   * Must be implemented by child classes to define their specific mappings.
   *
   * @param type - The component type name
   * @returns The normalized standard element type
   */
  abstract normalizeElementType(type: string): string;
}
