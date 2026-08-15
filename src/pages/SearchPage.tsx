import { useState } from 'react';
import { ChevronLeft, Search } from 'lucide-react';
import { searchAll } from '../lib/data';
import { MedicineCard, CaseCard, TongueCard, AcupointCard } from '../components/Cards';
import type { DetailRef } from '../types';

interface SearchPageProps {
  initialQuery: string;
  onOpen: (ref: DetailRef) => void;
  onClose: () => void;
}

export default function SearchPage({ initialQuery, onOpen, onClose }: SearchPageProps) {
  const [q, setQ] = useState(initialQuery);
  const r = searchAll(q);
  const total = r.medicines.length + r.cases.length + r.tongue.length + r.acupoints.length;

  return (
    <div className="animate-fade-in fixed inset-0 z-30 overflow-y-auto bg-background">
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 px-5 pb-3 pt-5 backdrop-blur">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card">
            <ChevronLeft size={18} />
          </button>
          <div className="flex flex-1 items-center gap-2.5 rounded-full border border-border bg-card px-4 py-2.5 shadow-xs">
            <Search size={16} className="text-muted-foreground" />
            <input
              autoFocus
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="搜索药名、症状、证型、标签…"
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>
        </div>
      </div>

      <div className="px-5 pb-28 pt-4">
        {q.trim() === '' ? (
          <p className="py-16 text-center text-sm text-muted-foreground">输入关键词，或从首页「按症寻方」快捷进入</p>
        ) : total === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">未找到「{q}」相关内容</p>
        ) : (
          <>
            {r.medicines.length > 0 && (
              <>
                <p className="font-serif-cn mb-2 text-sm font-bold text-muted-foreground">中成药 · {r.medicines.length}</p>
                <div className="space-y-3">{r.medicines.map(m => <MedicineCard key={m.id} item={m} onOpen={onOpen} />)}</div>
              </>
            )}
            {r.cases.length > 0 && (
              <>
                <p className="font-serif-cn mb-2 mt-6 text-sm font-bold text-muted-foreground">医案 · {r.cases.length}</p>
                <div className="space-y-3">{r.cases.map(c => <CaseCard key={c.id} item={c} onOpen={onOpen} />)}</div>
              </>
            )}
            {r.tongue.length > 0 && (
              <>
                <p className="font-serif-cn mb-2 mt-6 text-sm font-bold text-muted-foreground">舌诊 · {r.tongue.length}</p>
                <div className="space-y-3">{r.tongue.map(t => <TongueCard key={t.id} item={t} onOpen={onOpen} />)}</div>
              </>
            )}
            {r.acupoints.length > 0 && (
              <>
                <p className="font-serif-cn mb-2 mt-6 text-sm font-bold text-muted-foreground">穴位 · {r.acupoints.length}</p>
                <div className="space-y-3">{r.acupoints.map(a => <AcupointCard key={a.id} item={a} onOpen={onOpen} />)}</div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
