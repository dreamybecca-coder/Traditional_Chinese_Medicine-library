import { useState } from 'react';
import { Search } from 'lucide-react';
import { data, medCategories } from '../lib/data';
import { MedicineCard, TagChip } from '../components/Cards';
import type { DetailRef } from '../types';

interface MedicinesPageProps {
  onOpen: (ref: DetailRef) => void;
}

export default function MedicinesPage({ onOpen }: MedicinesPageProps) {
  const [cat, setCat] = useState('全部');
  const [q, setQ] = useState('');

  const list = data.medicines.filter(m => {
    const okCat = cat === '全部' || m.category === cat;
    const query = q.trim().toLowerCase();
    const okQ = !query ||
      [m.name, m.functions, m.indications, m.applicable].some(f => f?.toLowerCase().includes(query)) ||
      (m.tags ?? []).some(t => t.toLowerCase().includes(query));
    return okCat && okQ;
  });

  return (
    <div className="animate-rise-in px-5 pb-28 pt-6">
      <header className="mb-4">
        <h1 className="font-serif-cn text-2xl font-bold tracking-[0.2em]">中成药库</h1>
        <p className="mt-1 text-xs text-muted-foreground">共收录 {data.medicines.length} 味 · 含方解心得与配伍经验</p>
      </header>

      <div className="flex items-center gap-2.5 rounded-full border border-border bg-card px-4 py-2.5 shadow-xs">
        <Search size={16} className="text-muted-foreground" />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="搜索药名、功效、症状…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
        />
      </div>

      <div className="no-scrollbar -mx-5 mt-4 flex gap-2 overflow-x-auto px-5">
        {['全部', ...medCategories].map(c => (
          <TagChip key={c} label={c} active={cat === c} onClick={() => setCat(c)} />
        ))}
      </div>

      <p className="mb-3 mt-4 text-xs text-muted-foreground">{list.length} 味</p>
      <div className="space-y-3">
        {list.map(m => <MedicineCard key={m.id} item={m} onOpen={onOpen} />)}
      </div>
    </div>
  );
}
