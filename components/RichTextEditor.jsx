import React, { useRef, useEffect } from 'react';
import { theme } from '@/styles/theme';

const RichTextEditor = ({ value = '', onChange, placeholder }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && value && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = (e) => {
    onChange(e.currentTarget.innerHTML);
  };

  const applyFormat = (command, val = null) => {
    document.execCommand(command, false, val);
    editorRef.current?.focus();
  };

  return (
    <div style={{ border: `1px solid ${theme.colors.border}`, borderRadius: theme.borderRadius.sm, overflow: 'hidden' }}>
      <div style={{
        display: 'flex',
        gap: '4px',
        padding: '8px',
        backgroundColor: '#f3f4f6',
        borderBottom: `1px solid ${theme.colors.border}`
      }}>
        <button 
          onClick={() => applyFormat('bold')} 
          style={{ padding: '4px 8px', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }} 
          title="Bold"
        >
          B
        </button>
        <button 
          onClick={() => applyFormat('italic')} 
          style={{ padding: '4px 8px', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }} 
          title="Italic"
        >
          I
        </button>
        <button 
          onClick={() => applyFormat('underline')} 
          style={{ padding: '4px 8px', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }} 
          title="Underline"
        >
          U
        </button>
        <button 
          onClick={() => applyFormat('insertUnorderedList')} 
          style={{ padding: '4px 8px', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }} 
          title="Bullet List"
        >
          •
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        suppressContentEditableWarning
        style={{
          padding: '12px',
          minHeight: '80px',
          outline: 'none',
          fontSize: '13px',
          fontFamily: 'Inter, -apple-system, sans-serif',
          color: '#0a0a0a',
          backgroundColor: '#ffffff'
        }}
      />
    </div>
  );
};

export default RichTextEditor;