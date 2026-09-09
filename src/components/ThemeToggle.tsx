import { useTheme, type Theme } from '@/contexts/ThemeContext';
import { Moon, Sun, Zap } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const options: { id: Theme; label: string; icon: typeof Moon }[] = [
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'cyber', label: 'Cyber', icon: Zap },
  ];

  return (
    <div className="flex items-center bg-surface border border-surface-border p-0.5 rounded-lg shadow-inner">
      {options.map(opt => {
        const Icon = opt.icon;
        const active = theme === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => setTheme(opt.id)}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition-all duration-300 cursor-pointer ${
              active
                ? 'bg-primary-500 text-white shadow-sm'
                : 'text-ink-400 hover:text-ink-100 hover:bg-surface-hover'
            }`}
            title={`Switch to ${opt.label} Theme`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
