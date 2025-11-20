import { PrintNode } from '@thermal-print/core';
import { ESCPOSGenerator } from './generator';
import { TreeTraverser } from './traverser';
import { CommandAdapter, ESCPOSCommandAdapter, ESCBematechCommandAdapter } from './command-adapters';

/**
 * Options for converting PrintNodes to ESC/POS commands
 */
export interface PrintNodeToESCPOSOptions {
  paperWidth?: number; // Width in characters (default: 48 for 80mm thermal)
  encoding?: string; // Character encoding (default: 'utf-8')
  debug?: boolean; // Enable debug output
  cut?: boolean | 'full' | 'partial'; // Cut paper after printing (default: 'full')
  feedBeforeCut?: number; // Lines to feed before cutting (default: 3)
  commandAdapter?: CommandAdapter | 'escpos' | 'escbematech'; // Command protocol adapter (default: 'escpos')
}

/**
 * Create command adapter based on configuration
 */
function createCommandAdapter(config?: CommandAdapter | 'escpos' | 'escbematech'): CommandAdapter {
  // If no config provided, default to ESC/POS
  if (!config) {
    return new ESCPOSCommandAdapter();
  }

  // If it's already a CommandAdapter instance, return it
  if (typeof config === 'object' && 'getName' in config) {
    return config;
  }

  // If it's a string identifier, create the appropriate adapter
  if (config === 'escpos') {
    return new ESCPOSCommandAdapter();
  } else if (config === 'escbematech') {
    return new ESCBematechCommandAdapter();
  }

  // Default to ESC/POS if unknown
  return new ESCPOSCommandAdapter();
}

/**
 * Converts PrintNode tree to ESC/POS buffer
 *
 * This is the main entry point for @thermal-print/escpos.
 * Takes a universal PrintNode IR and converts it to ESC/POS commands.
 *
 * @param printNode - Root PrintNode of the tree to convert
 * @param options - Conversion options
 * @returns Buffer containing ESC/POS commands ready to be sent to printer
 *
 * @example
 * ```typescript
 * const printTree: PrintNode = {
 *   type: 'document',
 *   props: {},
 *   children: [
 *     {
 *       type: 'text',
 *       props: { children: 'Hello World' },
 *       children: [],
 *       style: { textAlign: 'center', fontSize: 20 }
 *     }
 *   ],
 *   style: {}
 * };
 *
 * const buffer = await printNodesToESCPOS(printTree, {
 *   paperWidth: 48,
 *   cut: 'full'
 * });
 * ```
 */
export async function printNodesToESCPOS(
  printNode: PrintNode,
  options?: PrintNodeToESCPOSOptions
): Promise<Buffer> {
  const {
    paperWidth = 48, // Default to 48 chars (80mm thermal)
    encoding = "utf-8",
    debug = false,
    cut = "full", // Default to full cut
    feedBeforeCut = 3, // Default to 3 lines feed before cut
    commandAdapter: commandAdapterConfig, // Command protocol adapter
  } = options || {};

  // Create command adapter (defaults to ESC/POS if not provided)
  const commandAdapter = createCommandAdapter(commandAdapterConfig);

  if (debug) {
    console.log(`Using command adapter: ${commandAdapter.getName()}`);
    console.log("\n========== PRINT NODE TREE (JSON) ==========");
    console.log(JSON.stringify(printNode, null, 2));
    console.log("============================================\n");
  }

  // Create ESC/POS generator with command adapter
  const generator = new ESCPOSGenerator(paperWidth, encoding, debug, commandAdapter);

  // Traverse tree and generate commands
  const traverser = new TreeTraverser(generator);
  await traverser.traverse(printNode);

  // Add cut command if requested
  if (cut !== false) {
    if (cut === "full") {
      generator.cutFullWithFeed(feedBeforeCut);
    } else if (cut === "partial" || cut === true) {
      generator.cutPartialWithFeed(feedBeforeCut);
    }
  }

  // Get final buffer
  const buffer = generator.getBuffer();

  return buffer;
}
