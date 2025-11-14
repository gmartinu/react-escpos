# react-escpos

Convert React components (especially `@react-pdf/renderer` components) directly to ESC/POS thermal printer commands.

[![npm version](https://img.shields.io/npm/v/react-escpos.svg)](https://www.npmjs.com/package/react-escpos)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🚀 **Direct conversion** from React components to ESC/POS commands
- ⚡ **Faster printing** - no PDF generation overhead
- 🎨 **Better thermal printer compatibility** - native ESC/POS commands
- 📦 **Smaller output size** - raw ESC/POS vs PDF
- 🌍 **Portuguese support** - built-in CP860 encoding
- 🔧 **Flexible** - works with any React component structure
- 📱 **TypeScript** - fully typed for better DX

## Why react-escpos?

Traditional workflow for thermal printing with React:

```
React → PDF → Print PDF → Thermal Printer
```

With react-escpos:

```
React → ESC/POS → Thermal Printer ✨
```

**Benefits:**

- No PDF rendering engine needed
- Direct thermal printer features (QR codes, cuts, encoding)
- Faster execution and smaller output
- Better control over printer behavior

## Installation

```bash
npm install react-escpos
# or
yarn add react-escpos
```

### Peer Dependencies

```bash
npm install react @react-pdf/renderer
```

## Quick Start

```typescript
import { convertToESCPOS } from "react-escpos";
import { Document, Page, View, Text } from "@react-pdf/renderer";
import fs from "fs";

// Define your receipt component
const Receipt = ({ data }) => (
  <Document>
    <Page size="A4">
      <View>
        <Text style={{ textAlign: "center", fontWeight: "bold" }}>
          My Store
        </Text>
        <Text>Receipt #12345</Text>
        <View style={{ borderBottom: "1px solid black" }} />
        <Text>Total: ${data.total}</Text>
      </View>
    </Page>
  </Document>
);

// Convert to ESC/POS
const buffer = await convertToESCPOS(<Receipt data={{ total: 99.99 }} />, {
  paperWidth: 48, // 80mm thermal (48 chars)
  encoding: "utf-8",
  cut: "full",
  feedBeforeCut: 3,
});

// Save for testing or send to printer
fs.writeFileSync("receipt.bin", buffer);
```

## API Reference

### `convertToESCPOS(component, options?)`

Converts a React component to ESC/POS commands.

**Parameters:**

- `component` (ReactElement) - React component to convert (typically `@react-pdf/renderer` component)
- `options` (ConversionOptions) - Optional configuration

**Options:**

```typescript
interface ConversionOptions {
  paperWidth?: number; // Width in characters (default: 48 for 80mm)
  encoding?: string; // Character encoding (default: 'utf-8')
  debug?: boolean; // Enable debug output (default: false)
  cut?: boolean | "full" | "partial"; // Paper cutting (default: 'full')
  feedBeforeCut?: number; // Lines to feed before cut (default: 3)
}
```

**Returns:** `Promise<Buffer>` - ESC/POS command buffer ready to send to printer

## Supported Elements

### Text

Text content with styling (bold, size, alignment):

```tsx
<Text
  style={{
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  }}
>
  Hello World
</Text>
```

### View

Container with flexbox-like layout:

```tsx
<View
  style={{
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: "1px solid black",
  }}
>
  <Text>Item</Text>
  <Text>$10.00</Text>
</View>
```

### Document & Page

Top-level containers (automatically handled).

## Supported Styles

### Text Styles

- `fontSize`: Mapped to ESC/POS text sizes (normal, double-width, double-height, quad)
- `fontWeight`: `'bold'` → ESC/POS bold
- `textAlign`: `'left' | 'center' | 'right'`

### View Styles

- `flexDirection`: `'row' | 'column'` (affects layout)
- `justifyContent`: `'space-between'` (special handling for receipts)
- `borderBottom` / `borderTop`: Divider lines (solid/dashed)
- `padding` / `margin`: Spacing (converted to line feeds)
- `width`: Column width (percentage or fixed)

## Common Use Cases

### Receipt with Header

```tsx
const Receipt = ({ data }) => (
  <Document>
    <Page>
      <View>
        <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 20 }}>
          {data.storeName}
        </Text>
        <Text style={{ textAlign: "center" }}>{data.address}</Text>
        <View style={{ borderBottom: "1px solid black" }} />

        {data.items.map((item) => (
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text>{item.name}</Text>
            <Text>${item.price.toFixed(2)}</Text>
          </View>
        ))}

        <View style={{ borderTop: "1px solid black" }} />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontWeight: "bold" }}>TOTAL</Text>
          <Text style={{ fontWeight: "bold" }}>${data.total.toFixed(2)}</Text>
        </View>
      </View>
    </Page>
  </Document>
);
```

### Table Layout

```tsx
<View style={{ flexDirection: "row" }}>
  <View style={{ width: "50%" }}>
    <Text>Product A</Text>
  </View>
  <View style={{ width: "25%" }}>
    <Text style={{ textAlign: "center" }}>2</Text>
  </View>
  <View style={{ width: "25%" }}>
    <Text style={{ textAlign: "right" }}>$20.00</Text>
  </View>
</View>
```

## Paper Widths

Common thermal printer widths:

| Printer Width | Characters | `paperWidth` |
| ------------- | ---------- | ------------ |
| 58mm          | 32 chars   | `32`         |
| 80mm          | 48 chars   | `48` ✓       |
| 112mm         | 64 chars   | `64`         |

## Character Encoding

The library uses **CP860** encoding by default, which supports Brazilian Portuguese special characters:

- ç Ç á é í ó ú à ã õ â ê ô

Common characters are automatically handled. Unsupported characters are replaced with `?`.

## Paper Cutting

Control paper cutting behavior:

```typescript
// Full cut
await convertToESCPOS(<Receipt />, { cut: "full" });

// Partial cut (perforated)
await convertToESCPOS(<Receipt />, { cut: "partial" });

// No cut
await convertToESCPOS(<Receipt />, { cut: false });

// Custom feed before cut
await convertToESCPOS(<Receipt />, {
  cut: "full",
  feedBeforeCut: 5, // 5 lines
});
```

## Advanced Usage

### Using ESC/POS Generator Directly

```typescript
import { ESCPOSGenerator } from "react-escpos";

const generator = new ESCPOSGenerator(48, "utf-8", false);

generator.initialize();
generator.setAlign("center");
generator.setBold(true);
generator.addText("Hello World");
generator.addNewline();
generator.addDivider(false);
generator.cutFullWithFeed(3);

const buffer = generator.getBuffer();
```

### QR Codes

```typescript
generator.addQRCode("https://example.com", 6);
```

## Sending to Printer

After generating the ESC/POS buffer, send it to your printer:

### Node.js (USB/Serial)

```typescript
import { SerialPort } from "serialport";

const port = new SerialPort({ path: "/dev/usb/lp0", baudRate: 9600 });
port.write(buffer);
```

### Electron (IPC)

```typescript
// Main process
ipcMain.handle("print", async (event, buffer) => {
  // Send to printer
});

// Renderer
const buffer = await convertToESCPOS(<Receipt />);
ipcRenderer.invoke("print", buffer);
```

### Network Printer

```typescript
import net from "net";

const socket = net.connect({ host: "192.168.1.100", port: 9100 });
socket.write(buffer);
socket.end();
```

## Limitations

- ❌ Images not fully supported (placeholder implementation)
- ❌ Complex nested layouts may not translate perfectly
- ❌ Font sizes are approximated to ESC/POS sizes
- ⚠️ Printer-specific features may vary

## TypeScript Support

Fully typed for TypeScript projects:

```typescript
import {
  convertToESCPOS,
  ConversionOptions,
  ESCPOSGenerator,
} from "react-escpos";
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © gmartinu

## Related Projects

- [@react-pdf/renderer](https://github.com/diegomura/react-pdf) - Create PDFs using React
- [escpos](https://github.com/song940/node-escpos) - ESC/POS printer library for Node.js

## Support

- 🐛 [Report issues](https://github.com/gmartinu/react-escpos/issues)
- 💬 [Discussions](https://github.com/gmartinu/react-escpos/discussions)
- 📧 Contact: gabmartinu@gmail.com

---

Made with ❤️ by gmartinu
