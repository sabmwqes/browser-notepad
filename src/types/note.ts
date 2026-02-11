/**
 * メモの型定義
 */
export interface Note {
  content: string;
  updatedAt: string;
}

/**
 * ローカルストレージのキー
 */
export const STORAGE_KEY = 'browser-notepad-data';
