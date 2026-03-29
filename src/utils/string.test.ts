import { describe, it, expect } from 'vitest';
import { getCharacterCount } from './string';

describe('getCharacterCount', () => {
  it('通常の英数字を正しくカウントする', () => {
    expect(getCharacterCount('hello')).toBe(5);
    expect(getCharacterCount('12345')).toBe(5);
    expect(getCharacterCount('')).toBe(0);
  });

  it('日本語の文字を正しくカウントする', () => {
    expect(getCharacterCount('こんにちは')).toBe(5);
    expect(getCharacterCount('漢字テスト')).toBe(5);
    expect(getCharacterCount('ひらがなカタカナ漢字')).toBe(10);
  });

  it('絵文字を1文字としてカウントする', () => {
    expect(getCharacterCount('🗿')).toBe(1);
    expect(getCharacterCount('😀')).toBe(1);
    expect(getCharacterCount('👍')).toBe(1);
    expect(getCharacterCount('🎉')).toBe(1);
  });

  it('複数の絵文字を正しくカウントする', () => {
    expect(getCharacterCount('🗿🗿')).toBe(2);
    expect(getCharacterCount('😀😃😄')).toBe(3);
  });

  it('絵文字と通常文字の混在を正しくカウントする', () => {
    expect(getCharacterCount('Hello 🗿')).toBe(7);
    expect(getCharacterCount('こんにちは😀')).toBe(6);
    expect(getCharacterCount('絵文字🎉テスト')).toBe(7);
  });

  it('肌色付き絵文字を1文字としてカウントする', () => {
    expect(getCharacterCount('👋🏻')).toBe(1);
    expect(getCharacterCount('👍🏽')).toBe(1);
  });

  it('結合文字を含む絵文字を1文字としてカウントする', () => {
    // 家族の絵文字など
    expect(getCharacterCount('👨‍👩‍👧‍👦')).toBe(1);
    expect(getCharacterCount('👨‍💻')).toBe(1);
  });

  it('国旗の絵文字を1文字としてカウントする', () => {
    expect(getCharacterCount('🇯🇵')).toBe(1);
    expect(getCharacterCount('🇺🇸')).toBe(1);
  });

  it('改行を含むテキストを正しくカウントする', () => {
    expect(getCharacterCount('Hello\nWorld')).toBe(10);
    expect(getCharacterCount('行1\n行2\n行3')).toBe(6);
  });

  it('CRLF改行も文字数に含めない', () => {
    expect(getCharacterCount('A\r\nB')).toBe(2);
    expect(getCharacterCount('日本語\r\nテスト')).toBe(6);
  });

  it('スペースを含むテキストを正しくカウントする', () => {
    expect(getCharacterCount('Hello World')).toBe(11);
    expect(getCharacterCount('   ')).toBe(3);
  });

  it('複雑な文字列を正しくカウントする', () => {
    const text = 'テスト🗿test😀日本語👍123';
    // テ(1) ス(1) ト(1) 🗿(1) t(1) e(1) s(1) t(1) 😀(1) 日(1) 本(1) 語(1) 👍(1) 1(1) 2(1) 3(1) = 16文字
    expect(getCharacterCount(text)).toBe(16);
  });

  it('サロゲートペアを正しくカウントする', () => {
    // サロゲートペアの文字
    expect(getCharacterCount('𠮷')).toBe(1); // 吉の旧字体
    expect(getCharacterCount('𩸽')).toBe(1); // ほっけの漢字
  });
});
