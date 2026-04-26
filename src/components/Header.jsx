import React from 'react';

const Header = ({
  columns,
  onColumnsChange,
  onExportPDF,
  fontSize,
  onFontSizeChange,
  onExportWorkspace,
  onImportWorkspace,
  onRestoreDefaults,
}) => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="title-group">
          <h1>Cheatsheet Editor</h1>
          <button
            className="refresh-btn"
            onClick={onRestoreDefaults}
            title="Restore default example content"
          >
            ↻
          </button>
        </div>
        <div className="column-selector">
          <button
            className={`column-btn ${columns === 1 ? 'active' : ''}`}
            onClick={() => onColumnsChange(1)}
            title="1 Column Layout"
          >
            1 Col
          </button>
          <button
            className={`column-btn ${columns === 2 ? 'active' : ''}`}
            onClick={() => onColumnsChange(2)}
            title="2 Column Layout"
          >
            2 Col
          </button>
          <button
            className={`column-btn ${columns === 3 ? 'active' : ''}`}
            onClick={() => onColumnsChange(3)}
            title="3 Column Layout"
          >
            3 Col
          </button>
        </div>
      </div>
      <div className="header-controls">
        <div className="font-size-controls">
          <span className="control-label">Font:</span>
          <button
            className="font-btn"
            onClick={() => onFontSizeChange(Math.max(7, fontSize - 1))}
            title="Decrease font size"
          >
            A-
          </button>
          <span className="font-size-display">{fontSize}px</span>
          <button
            className="font-btn"
            onClick={() => onFontSizeChange(Math.min(24, fontSize + 1))}
            title="Increase font size"
          >
            A+
          </button>
        </div>
        <button className="button secondary" onClick={onExportWorkspace} title="Save entire workspace to file">
          Backup
        </button>
        <button className="button secondary" onClick={onImportWorkspace} title="Load workspace from file">
          Restore
        </button>
        <button className="button success" onClick={onExportPDF}>
          Export PDF
        </button>
      </div>
    </header>
  );
};

export default Header;
