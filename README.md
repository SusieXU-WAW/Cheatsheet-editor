# Cheatsheet Editor

A modern, feature-rich cheatsheet editor for developers. Create, edit, and export beautiful coding reference sheets with markdown support, multi-column layouts, and professional PDF output.

## Features

- **Single Editor View**: Edit one column at a time with column selector buttons
- **Draggable Separator**: Resize editor and preview panes by dragging the separator
- **Column Selector**: Quickly switch between editing different columns
- **Adjustable Font Size**: Increase or decrease font size for both editor and preview
- **Code Block Wrapping**: Code blocks wrap text instead of horizontal scrolling
- **Smooth Scrolling**: Smooth scroll behavior in both editor and preview panes
- **Live Preview**: Real-time rendering of all columns side-by-side
- **Multi-Column Layouts**: Switch between 1, 2, or 3 column layouts with independent content
- **PDF Export**: Generate high-quality PDF files
- **Auto-Save**: Automatically saves all columns to browser localStorage
- **Workspace Backup/Restore**: Save entire workspace (all columns + settings) to a JSON file on your computer
- **Persistent Storage**: Your work is preserved across browser sessions (refresh, close, reopen)
- **Syntax Highlighting**: Support for 15+ programming languages
- **Offline-Ready**: Works completely offline once loaded (no database or user account needed)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will start at `http://localhost:5173/`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Deploy to GitHub Pages

See [QUICKSTART.md](./QUICKSTART.md) for a quick deployment guide, or [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Usage

### Basic Workflow

1. **Choose Layout**: Click "1 Column", "2 Columns", or "3 Columns" to select your layout
2. **Select Column to Edit**: Click "Col 1", "Col 2", or "Col 3" buttons to choose which column to edit
3. **Write Content**: Edit the selected column in the left pane
   - Content auto-saves to browser storage as you type
   - Scroll down to see more content
4. **Adjust View**:
   - Drag the vertical separator to resize editor and preview panes
   - Use A- and A+ buttons to adjust font size
5. **Preview**: The right pane shows live preview of all columns side-by-side
   - Scroll to view long content
6. **Save Your Work**:
   - **Recommended**: Click "Backup" to save workspace to your computer
   - Or use "Export PDF" for a printable version
7. **Return Later**: Your work persists in browser storage - just reopen the page!

### Markdown Support

The editor supports standard markdown syntax:

- Headers (`#`, `##`, `###`)
- Lists (ordered and unordered)
- Code blocks with syntax highlighting
- Tables
- Links and images
- Blockquotes
- Horizontal rules
- Inline code

### Saving and Loading

#### Auto-Save (Browser Storage)
- Your work is **automatically saved** to browser localStorage as you type
- Data persists across:
  - Page refreshes
  - Browser restarts
  - Computer shutdowns
- No internet connection required
- No user account or database needed

#### Workspace Backup/Restore (Recommended)
- **Backup**: Click "Backup" to save your entire workspace to a JSON file on your computer
  - Includes all 3 columns (even hidden ones)
  - Saves all settings (font size, column layout, current column)
  - File format: `cheatsheet-workspace-YYYY-MM-DD.json`
- **Restore**: Click "Restore" to load a previously saved workspace
  - Select a `.json` workspace file
  - Instantly restores all content and settings
- **Use Case**: Create backups before major changes, share workspaces, or work on multiple devices

## Project Structure

```
cheatsheet/
├── src/
│   ├── components/
│   │   ├── Editor.jsx       # Markdown editor component
│   │   ├── Preview.jsx      # Live preview component
│   │   └── Header.jsx       # Header with controls
│   ├── styles/
│   │   └── App.css          # Application styles
│   ├── App.jsx              # Main application component
│   └── main.jsx             # Application entry point
├── public/                   # Static assets
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

## License

ISC

