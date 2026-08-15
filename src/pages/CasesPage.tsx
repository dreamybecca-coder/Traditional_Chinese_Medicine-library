import { useState } from 'react';
import { Search } from 'lucide-react';
import { data } from '../lib/data';
import { CaseCard, TagChip } from '../components/Cards';
import type { DetailRef } from '../types';

interface CasesPageProps {
  onOpen: (ref: DetailRef) => void;
}

const HOT_TAGS = ['失眠', '心悸', '腹泻', '水肿', '疲劳', '手脚冰凉', '痛经', '脱发', '痛风', '咳嗽'];

export default function CasesPage({ onOpen }: CasesPageProps) {
  const [tag, setTag] = useState('全部');
  const [q, setQ] = useState('');

  const list = data.cases.filter(c => {
    const okTag = tag === '全部' || (c.tags ?? []).some(t => t.includes(tag)) ||
      `${c.chiefComplaint} ${c.syndrome} ${c.effect}`.includes(tag);
    const query = q.trim().toLowerCase();
    const okQ = !query ||
      [c.patient, c.chiefComplaint, c.syndrome, c.formula, c.effect].some(f => f?.toLowerCase().includes(query));
    return okTag && okQ;
  });

  return (
    <div className="animate-rise-in px-5 pb-28 pt-6">
      <header className="mb-4">
        <h1 className="font-serif-cn text-2xl font-bold tracking-[0.2em]">医案记录</h1>
        <p className="mt-1 text-xs text-muted-foreground">共收录 {data.cases.length} 则 · 临证实录与按语反思</p>
      </header>

      <div className="flex items-center gap-2.5 rounded-full border border-border bg-card px-4 py-2.5 shadow-xs">
        <Search size={16} className="text-muted-foreground" />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="搜索症状、证型、方药…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
        />
      </div>

      <div className="no-scrollbar -mx-5 mt-4 flex gap-2 overflow-x-auto px-5">
        {['全部', ...HOT_TAGS].map(t => (
          <TagChip key={t} label={t} active={tag === t} onClick={() => setTag(t)} />
        ))}
      </div>

      <p className="mb-3 mt-4 text-xs text-muted-foreground">{list.length} 则</p>
      <div className="space-y-3">
        {list.map(c => <CaseCard key={c.id} item={c} onOpen={onOpen} />)}
      </div>
    </div>
  );
}
