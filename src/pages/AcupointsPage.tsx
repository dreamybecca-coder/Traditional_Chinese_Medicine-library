import { useState } from 'react';
import { data, acupointMethods } from '../lib/data';
import { AcupointCard, TagChip } from '../components/Cards';
import type { DetailRef } from '../types';

interface AcupointsPageProps {
  onOpen: (ref: DetailRef) => void;
}

export default function AcupointsPage({ onOpen }: AcupointsPageProps) {
  const [method, setMethod] = useState('全部');
  const list = data.acupoints.filter(a => method === '全部' || a.method === method);

  return (
    <div className="animate-rise-in px-5 pb-28 pt-6">
      <header className="mb-4">
        <h1 className="font-serif-cn text-2xl font-bold tracking-[0.2em]">艾灸穴位</h1>
        <p className="mt-1 text-xs text-muted-foreground">共收录 {data.acupoints.length} 穴 · 药力不够，外源来补</p>
      </header>

      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
        {['全部', ...acupointMethods].map(m => (
          <TagChip key={m} label={m} active={method === m} onClick={() => setMethod(m)} />
        ))}
      </div>

      <p className="mb-3 mt-4 text-xs text-muted-foreground">{list.length} 穴</p>
      <div className="space-y-3">
        {list.map(a => <AcupointCard key={a.id} item={a} onOpen={onOpen} />)}
      </div>
    </div>
  );
}
