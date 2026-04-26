# Cheatsheet Editor

A browser-based Markdown editor for creating print-ready coding reference sheets. Write in the left pane, see a live multi-column preview on the right, and export directly to PDF — no account or internet connection required.

**Live demo**: [https://SusieXU-WAW.github.io/cheatsheet-editor/](https://SusieXU-WAW.github.io/cheatsheet-editor/)

## Features

### Editor
- **CodeMirror 6 Editor**: Line numbers, active line highlighting, code folding, and line wrapping
- **Adjustable Font Size**: Increase or decrease font size (7px–24px) for both editor and preview
- **Draggable Separator**: Resize editor and preview panes by dragging the divider
- **Live Word Count**: Real-time word count displayed in the status bar

### Preview
- **Live Preview**: Real-time rendering of your Markdown as you type
- **Multi-Column Layout**: Switch between 1, 2, or 3 CSS column layouts — ideal for dense cheatsheets
- **Syntax Highlighting**: Code blocks highlighted via PrismJS across 14+ languages (JavaScript, TypeScript, Python, Java, C/C++, C#, Go, Rust, SQL, Bash, JSON, YAML, Markdown)
- **Math Rendering**: Inline (`$...$`) and block (`$$...$$`) LaTeX expressions rendered via KaTeX
- **Code Block Wrapping**: Code blocks wrap text instead of overflowing horizontally

### Content
- **Image Paste**: Paste screenshots or images from the clipboard directly into the editor; images are stored locally in IndexedDB — no uploads, no external URLs
- **GFM Support**: GitHub Flavored Markdown — tables, strikethrough, task lists, and more

### Storage & Export
- **Auto-Save**: Content, layout, and font size automatically persist in browser localStorage
- **Workspace Backup**: Export the full workspace (content + settings) to a dated JSON file
- **Workspace Restore**: Import a previously saved workspace file to resume where you left off
- **PDF Export**: Print the preview via the browser's native print dialog (File → Print → Save as PDF)
- **Offline-Ready**: Works entirely offline once loaded — no database, no user account, no server

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application starts at `http://localhost:5173/`

### Build for Production

```bash
npm run build
```

## Usage

1. **Choose Layout**: Click **1 Col**, **2 Col**, or **3 Col** to set the preview column count
2. **Write Markdown**: Type in the left editor pane — content auto-saves as you type
3. **Adjust View**: Drag the vertical separator or use **A-** / **A+** to resize
4. **Insert Images**: Paste any image from clipboard — it embeds automatically
5. **Save Your Work**: Click **Backup** to export a JSON workspace file to your computer
6. **Export PDF**: Click **Export PDF** to open the browser print dialog

### Math Syntax

| Syntax | Renders |
|--------|---------|
| `$E = mc^2$` | Inline math |
| `$$\sum_{i=1}^{n} x_i$$` | Block math |

## Project Structure

```
cheatsheet/
├── src/
│   ├── components/
│   │   ├── Editor.jsx       # CodeMirror editor with image paste
│   │   ├── Preview.jsx      # Markdown → HTML with KaTeX + Prism
│   │   ├── Header.jsx       # Toolbar and controls
│   │   └── Splitter.jsx     # Draggable pane divider
│   ├── utils/
│   │   └── imageStorage.js  # IndexedDB image persistence
│   ├── styles/
│   │   └── App.css
│   ├── App.jsx
│   └── main.jsx
├── .github/workflows/
│   └── deploy.yml           # Auto-deploy to GitHub Pages on push
├── index.html
├── vite.config.js
└── package.json
```

## Tech Stack

| Layer | Library |
|-------|---------|
| Framework | React 19 + Vite |
| Editor | CodeMirror 6 (`@uiw/react-codemirror`) |
| Markdown | `marked` + GFM |
| Math | KaTeX |
| Syntax highlight | PrismJS |
| PDF | Browser print API |
| Image storage | IndexedDB |
| XSS protection | DOMPurify |

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for GitHub Pages deployment instructions.

## License

ISC
