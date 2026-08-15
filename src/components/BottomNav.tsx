import { Home, Eye, Pill, ScrollText, Crosshair } from 'lucide-react';

export type TabKey = 'home' | 'tongue' | 'medicines' | 'cases' | 'acupoints';

const TABS: { key: TabKey; label: string; Icon: typeof Home }[] = [
  { key: 'home', label: '首页', Icon: Home },
  { key: 'tongue', label: '舌诊', Icon: Eye },
  { key: 'medicines', label: '药库', Icon: Pill },
  { key: 'cases', label: '医案', Icon: ScrollText },
  { key: 'acupoints', label: '穴位', Icon: Crosshair },
];

interface BottomNavProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

export default function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur safe-bottom">
      <div className="mx-auto flex max-w-lg">
        {TABS.map(({ key, label, Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className="flex flex-1 flex-col items-center gap-0.5 py-2.5 transition-colors"
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                  isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                }`}
              >
                <Icon size={19} strokeWidth={isActive ? 2.2 : 1.8} />
              </span>
              <span
                className={`text-[11px] leading-none ${
                  isActive ? 'font-semibold text-primary' : 'text-muted-foreground'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
