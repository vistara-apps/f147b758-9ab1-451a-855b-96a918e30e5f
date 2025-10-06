'use client';

import { Home, Package, BarChart3, Heart } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'feed', label: 'Feed', icon: Home },
    { id: 'collections', label: 'Collections', icon: Package },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'saved', label: 'Saved', icon: Heart },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-card border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-4 gap-2 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-accent'
                    : 'text-textMuted hover:text-fg hover:bg-surface'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
