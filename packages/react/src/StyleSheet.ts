/**
 * StyleSheet utility for @thermal-print/react
 *
 * This is a pass-through implementation for compatibility with react-pdf code.
 * Since thermal printers don't need compiled stylesheets, we just return the styles as-is.
 */

export interface Styles {
  [key: string]: any;
}

export const StyleSheet = {
  /**
   * Creates a stylesheet object (pass-through - no compilation needed)
   *
   * @example
   * ```typescript
   * const styles = StyleSheet.create({
   *   header: { fontSize: 20, textAlign: 'center' },
   *   text: { fontSize: 12 }
   * });
   * ```
   */
  create<T extends Styles>(styles: T): T {
    return styles;
  },

  /**
   * Flattens an array of style objects into a single style object
   */
  flatten(styles: any[]): any {
    return Object.assign({}, ...styles.filter(Boolean));
  },

  /**
   * Composes multiple styles (alias for flatten)
   */
  compose(...styles: any[]): any {
    return this.flatten(styles);
  }
};
