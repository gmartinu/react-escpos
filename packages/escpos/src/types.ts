/**
 * ESC/POS-specific type definitions
 */

export interface ESCPOSCommand {
  type: 'raw' | 'text' | 'feed' | 'cut' | 'image' | 'qr';
  data?: any;
  buffer?: Buffer;
}

export interface ConversionContext {
  paperWidth: number;
  currentAlign: 'left' | 'center' | 'right';
  currentSize: { width: number; height: number };
  currentBold: boolean;
  encoding: string;
  debug: boolean;
  buffer: Buffer[];
}
