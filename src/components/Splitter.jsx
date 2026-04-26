import React, { useState, useCallback, useEffect } from 'react';

const Splitter = ({ children, initialSplit = 50 }) => {
  const [split, setSplit] = useState(initialSplit);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;

    const container = document.querySelector('.main-content');
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const newSplit = ((e.clientX - containerRect.left) / containerRect.width) * 100;

    // Constrain between 20% and 80%
    if (newSplit >= 20 && newSplit <= 80) {
      setSplit(newSplit);
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const [leftChild, rightChild] = React.Children.toArray(children);

  return (
    <>
      <div style={{ flex: `0 0 ${split}%`, minWidth: 0}}>
        {leftChild}
      </div>
      <div
        className="splitter"
        onMouseDown={handleMouseDown}
        style={{ cursor: 'col-resize' }}
      />
      <div style={{ flex: `0 0 ${100 - split}%`, minWidth: 0}}>
        {rightChild}
      </div>
    </>
  );
};

export default Splitter;
