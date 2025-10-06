'use client';

import { Home, Grid3x3, BarChart3, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: 'Feed', href: '/' },
    { icon: Grid3x3, label: 'Collections', href: '/collections' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics' },
    { icon: User, label: 'Profile', href: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-card border-t border-white/10 lg:hidden">
      <div className="flex items-center justify-around py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'text-primary' 
                  : 'text-text-muted hover:text-fg'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
