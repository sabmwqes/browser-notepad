import { describe, it, expect, beforeEach } from 'vitest';
import { loadNotesState, saveNotesState } from './storage';
import type { NotesState } from '../types/note';
import { STORAGE_KEY, createInitialState } from '../types/note';

describe('storage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe('loadNotesState', () => {
    it('ストレージが空の場合、初期状態を返す', () => {
      const state = loadNotesState();
      expect(state.version).toBe(2);
      expect(state.activeTabId).toBe('common');
      expect(Object.keys(state.tabs)).toHaveLength(6);
      expect(state.tabs.common.content).toBe('');
    });

    it('v2形式のデータを正しく読み込む', () => {
      const data: NotesState = {
        version: 2,
        activeTabId: 'rare',
        tabs: {
          common: { content: 'common text', updatedAt: '2026/1/1' },
          uncommon: { content: '', updatedAt: '2026/1/1' },
          rare: { content: 'rare text', updatedAt: '2026/1/1' },
          epic: { content: '', updatedAt: '2026/1/1' },
          legendary: { content: '', updatedAt: '2026/1/1' },
          mythic: { content: '', updatedAt: '2026/1/1' },
        },
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

      const state = loadNotesState();
      expect(state.version).toBe(2);
      expect(state.activeTabId).toBe('rare');
      expect(state.tabs.common.content).toBe('common text');
      expect(state.tabs.rare.content).toBe('rare text');
    });

    it('旧形式（v1: 単一メモ）をcommonタブにマイグレーションする', () => {
      const legacy = { content: '旧データのメモ', updatedAt: '2026/2/11 12:00:00' };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(legacy));

      const state = loadNotesState();
      expect(state.version).toBe(2);
      expect(state.activeTabId).toBe('common');
      expect(state.tabs.common.content).toBe('旧データのメモ');
      expect(state.tabs.common.updatedAt).toBe('2026/2/11 12:00:00');
      // 他タブは空
      expect(state.tabs.uncommon.content).toBe('');
      expect(state.tabs.rare.content).toBe('');
    });

    it('旧形式マイグレーション後にストレージが新形式で上書きされる', () => {
      const legacy = { content: 'old note', updatedAt: '2026/1/1' };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(legacy));

      loadNotesState();

      // ストレージが新形式に上書きされていることを確認
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const saved = JSON.parse(raw!);
      expect(saved.version).toBe(2);
      expect(saved.tabs.common.content).toBe('old note');
    });

    it('不正なJSONの場合、初期状態を返す', () => {
      window.localStorage.setItem(STORAGE_KEY, 'not valid json');
      const state = loadNotesState();
      expect(state.version).toBe(2);
      expect(state.activeTabId).toBe('common');
    });

    it('不明なオブジェクト形式の場合、初期状態を返す', () => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ foo: 'bar' }));
      const state = loadNotesState();
      expect(state.version).toBe(2);
      expect(state.activeTabId).toBe('common');
    });
  });

  describe('saveNotesState', () => {
    it('データをストレージに保存できる', () => {
      const state = createInitialState();
      state.tabs.common.content = 'hello';
      saveNotesState(state);

      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = JSON.parse(raw!);
      expect(parsed.tabs.common.content).toBe('hello');
    });
  });
});
