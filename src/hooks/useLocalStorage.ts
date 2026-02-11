import { useState, useEffect } from 'react';

/**
 * ローカルストレージと同期するカスタムフック
 * @param key ローカルストレージのキー
 * @param initialValue 初期値
 * @returns [value, setValue] のタプル
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // ローカルストレージから初期値を取得
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  // 値が変更されたらローカルストレージに保存
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}
