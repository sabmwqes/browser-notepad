import React from 'react';
import './StatusBar.css';

interface StatusBarProps {
  characterCount: number;
  updatedAt: string;
}

/**
 * ステータスバーコンポーネント
 * 文字数と最終更新時刻を表示
 */
export const StatusBar: React.FC<StatusBarProps> = ({ characterCount, updatedAt }) => {
  return (
    <div className="status-bar">
      <div className="status-item">
        <span className="status-label">文字数:</span>
        <span className="status-value">{characterCount}</span>
      </div>
      <div className="status-item">
        <span className="status-label">最終更新:</span>
        <span className="status-value">{updatedAt}</span>
      </div>
    </div>
  );
};
