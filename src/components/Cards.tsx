import type { Medicine, MedCase, TongueTip, Acupoint, DetailRef } from '../types';
import { casesForMedicine } from '../lib/data';

/* ---------- 通用小件 ---------- */

export function SectionTitle({ children, extra }: { children: React.ReactNode; extra?: React.ReactNode }) {
  return (
    <div className="mb-3 mt-7 flex items-end justify-between">
      <h2 className="font-serif-cn flex items-center gap-2 text-lg font-bold tracking-wide">
        <span className="inline-block h-4 w-1 rounded-full bg-primary" />
        {children}
      </h2>
      {extra}
    </div>
  );
}

export function TagChip({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3 py-1 text-xs transition-all ${
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card text-muted-foreground'
      }`}
    >
      {label}
    </button>
  );
}

/** 印章式分类小标 */
export function CategorySeal({ label }: { label?: string }) {
  if (!label) return null;
  return (
    <span className="inline-block rounded border border-primary/50 px-1.5 py-0.5 text-[10px] leading-none text-primary">
      {label}
    </span>
  );
}

/* ---------- 卡片 ---------- */

interface CardProps<T> {
  item: T;
  onOpen: (ref: DetailRef) => void;
}

export function MedicineCard({ item: m, onOpen }: CardProps<Medicine>) {
  const caseCount = casesForMedicine(m.id).length;
  return (
    <button
      onClick={() => onOpen({ type: 'medicine', id: m.id })}
      className="w-full rounded-xl border border-border bg-card p-4 text-left shadow-xs transition-transform active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-serif-cn text-lg font-bold tracking-[0.15em]">{m.name}</h3>
        <CategorySeal label={m.category} />
      </div>
      {m.functions && <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">{m.functions}</p>}
      <div className="mt-2.5 flex items-center gap-2 text-[11px] text-muted-foreground/80">
        {(m.tags ?? []).slice(0, 3).map(t => (
          <span key={t} className="rounded bg-secondary px-1.5 py-0.5">#{t}</span>
        ))}
        {caseCount > 0 && <span className="ml-auto text-primary">{caseCount} 则医案</span>}
      </div>
    </button>
  );
}

export function CaseCard({ item: c, onOpen }: CardProps<MedCase>) {
  return (
    <button
      onClick={() => onOpen({ type: 'case', id: c.id })}
      className="w-full rounded-xl border border-border bg-card p-4 text-left shadow-xs transition-transform active:scale-[0.98]"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">{c.no ? `医案 ${c.no} · ` : ''}{c.patient}</span>
        {c.syndrome && (
          <span className="shrink-0 rounded border border-dai/40 px-1.5 py-0.5 text-[10px] leading-none text-dai">
            {c.syndrome.split('，')[0]}
          </span>
        )}
      </div>
      {c.title && <p className="font-serif-cn mt-1.5 text-[15px] font-bold leading-snug">{c.title}</p>}
      <p className="mt-1.5 line-clamp-2 text-sm font-medium leading-relaxed">{c.chiefComplaint}</p>
      {c.effect && (
        <p className="mt-2 line-clamp-2 rounded-lg bg-secondary/70 px-2.5 py-1.5 text-[12px] leading-relaxed text-foreground/80">
          <span className="mr-1 font-semibold text-primary">效</span>
          {c.effect}
        </p>
      )}
    </button>
  );
}

export function TongueCard({ item: t, onOpen }: CardProps<TongueTip>) {
  return (
    <button
      onClick={() => onOpen({ type: 'tongue', id: t.id })}
      className="w-full rounded-xl border border-border bg-card p-4 text-left shadow-xs transition-transform active:scale-[0.98]"
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-serif-cn text-base font-bold">{t.sign}</h3>
        {t.diagnosis && <CategorySeal label={t.diagnosis} />}
      </div>
      {t.location && <p className="mt-1 text-[11px] text-accent">{t.location}</p>}
      {t.meaning && <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">{t.meaning}</p>}
    </button>
  );
}

export function AcupointCard({ item: a, onOpen }: CardProps<Acupoint>) {
  return (
    <button
      onClick={() => onOpen({ type: 'acupoint', id: a.id })}
      className="w-full rounded-xl border border-border bg-card p-4 text-left shadow-xs transition-transform active:scale-[0.98]"
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-serif-cn text-lg font-bold tracking-[0.12em]">{a.name}</h3>
        <span className="rounded-full bg-dai/10 px-2 py-0.5 text-[11px] text-dai">{a.method}</span>
      </div>
      {a.location && <p className="mt-1 text-[11px] text-muted-foreground">{a.location}</p>}
      {a.func && <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">{a.func}</p>}
    </button>
  );
}
