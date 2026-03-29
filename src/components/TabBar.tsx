import React from 'react';
import type { TabId, TabDefinition } from '../types/note';
import { TAB_DEFINITIONS } from '../types/note';
import './TabBar.css';

interface TabBarProps {
  activeTabId: TabId;
  tabContents: Record<TabId, string>;
  onTabChange: (tabId: TabId) => void;
}

/**
 * 先頭行からプレビューテキストを取得
 */
function getPreviewText(content: string): string {
  const firstLine = content.split('\n')[0] ?? '';
  return firstLine.trim();
}

/**
 * タブバーコンポーネント
 * 6つの固定タブを均等幅で表示
 */
export const TabBar: React.FC<TabBarProps> = ({ activeTabId, tabContents, onTabChange }) => {
  return (
    <div className="tab-bar">
      {TAB_DEFINITIONS.map((tab) => (
        <TabItem
          key={tab.id}
          tab={tab}
          isActive={tab.id === activeTabId}
          content={tabContents[tab.id]}
          onClick={() => onTabChange(tab.id)}
        />
      ))}
    </div>
  );
};

interface TabItemProps {
  tab: TabDefinition;
  isActive: boolean;
  content: string;
  onClick: () => void;
}

const TabItem: React.FC<TabItemProps> = ({ tab, isActive, content, onClick }) => {
  const preview = getPreviewText(content);

  return (
    <button
      className={`tab-item tab-${tab.id} ${isActive ? 'tab-active' : ''}`}
      onClick={onClick}
      title={tab.label}
    >
      <span className="tab-letter">{tab.letter}</span>
      {preview && (
        <span className="tab-preview">{preview}</span>
      )}
    </button>
  );
};
