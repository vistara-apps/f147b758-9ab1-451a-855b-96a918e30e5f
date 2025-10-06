'use client';

import { Clock, Filter } from 'lucide-react';
import type { TimeWindow, Category } from '@/lib/types';

interface FilterBarProps {
  timeWindow: TimeWindow;
  category: Category;
  onTimeWindowChange: (window: TimeWindow) => void;
  onCategoryChange: (category: Category) => void;
}

export function FilterBar({
  timeWindow,
  category,
  onTimeWindowChange,
  onCategoryChange,
}: FilterBarProps) {
  const timeWindows: TimeWindow[] = ['1h', '3h', '6h'];
  const categories: { value: Category; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'crypto', label: 'Crypto' },
    { value: 'startup', label: 'Startup' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'genz', label: 'Gen Z' },
    { value: 'dating', label: 'Dating' },
  ];

  return (
    <div className="glass-card p-4 space-y-4">
      {/* Time Window Filter */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-textMuted">
          <Clock className="w-4 h-4" />
          <span>Trending Window</span>
        </div>
        <div className="flex gap-2">
          {timeWindows.map((window) => (
            <button
              key={window}
              onClick={() => onTimeWindowChange(window)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                timeWindow === window
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-surface hover:bg-surfaceHover text-fg'
              }`}
            >
              {window}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-textMuted">
          <Filter className="w-4 h-4" />
          <span>Category</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                category === cat.value
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-surface hover:bg-surfaceHover text-fg'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
