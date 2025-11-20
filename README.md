# @thermal-print

A modular TypeScript library suite for thermal printing with clean, standalone architecture.

## 🎯 Architecture Overview

```
React Components → PrintNode (IR) → ESC/POS Buffer → Thermal Printer
```

**Clean separation of concerns:**

- **@thermal-print/core** - Universal `PrintNode` intermediate representation (IR)
- **@thermal-print/react** - React components + PrintNode converter
- **@thermal-print/escpos** - PrintNode → ESC/POS buffer converter

## 📦 Packages

### [@thermal-print/react](./packages/react) - React Components

The main package you'll use. Provides React components optimized for thermal printers.

```bash
pnpm add @thermal-print/react
```

**Exports:**

- Components: `Document`, `Page`, `View`, `Text`, `Image`
- Utilities: `StyleSheet`, `Font`, `Preview`
- Functions: `convertToESCPOS()`, `convertToPrintNodes()`

### [@thermal-print/escpos](./packages/escpos) - ESC/POS Converter

Converts PrintNode trees to ESC/POS commands.

```bash
pnpm add @thermal-print/escpos
```

### [@thermal-print/core](./packages/core) - Core Types

Shared type definitions (PrintNode, styles).

```bash
pnpm add @thermal-print/core
```

## 🚀 Quick Start

### Basic Receipt

```typescript
import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  convertToESCPOS,
} from "@thermal-print/react";

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

function Receipt() {
  return (
    <Document>
      <Page>
        <Text style={styles.header}>MY STORE</Text>

        <View style={{ borderBottom: "1px solid black" }} />

        <View style={styles.row}>
          <Text>Coffee</Text>
          <Text>\$3.50</Text>
        </View>

        <View style={styles.row}>
          <Text style={{ fontWeight: "bold" }}>Total</Text>
          <Text style={{ fontWeight: "bold" }}>\$3.50</Text>
        </View>
      </Page>
    </Document>
  );
}

// Convert to ESC/POS and print
const buffer = await convertToESCPOS(<Receipt />, {
  paperWidth: 48,
  cut: "full",
});

await printer.write(buffer);
```

### With Preview Component

```typescript
import { Preview } from "@thermal-print/react";

function App() {
  return (
    <div>
      <h1>Receipt Preview</h1>

      <Preview paperWidth={48} showRuler>
        <Document>
          <Page>
            <Text>This is how it will print!</Text>
          </Page>
        </Document>
      </Preview>
    </div>
  );
}
```

### Advanced: Manipulate PrintNode IR

```typescript
import { convertToPrintNodes } from "@thermal-print/react";
import { printNodesToESCPOS } from "@thermal-print/escpos";

// Step 1: React → PrintNode IR
let printNode = convertToPrintNodes(<Receipt />);

// Step 2: Manipulate IR (add watermark, filter, etc.)
printNode = {
  ...printNode,
  children: [
    ...printNode.children,
    {
      type: "text",
      props: { children: "COPY - NOT ORIGINAL" },
      children: [],
      style: { textAlign: "center", fontSize: 12 },
    },
  ],
};

// Step 3: PrintNode → ESC/POS
const buffer = await printNodesToESCPOS(printNode, {
  paperWidth: 48,
  commandAdapter: "escbematech", // or 'escpos'
});
```

## 📖 Component API

### Document

Root wrapper for thermal printer documents.

```typescript
<Document>
  <Page>...</Page>
</Document>
```

### Page

Semantic page wrapper (thermal printers print continuously).

```typescript
<Page style={{ padding: 20 }}>
  <Text>Content</Text>
</Page>
```

### View

Layout container with flexbox support.

```typescript
// Column layout (default)
<View style={{ padding: 10 }}>
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</View>

// Row layout
<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
  <Text>Left</Text>
  <Text>Right</Text>
</View>
```

### Text

Text content with styling.

```typescript
<Text style={{ fontSize: 20, textAlign: "center", fontWeight: "bold" }}>
  Hello World
</Text>
```

**Font size mapping:**

- 8-12px → 1x1 (normal)
- 13-18px → 1x2 (double height)
- 19-24px → 2x1 (double width)
- 25+px → 2x2 (double both)

### Image

Images (converted to monochrome).

```typescript
<Image src="data:image/png;base64,..." style={{ textAlign: "center" }} />
```

### StyleSheet

Pass-through utility for style organization.

```typescript
const styles = StyleSheet.create({
  header: { fontSize: 20 },
  text: { fontSize: 12 },
});
```

### Font

No-op for thermal printers (reserved for future PDF export).

```typescript
Font.register({
  family: "Roboto",
  fonts: [{ src: "https://..." }],
});
```

## 🔮 Future Printer Support

The clean architecture makes it easy to add new formats:

- **@thermal-print/star** - Star Micronics printers
- **@thermal-print/zpl** - Zebra label printers
- **@thermal-print/epson** - Epson TM-series

All will consume the same `PrintNode` IR! 🎉

## 🛠 Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm run build

# Build specific package
pnpm run build:react

# Clean
pnpm run clean
```

## 📝 No More @react-pdf/renderer!

This library is now **fully standalone** - no dependency on `@react-pdf/renderer`.

**Migration:**

```typescript
// Before
import { Document, Page, Text } from "@react-pdf/renderer";
import { convertToESCPOS } from "@thermal-print/react";

// After - Just change the import!
import { Document, Page, Text, convertToESCPOS } from "@thermal-print/react";
```

## 📄 License

MIT © Gabriel Martinusso

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.
