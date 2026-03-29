import { useState, useEffect, useRef } from 'react';
import './App.css';
import { Editor } from './components/Editor';
import { StatusBar } from './components/StatusBar';
import { TabBar } from './components/TabBar';
import type { TabId, NotesState } from './types/note';
import { getCharacterCount } from './utils/string';
import { loadNotesState, saveNotesState } from './utils/storage';

function App() {
  // ローカルストレージからデータ読み込み（マイグレーション含む）
  const [notesState, setNotesState] = useState<NotesState>(loadNotesState);

  // ストレージへの同期
  useEffect(() => {
    saveNotesState(notesState);
  }, [notesState]);

  const activeTab = notesState.activeTabId;
  const activeNote = notesState.tabs[activeTab];

  // タブ切り替え
  const handleTabChange = (tabId: TabId) => {
    setNotesState((prev) => ({ ...prev, activeTabId: tabId }));
  };

  // メモの内容を更新
  const handleContentChange = (content: string) => {
    setIsSaved(false);
    setNotesState((prev) => ({
      ...prev,
      tabs: {
        ...prev.tabs,
        [prev.activeTabId]: {
          content,
          updatedAt: new Date().toLocaleString('ja-JP'),
        },
      },
    }));
  };

  // 自動保存の状態表示
  const [isSaved, setIsSaved] = useState(true);
  const saveTimerRef = useRef<number | undefined>(undefined);

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
  }, [activeNote.content, isSaved]);

  // タブ切り替え時に保存状態をリセット
  useEffect(() => {
    setIsSaved(true);
  }, [activeTab]);

  // タブの内容をTabBarに渡す用のマップ
  const tabContents = Object.fromEntries(
    Object.entries(notesState.tabs).map(([id, note]) => [id, note.content])
  ) as Record<TabId, string>;

  return (
    <div className={`app app-theme-${activeTab}`}>
      <header className="app-header">
        <h1 className="app-title">
          Browser Notepad <span className="app-version">v0.2.0</span>
        </h1>
        <div className="app-status">
          {isSaved ? (
            <span className="saved-indicator">✓ 保存済み</span>
          ) : (
            <span className="saving-indicator">保存中...</span>
          )}
        </div>
      </header>

      <TabBar
        activeTabId={activeTab}
        tabContents={tabContents}
        onTabChange={handleTabChange}
      />

      <main className="app-main">
        <Editor content={activeNote.content} onChange={handleContentChange} />
      </main>

      <StatusBar characterCount={getCharacterCount(activeNote.content)} updatedAt={activeNote.updatedAt} />
    </div>
  );
}

export default App;
