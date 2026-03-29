/**
 * タブID（レアリティ）
 */
export type TabId = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

/**
 * タブ定義
 */
export interface TabDefinition {
  id: TabId;
  label: string;
  letter: string;
}

/**
 * 固定の6タブ定義
 */
export const TAB_DEFINITIONS: readonly TabDefinition[] = [
  { id: 'common', label: 'Common', letter: 'C' },
  { id: 'uncommon', label: 'Uncommon', letter: 'U' },
  { id: 'rare', label: 'Rare', letter: 'R' },
  { id: 'epic', label: 'Epic', letter: 'E' },
  { id: 'legendary', label: 'Legendary', letter: 'L' },
  { id: 'mythic', label: 'Mythic', letter: 'M' },
] as const;

/**
 * 個別メモの型定義
 */
export interface Note {
  content: string;
  updatedAt: string;
}

/**
 * 全タブのデータ（ストレージ保存形式）
 */
export interface NotesState {
  version: 2;
  activeTabId: TabId;
  tabs: Record<TabId, Note>;
}

/**
 * ローカルストレージのキー
 */
export const STORAGE_KEY = 'browser-notepad-data';

/**
 * 空のメモを作成
 */
export function createEmptyNote(): Note {
  return {
    content: '',
    updatedAt: new Date().toLocaleString('ja-JP'),
  };
}

/**
 * 初期状態を作成
 */
export function createInitialState(): NotesState {
  return {
    version: 2,
    activeTabId: 'common',
    tabs: {
      common: createEmptyNote(),
      uncommon: createEmptyNote(),
      rare: createEmptyNote(),
      epic: createEmptyNote(),
      legendary: createEmptyNote(),
      mythic: createEmptyNote(),
    },
  };
}
