import type { NotesState } from '../types/note';
import { createInitialState, STORAGE_KEY } from '../types/note';

/**
 * 旧データ形式（v1: 単一メモ）
 */
interface LegacyNote {
  content: string;
  updatedAt: string;
}

/**
 * ストレージデータが旧形式（v1）かどうかを判定
 */
function isLegacyNote(data: unknown): data is LegacyNote {
  return (
    typeof data === 'object' &&
    data !== null &&
    'content' in data &&
    'updatedAt' in data &&
    !('version' in data)
  );
}

/**
 * ストレージデータが新形式（v2）かどうかを判定
 */
function isNotesState(data: unknown): data is NotesState {
  return (
    typeof data === 'object' &&
    data !== null &&
    'version' in data &&
    (data as NotesState).version === 2 &&
    'tabs' in data &&
    'activeTabId' in data
  );
}

/**
 * 旧形式のデータを新形式に変換する
 * 既存の単一メモは common タブに移行
 */
function migrateLegacyNote(legacy: LegacyNote): NotesState {
  const state = createInitialState();
  state.tabs.common = {
    content: legacy.content,
    updatedAt: legacy.updatedAt,
  };
  return state;
}

/**
 * ローカルストレージからデータを読み込み、必要に応じてマイグレーションを実行
 */
export function loadNotesState(): NotesState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createInitialState();
    }

    const parsed: unknown = JSON.parse(raw);

    if (isNotesState(parsed)) {
      return parsed;
    }

    if (isLegacyNote(parsed)) {
      const migrated = migrateLegacyNote(parsed);
      // マイグレーション後に即保存し、旧形式を上書き
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }

    // 不明な形式の場合は初期化
    return createInitialState();
  } catch {
    return createInitialState();
  }
}

/**
 * NotesState をローカルストレージに保存
 */
export function saveNotesState(state: NotesState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}
