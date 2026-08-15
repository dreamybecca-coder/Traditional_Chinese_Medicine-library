import { Search } from 'lucide-react';
import Seal from '../components/Seal';
import { SectionTitle, MedicineCard, CaseCard } from '../components/Cards';
import { data, symptomEntries } from '../lib/data';
import type { DetailRef } from '../types';
import type { TabKey } from '../components/BottomNav';

interface HomePageProps {
  onOpen: (ref: DetailRef) => void;
  onTab: (tab: TabKey) => void;
  onSearch: (q: string) => void;
}

export default function HomePage({ onOpen, onTab, onSearch }: HomePageProps) {
  const modules = [
    { tab: 'medicines' as TabKey, name: '中成药库', desc: '组方 · 配伍 · 心得', count: data.medicines.length, seal: '方' },
    { tab: 'cases' as TabKey, name: '医案记录', desc: '临证 · 疗效 · 反思', count: data.cases.length, seal: '案' },
    { tab: 'tongue' as TabKey, name: '舌诊要点', desc: '望舌 · 辨证 · 立法', count: data.tongue.length, seal: '舌' },
    { tab: 'acupoints' as TabKey, name: '艾灸穴位', desc: '定位 · 手法 · 主治', count: data.acupoints.length, seal: '穴' },
  ];

  return (
    <div className="animate-rise-in px-5 pb-28 pt-6">
      {/* 顶部：印章 Logo + 题字 */}
      <header className="flex items-center gap-4">
        <Seal size={52} />
        <div className="flex-1">
          <h1 className="font-serif-cn text-[26px] font-bold leading-tight tracking-[0.3em]">中医知识库</h1>
          <p className="mt-1 text-[11px] tracking-[0.35em] text-muted-foreground">辨证 · 施治 · 存案</p>
        </div>
        <div className="writing-vertical border-l border-border pl-3">
          <p className="font-serif-cn text-[15px] font-medium tracking-[0.45em] text-primary/90">
            治病必求于本
          </p>
          <p className="mt-2 text-[9px] tracking-[0.3em] text-muted-foreground">黄帝内经</p>
        </div>
      </header>

      {/* 统计 */}
      <div className="mt-5 grid grid-cols-4 divide-x divide-border rounded-xl border border-border bg-card py-3 text-center shadow-xs">
        {[
          { n: data.medicines.length, l: '方药' },
          { n: data.cases.length, l: '医案' },
          { n: data.tongue.length, l: '舌象' },
          { n: data.acupoints.length, l: '穴位' },
        ].map(s => (
          <div key={s.l}>
            <p className="font-serif-cn text-xl font-bold text-primary">{s.n}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </div>

      {/* 搜索 */}
      <button
        onClick={() => onSearch('')}
        className="mt-5 flex w-full items-center gap-2.5 rounded-full border border-border bg-card px-4 py-3 text-left text-sm text-muted-foreground shadow-xs"
      >
        <Search size={17} />
        搜索药名、症状、证型、标签…
      </button>

      {/* 按症寻方 */}
      <SectionTitle>按症寻方</SectionTitle>
      <div className="grid grid-cols-4 gap-2.5">
        {symptomEntries.map(s => (
          <button
            key={s.label}
            onClick={() => onSearch(s.query)}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card py-3 shadow-xs transition-transform active:scale-95"
          >
            <span className="font-serif-cn flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
              {s.icon}
            </span>
            <span className="text-[11px] text-foreground/80">{s.label}</span>
          </button>
        ))}
      </div>

      {/* 舌象自查入口 */}
      <button
        onClick={() => onTab('tongue')}
        className="mt-6 flex w-full items-center justify-between rounded-xl bg-primary p-4 text-left text-primary-foreground shadow-md transition-transform active:scale-[0.98]"
      >
        <div>
          <p className="font-serif-cn text-lg font-bold tracking-[0.2em]">舌象自查</p>
          <p className="mt-1 text-[12px] opacity-85">点选舌面部位，查看对应辨证要点</p>
        </div>
        <span className="font-serif-cn writing-vertical text-[13px] tracking-[0.4em] opacity-80">望而知之</span>
      </button>

      {/* 模块宫格 */}
      <SectionTitle>藏书四库</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        {modules.map(m => (
          <button
            key={m.name}
            onClick={() => onTab(m.tab)}
            className="rounded-xl border border-border bg-card p-4 text-left shadow-xs transition-transform active:scale-[0.97]"
          >
            <div className="flex items-center justify-between">
              <span className="font-serif-cn flex h-9 w-9 items-center justify-center rounded-md bg-primary text-base font-bold text-primary-foreground">
                {m.seal}
              </span>
              <span className="font-serif-cn text-lg font-bold text-accent">{m.count}</span>
            </div>
            <p className="font-serif-cn mt-2.5 text-[15px] font-bold">{m.name}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{m.desc}</p>
          </button>
        ))}
      </div>

      {/* 最近收录 */}
      <SectionTitle>近期收录方药</SectionTitle>
      <div className="space-y-3">
        {data.medicines.slice(-4).reverse().map(m => (
          <MedicineCard key={m.id} item={m} onOpen={onOpen} />
        ))}
      </div>

      <SectionTitle>近期医案</SectionTitle>
      <div className="space-y-3">
        {data.cases.slice(-3).reverse().map(c => (
          <CaseCard key={c.id} item={c} onOpen={onOpen} />
        ))}
      </div>

      {/* 页脚 */}
      <footer className="mt-10 text-center">
        <Seal size={26} className="mx-auto opacity-70" />
        <p className="mt-2 text-[10px] tracking-[0.3em] text-muted-foreground">内容仅供学习参考 · 用药请遵医嘱</p>
      </footer>
    </div>
  );
}
