import React, { useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { EditorView } from '@codemirror/view';
import { saveImage } from '../utils/imageStorage';

const Editor = ({ value, onChange, fontSize = 12 }) => {
  const editorRef = useRef(null);

  const fontSizeTheme = EditorView.theme({
    '&': {
      fontSize: `${fontSize}px`,
    },
    '.cm-content': {
      fontSize: `${fontSize}px`,
    },
  });

  const handlePaste = async (event) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        event.preventDefault();
        const blob = items[i].getAsFile();
        const reader = new FileReader();

        reader.onload = async (e) => {
          const base64 = e.target.result;

          // Generate a unique ID for this image
          const imageId = `img${Date.now()}`;

          try {
            // Save image to IndexedDB
            console.log('Saving image to IndexedDB:', imageId);
            await saveImage(imageId, base64);
            console.log('Image saved successfully:', imageId);

            // Use a custom URL scheme that we'll intercept in the Preview
            const imageMarkdown = `![Pasted Image](indexeddb://${imageId})`;

            // Get the current editor view
            const view = editorRef.current?.view;
            if (view) {
              const { from } = view.state.selection.main;
              view.dispatch({
                changes: { from, insert: imageMarkdown }
              });
            } else {
              // Fallback: append to current value
              onChange(value + imageMarkdown);
            }
          } catch (error) {
            console.error('Failed to save image:', error);
            alert('Failed to save image. Please try again.');
          }
        };

        reader.readAsDataURL(blob);
        break;
      }
    }
  };

  return (
    <div className="editor-pane">
      <div className="pane-header">Markdown Editor</div>
      <div
        className="editor-container"
        onPaste={handlePaste}
      >
        <CodeMirror
          ref={editorRef}
          value={value}
          maxHeight="100%"
          extensions={[markdown(), fontSizeTheme, EditorView.lineWrapping]}
          onChange={onChange}
          theme="light"
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightActiveLine: true,
            foldGutter: true,
          }}
        />
      </div>
    </div>
  );
};

export default Editor;
