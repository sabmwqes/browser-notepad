/**
 * 文字列の正確な文字数をカウント
 * 絵文字やサロゲートペア、結合文字を正しくカウントします
 * 改行（\n, \r\n）は文字数に含めません
 */
export function getCharacterCount(text: string): number {
  const normalized = text.replace(/\r\n?/g, '\n');

  // Intl.Segmenterを使用して書記素クラスタ単位でカウント
  // ブラウザ互換性: Chrome 87+, Firefox 未対応, Safari 14.1+
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter('ja', { granularity: 'grapheme' });
    let count = 0;
    for (const part of segmenter.segment(normalized)) {
      if (part.segment !== '\n') {
        count += 1;
      }
    }
    return count;
  }

  // フォールバック: スプレッド演算子を使用
  // サロゲートペアは正しく扱えるが、結合文字は完全ではない
  return [...normalized].filter((char) => char !== '\n').length;
}
