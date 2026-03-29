import React, { useEffect, useRef } from 'react';
import './Editor.css';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

/**
 * テキストエディタコンポーネント
 */
export const Editor: React.FC<EditorProps> = ({ content, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pendingCaretPositionRef = useRef<number | null>(null);

  useEffect(() => {
    if (pendingCaretPositionRef.current === null || !textareaRef.current) {
      return;
    }

    const nextCaretPosition = pendingCaretPositionRef.current;
    textareaRef.current.setSelectionRange(nextCaretPosition, nextCaretPosition);
    pendingCaretPositionRef.current = null;
  }, [content]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter' || e.nativeEvent.isComposing) {
      return;
    }

    const textarea = e.currentTarget;
    const { value, selectionStart, selectionEnd } = textarea;
    const lineStart = value.lastIndexOf('\n', Math.max(0, selectionStart - 1)) + 1;
    const currentLinePrefix = value.slice(lineStart, selectionStart);
    const indentMatch = currentLinePrefix.match(/^[\t ]+/);
    const indent = indentMatch?.[0] ?? '';
    const insertedText = `\n${indent}`;

    e.preventDefault();

    const nextValue =
      value.slice(0, selectionStart) + insertedText + value.slice(selectionEnd);
    pendingCaretPositionRef.current = selectionStart + insertedText.length;
    onChange(nextValue);
  };

  return (
    <div className="editor-container">
      <textarea
        ref={textareaRef}
        className="editor-textarea"
        value={content}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="ここにメモを入力してください..."
        spellCheck={false}
      />
    </div>
  );
};
