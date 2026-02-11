import React from 'react';
import './Editor.css';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

/**
 * テキストエディタコンポーネント
 */
export const Editor: React.FC<EditorProps> = ({ content, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="editor-container">
      <textarea
        className="editor-textarea"
        value={content}
        onChange={handleChange}
        placeholder="ここにメモを入力してください..."
        spellCheck={false}
      />
    </div>
  );
};
