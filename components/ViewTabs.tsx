'use client';

import { Network, Table2, FileJson, GitBranch } from 'lucide-react';

interface ViewTabsProps {
  activeTab: 'tree' | 'table' | 'raw' | 'graph' | 'flow';
  onTabChange: (tab: 'tree' | 'table' | 'raw' | 'graph'| 'flow') => void;
  showTable?: boolean;
}

export default function ViewTabs({ activeTab, onTabChange, showTable = false }: ViewTabsProps) {
  const tabs = [
    { id: 'tree' as const, label: 'Tree', icon: Network },
    ...(showTable ? [{ id: 'table' as const, label: 'Table', icon: Table2 }] : []),
    { id: 'graph' as const, label: 'Graph', icon: GitBranch },
    { id: 'raw' as const, label: 'Raw', icon: FileJson },
    { id: 'flow' as const, label: 'Flow', icon: FileJson },
  ];

  return (
    <div className="flex gap-1 px-4 border-b border-gray-900">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition-all flex items-center gap-2 border-b-2 ${
              isActive
                ? 'text-white border-white'
                : 'text-gray-500 border-transparent hover:text-gray-300'
            }`}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}