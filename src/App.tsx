import { useState, useEffect } from 'react';
import './App.css';
import { Editor } from './components/Editor';
import { StatusBar } from './components/StatusBar';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Note, STORAGE_KEY } from './types/note';

function App() {
  // ローカルストレージからメモを取得・保存
  const [note, setNote] = useLocalStorage<Note>(STORAGE_KEY, {
    content: '',
    updatedAt: new Date().toLocaleString('ja-JP'),
  });

  // メモの内容を更新
  const handleContentChange = (content: string) => {
    setNote({
      content,
      updatedAt: new Date().toLocaleString('ja-JP'),
    });
  };

  // 自動保存の状態表示用（オプション）
  const [isSaved, setIsSaved] = useState(true);

  // 自動保存のデバウンス処理
  useEffect(() => {
    setIsSaved(false);
    const timer = setTimeout(() => {
      setIsSaved(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [note.content]);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Browser Notepad</h1>
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

      <StatusBar characterCount={note.content.length} updatedAt={note.updatedAt} />
    </div>
  );
}

export default App;
