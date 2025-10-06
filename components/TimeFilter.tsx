'use client';

import { useState } from 'react';

type TimeWindow = '1h' | '3h' | '6h';

interface TimeFilterProps {
  onFilterChange?: (window: TimeWindow) => void;
}

export function TimeFilter({ onFilterChange }: TimeFilterProps) {
  const [selected, setSelected] = useState<TimeWindow>('1h');

  const windows: TimeWindow[] = ['1h', '3h', '6h'];

  const handleSelect = (window: TimeWindow) => {
    setSelected(window);
    onFilterChange?.(window);
  };

  return (
    <div className="flex gap-2">
      {windows.map((window) => (
        <button
          key={window}
          onClick={() => handleSelect(window)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            selected === window
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-button'
              : 'glass-card hover:bg-surface-hover'
          }`}
        >
          {window}
        </button>
      ))}
    </div>
  );
}
