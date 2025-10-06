'use client';

import { ReactNode } from 'react';

interface FeedShellProps {
  children: ReactNode;
  variant?: 'infinite-scroll' | 'grid';
  title?: string;
  action?: ReactNode;
}

export function FeedShell({ 
  children, 
  variant = 'infinite-scroll',
  title,
  action 
}: FeedShellProps) {
  const gridClass = variant === 'grid' 
    ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
    : 'space-y-4';

  return (
    <div className="w-full">
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">{title}</h2>
          {action}
        </div>
      )}
      <div className={gridClass}>
        {children}
      </div>
    </div>
  );
}
