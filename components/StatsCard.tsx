'use client';

import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({ icon: Icon, label, value, trend }: StatsCardProps) {
  return (
    <div className="glass-card p-4 rounded-lg">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 bg-primary/20 rounded-lg">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        {trend && (
          <span className={`text-xs font-medium ${
            trend.isPositive ? 'text-success' : 'text-warning'
          }`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-sm text-text-muted">{label}</p>
    </div>
  );
}
