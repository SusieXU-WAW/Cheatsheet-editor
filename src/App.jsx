import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import Header from './components/Header';
import Editor from './components/Editor';
import Preview from './components/Preview';
import Splitter from './components/Splitter';

const DEFAULT_CONTENT = `# Cheatsheet Editor - Quick Start

Welcome to the Cheatsheet Editor! This guide will help you create your first cheatsheet.

## Getting Started
`;

const STORAGE_KEY = 'cheatsheet-content';
const COLUMNS_KEY = 'cheatsheet-columns';
const FONT_SIZE_KEY = 'cheatsheet-font-size';

function App() {
  const [content, setContent] = useState('');
  const [columns, setColumns] = useState(2);
  const [fontSize, setFontSize] = useState(14);
  const [wordCount, setWordCount] = useState(0);

  // Load from localStorage on mount
  useEffect(() => {
    const savedColumns = localStorage.getItem(COLUMNS_KEY);
    const savedContent = localStorage.getItem(STORAGE_KEY);
    const savedFontSize = localStorage.getItem(FONT_SIZE_KEY);

    if (savedContent) {
      setContent(savedContent);
    } else {
      setContent(DEFAULT_CONTENT);
    }

    if (savedColumns) {
      setColumns(parseInt(savedColumns, 10));
    }

    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize, 10));
    }
  }, []);

  // Auto-save to localStorage and calculate word count
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, content);

    // Calculate word count
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    setWordCount(words);
  }, [content]);

  useEffect(() => {
    localStorage.setItem(COLUMNS_KEY, columns.toString());
  }, [columns]);

  useEffect(() => {
    localStorage.setItem(FONT_SIZE_KEY, fontSize.toString());
  }, [fontSize]);

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleColumnsChange = (newColumns) => {
    setColumns(newColumns);
  };

  const handleExportPDF = () => {
    // 直接用浏览器的打印（可以另存为 PDF）
    window.print();
  };
  // const handleExportPDF = () => {
  //   const element = document.querySelector('.preview-wrapper');
  //   if (!element) {
  //     alert('Preview is not ready yet.');
  //     return;
  //   }

  //   const width = element.scrollWidth || window.innerWidth;

  //   const opt = {
  //     margin: [0.05, 0.05, 0.05, 0.05],
  //     filename: 'cheatsheet.pdf',
  //     image: { type: 'png', quality: 1 },
  //     html2canvas: {
  //       scale: 4,
  //       useCORS: true,
  //       letterRendering: true,
  //       logging: false,
  //       dpi: 300,
  //       backgroundColor: '#ffffff',
  //       removeContainer: true,
  //       imageTimeout: 0,
  //       allowTaint: true,
  //       foreignObjectRendering: false,
  //       //windowWidth: width,
  //     },
  //     jsPDF: {
  //       unit: 'in',
  //       format: 'letter',
  //       orientation: 'portrait',
  //       compress: false,
  //       precision: 16,
  //     },
  //     pagebreak: {
  //       mode: ['css', 'legacy'],
  //       avoid: ['table', 'tr', 'img', 'blockquote'],
  //     },
  //   };

  //   html2pdf().set(opt).from(element).save();
  // };


  const handleSave = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cheatsheet.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoad = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.txt';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setContent(event.target.result);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExportWorkspace = () => {
    const workspace = {
      version: '2.0',
      timestamp: new Date().toISOString(),
      columns: columns,
      fontSize: fontSize,
      content: content,
    };

    const blob = new Blob([JSON.stringify(workspace, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cheatsheet-workspace-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportWorkspace = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const workspace = JSON.parse(event.target.result);
            if (workspace.version === '2.0' && workspace.content !== undefined) {
              setContent(workspace.content);
              setColumns(workspace.columns || 2);
              setFontSize(workspace.fontSize || 14);
              alert('Workspace loaded successfully!');
            } else if (workspace.version && workspace.columnContents) {
              // Backward compatibility with old format
              const combinedContent = workspace.columnContents.join('\n\n');
              setContent(combinedContent);
              setColumns(workspace.columns || 2);
              setFontSize(workspace.fontSize || 14);
              alert('Workspace loaded successfully! (Converted from old format)');
            } else {
              alert('Invalid workspace file format');
            }
          } catch (error) {
            alert('Error loading workspace file');
            console.error(error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleNewWorkspace = () => {
    if (confirm('This will clear all your current work. Are you sure?')) {
      setContent('');
      setColumns(2);
      setFontSize(14);
      localStorage.clear();
    }
  };

  const handleRestoreDefaults = () => {
    if (confirm('This will restore the default example content. Continue?')) {
      setContent(DEFAULT_CONTENT);
      setColumns(2);
      setFontSize(14);
      // Update localStorage with defaults
      localStorage.setItem(STORAGE_KEY, DEFAULT_CONTENT);
      localStorage.setItem(COLUMNS_KEY, '2');
      localStorage.setItem(FONT_SIZE_KEY, '14');
    }
  };

  return (
    <div className="app">
      <Header
        columns={columns}
        onColumnsChange={handleColumnsChange}
        onExportPDF={handleExportPDF}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        onExportWorkspace={handleExportWorkspace}
        onImportWorkspace={handleImportWorkspace}
        onRestoreDefaults={handleRestoreDefaults}
      />
      <main className="main-content">
        <Splitter>
          <Editor
            value={content}
            onChange={handleContentChange}
            fontSize={fontSize}
          />
          <Preview
            content={content}
            columns={columns}
            fontSize={fontSize}
          />
        </Splitter>
      </main>
      <footer className="footer">
        <div className="status">
          <span>Words: {wordCount}</span>
          <span>Auto-saved</span>
        </div>
        <div>Cheatsheet Editor v2.0</div>
      </footer>
    </div>
  );
}

export default App;
