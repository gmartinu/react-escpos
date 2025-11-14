import ReactTestRenderer from 'react-test-renderer';
import { ReactElement } from 'react';
import { ElementNode } from './types';

/**
 * Renders a React component to a test renderer instance
 */
export function renderComponent(component: ReactElement): ReactTestRenderer.ReactTestRenderer {
  return ReactTestRenderer.create(component);
}

/**
 * Converts a ReactTestRenderer node to our ElementNode structure
 */
export function convertToElementNode(node: any): ElementNode | null {
  if (!node) return null;

  // Handle text nodes
  if (typeof node === 'string' || typeof node === 'number') {
    return {
      type: 'TextNode',
      props: { children: String(node) },
      children: [],
      style: {},
    };
  }

  // Handle element nodes
  if (node.type) {
    const children: ElementNode[] = [];

    if (node.props?.children) {
      const childArray = Array.isArray(node.props.children)
        ? node.props.children
        : [node.props.children];

      for (const child of childArray) {
        const childNode = convertToElementNode(child);
        if (childNode) {
          children.push(childNode);
        }
      }
    }

    // Also check node.children (from rendered tree)
    if (node.children && Array.isArray(node.children)) {
      for (const child of node.children) {
        const childNode = convertToElementNode(child);
        if (childNode) {
          children.push(childNode);
        }
      }
    }

    return {
      type: typeof node.type === 'string' ? node.type : node.type.name || 'Unknown',
      props: node.props || {},
      children,
      style: node.props?.style || {},
    };
  }

  return null;
}

/**
 * Renders a React component and converts it to an ElementNode tree
 */
export function renderToElementTree(component: ReactElement): ElementNode | null {
  const renderer = renderComponent(component);
  const tree = renderer.toJSON();

  return convertToElementNode(tree);
}
