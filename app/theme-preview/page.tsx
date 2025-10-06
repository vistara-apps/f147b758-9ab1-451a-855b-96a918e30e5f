'use client';

import { useTheme } from '../components/ThemeProvider';
import { Palette } from 'lucide-react';

export default function ThemePreview() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'default', name: 'MemeFlow (Default)', description: 'Vibrant purple/pink gradient' },
    { id: 'celo', name: 'Celo', description: 'Black & yellow, sharp borders' },
    { id: 'solana', name: 'Solana', description: 'Dark purple with magenta accents' },
    { id: 'base', name: 'Base', description: 'Dark blue with Base blue accents' },
    { id: 'coinbase', name: 'Coinbase', description: 'Navy with Coinbase blue' },
  ];

  return (
    <div className="min-h-screen bg-bg p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-6 h-6 text-accent" />
            <h1 className="text-2xl font-bold">Theme Preview</h1>
          </div>
          <p className="text-textMuted">
            Select a theme to see how MemeFlow looks across different blockchain aesthetics
          </p>
        </div>

        {/* Theme Selector */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4">Available Themes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as any)}
                className={`p-4 rounded-lg text-left transition-all duration-200 ${
                  theme === t.id
                    ? 'bg-accent/20 border-2 border-accent'
                    : 'bg-surface hover:bg-surfaceHover border-2 border-transparent'
                }`}
              >
                <h3 className="font-semibold mb-1">{t.name}</h3>
                <p className="text-sm text-textMuted">{t.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Color Palette */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-20 bg-bg rounded-lg border border-white/10"></div>
              <p className="text-sm text-textMuted">Background</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-surface rounded-lg border border-white/10"></div>
              <p className="text-sm text-textMuted">Surface</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-accent rounded-lg"></div>
              <p className="text-sm text-textMuted">Accent</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-fg rounded-lg"></div>
              <p className="text-sm text-textMuted">Foreground</p>
            </div>
          </div>
        </div>

        {/* Component Examples */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-4">Component Examples</h2>
          
          <div className="space-y-2">
            <p className="text-sm text-textMuted">Buttons</p>
            <div className="flex flex-wrap gap-2">
              <button className="btn-primary">Primary Button</button>
              <button className="btn-secondary">Secondary Button</button>
              <button className="btn-ghost">Ghost Button</button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-textMuted">Badges</p>
            <div className="flex flex-wrap gap-2">
              <span className="virality-badge virality-high">High 95</span>
              <span className="virality-badge virality-medium">Medium 75</span>
              <span className="virality-badge virality-low">Low 45</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
