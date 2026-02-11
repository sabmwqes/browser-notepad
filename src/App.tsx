import { useState, useEffect, useRef } from 'react';
import './App.css';
import { Editor } from './components/Editor';
import { StatusBar } from './components/StatusBar';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Note } from './types/note';
import { STORAGE_KEY } from './types/note';
import { getCharacterCount } from './utils/string';

function App() {
  // ローカルストレージからメモを取得・保存
  const [note, setNote] = useLocalStorage<Note>(STORAGE_KEY, {
    content: '',
    updatedAt: new Date().toLocaleString('ja-JP'),
  });

  // メモの内容を更新
  const handleContentChange = (content: string) => {
    setIsSaved(false);
    setNote({
      content,
      updatedAt: new Date().toLocaleString('ja-JP'),
    });
  };

  // 自動保存の状態表示用（オプション）
  const [isSaved, setIsSaved] = useState(true);
  const saveTimerRef = useRef<number | undefined>(undefined);

  // 自動保存のデバウンス処理
  useEffect(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    if (!isSaved) {
      saveTimerRef.current = window.setTimeout(() => {
        setIsSaved(true);
      }, 500);
    }

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [note.content, isSaved]);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">
          Browser Notepad <span className="app-version">v0.1.1</span>
        </h1>
        <div className="app-status">
          {isSaved ? (
            <span className="saved-indicator">✓ 保存済み</span>
          ) : (
            <span className="saving-indicator">保存中...</span>
          )}
        </div>
      </header>

      <main className="app-main">
        <Editor content={note.content} onChange={handleContentChange} />
      </main>

      <StatusBar characterCount={getCharacterCount(note.content)} updatedAt={note.updatedAt} />
    </div>
  );
}

export default App;
