import { useState } from 'react';
import { data } from '../lib/data';
import { TongueCard, TagChip } from '../components/Cards';
import type { DetailRef, TongueTip } from '../types';

/** 舌面分区 → 匹配 location 字段的关键词 */
const ZONES: { key: string; label: string; sub: string; match: (t: TongueTip) => boolean }[] = [
  { key: 'all', label: '全部', sub: '14 则', match: () => true },
  { key: 'tip', label: '舌尖', sub: '心神', match: t => /舌尖/.test(t.location ?? '') },
  { key: 'center', label: '舌中', sub: '脾胃', match: t => /舌中|脾胃/.test(t.location ?? '') },
  { key: 'edge', label: '舌边', sub: '肝胆', match: t => /舌边|肝胆/.test(t.location ?? '') },
  { key: 'coating', label: '舌苔', sub: '寒热湿', match: t => /舌苔/.test(t.location ?? '') },
  { key: 'under', label: '舌下', sub: '瘀血', match: t => /舌下/.test(t.location ?? '') },
  { key: 'whole', label: '全舌', sub: '气血', match: t => /全舌/.test(t.location ?? '') },
  { key: 'face', label: '面唇', sub: '望色', match: t => /嘴唇|面部/.test(t.location ?? '') },
];

/** 极简舌形 SVG，按当前分区高亮 */
function TongueMap({ active }: { active: string }) {
  const on = 'hsl(var(--primary) / 0.9)';
  const off = 'hsl(var(--primary) / 0.16)';
  const pick = (k: string) => (active === 'all' ? 'hsl(var(--primary) / 0.3)' : active === k ? on : off);
  return (
    <svg viewBox="0 0 120 160" className="mx-auto w-28">
      {/* 舌形轮廓 */}
      <path
        d="M60 8 C34 8 20 32 20 68 C20 116 38 152 60 152 C82 152 100 116 100 68 C100 32 86 8 60 8 Z"
        fill="hsl(var(--card))"
        stroke="hsl(var(--primary) / 0.5)"
        strokeWidth="1.5"
      />
      {/* 舌尖 */}
      <path d="M60 14 C40 14 30 30 28 52 L92 52 C90 30 80 14 60 14 Z" fill={pick('tip')} />
      {/* 舌边 */}
      <path d="M28 56 C26 76 26 96 32 116 L42 112 C38 94 37 74 38 56 Z" fill={pick('edge')} />
      <path d="M92 56 C94 76 94 96 88 116 L78 112 C82 94 83 74 82 56 Z" fill={pick('edge')} />
      {/* 舌中 */}
      <ellipse cx="60" cy="84" rx="20" ry="26" fill={pick('center')} />
      {/* 舌苔（点状示意） */}
      <g fill={pick('coating')}>
        <circle cx="52" cy="70" r="2.4" /><circle cx="68" cy="76" r="2.4" />
        <circle cx="58" cy="94" r="2.4" /><circle cx="66" cy="60" r="2" />
        <circle cx="50" cy="86" r="2" />
      </g>
      {/* 舌下（根部示意） */}
      <path d="M46 132 Q60 142 74 132" stroke={pick('under')} strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

interface TonguePageProps {
  onOpen: (ref: DetailRef) => void;
}

export default function TonguePage({ onOpen }: TonguePageProps) {
  const [zone, setZone] = useState('all');
  const z = ZONES.find(x => x.key === zone)!;
  const list = data.tongue.filter(z.match);

  return (
    <div className="animate-rise-in px-5 pb-28 pt-6">
      <header className="mb-4">
        <h1 className="font-serif-cn text-2xl font-bold tracking-[0.2em]">舌诊要点</h1>
        <p className="mt-1 text-xs text-muted-foreground">舌尖候心神，舌中候脾胃，舌边候肝胆 —— 点选分区查看</p>
      </header>

      {/* 舌形图 + 分区选择 */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
        <TongueMap active={zone} />
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {ZONES.map(zz => (
            <TagChip key={zz.key} label={`${zz.label}·${zz.sub}`} active={zone === zz.key} onClick={() => setZone(zz.key)} />
          ))}
        </div>
      </div>

      <p className="mb-3 mt-5 text-xs text-muted-foreground">
        {z.label === '全部' ? `共 ${list.length} 则` : `${z.label}相关 ${list.length} 则`}
      </p>
      <div className="space-y-3">
        {list.map(t => <TongueCard key={t.id} item={t} onOpen={onOpen} />)}
        {list.length === 0 && (
          <p className="rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
            该分区暂未收录舌象
          </p>
        )}
      </div>
    </div>
  );
}
