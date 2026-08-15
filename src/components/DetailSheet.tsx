import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronDown, ChevronUp, X } from 'lucide-react';
import type { DetailRef, Medicine, MedCase, TongueTip, Acupoint, Protocol } from '../types';
import {
  resolveDetail, parseIds, casesForMedicine, medsForCase,
  tongueForMedicine, acupointsForMedicine, medById, caseById,
} from '../lib/data';
import { CategorySeal } from './Cards';

interface DetailSheetProps {
  stack: DetailRef[];
  onClose: () => void;        // 关闭整个抽屉
  onBack: () => void;         // 返回上一层
  onNavigate: (ref: DetailRef) => void; // 下钻
}

/** 手风琴小节 */
function Fold({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/70 last:border-b-0">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between py-3 text-left">
        <span className="font-serif-cn text-[15px] font-bold">{title}</span>
        {open ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
      </button>
      {open && <div className="whitespace-pre-line pb-4 text-[13.5px] leading-[1.9] text-foreground/85">{children}</div>}
    </div>
  );
}

/** 信息行 */
function Row({ label, value }: { label: string; value?: string }) {
  if (!value || value === '（待补充）') return null;
  return (
    <div className="flex gap-3 py-2">
      <span className="w-16 shrink-0 pt-0.5 text-[11px] leading-relaxed text-muted-foreground">{label}</span>
      <span className="whitespace-pre-line text-[13.5px] leading-relaxed text-foreground/90">{value}</span>
    </div>
  );
}

/** 关联条目跳转 chips */
function RelatedLinks({ label, refs, onNavigate }: { label: string; refs: { ref: DetailRef; text: string }[]; onNavigate: (r: DetailRef) => void }) {
  if (refs.length === 0) return null;
  return (
    <div className="mt-5">
      <p className="font-serif-cn mb-2 text-sm font-bold text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">
        {refs.map(({ ref, text }) => (
          <button
            key={ref.type + ref.id}
            onClick={() => onNavigate(ref)}
            className="rounded-lg border border-primary/40 bg-primary/5 px-3 py-1.5 text-[13px] text-primary transition-transform active:scale-95"
          >
            {text} →
          </button>
        ))}
      </div>
    </div>
  );
}

function MedicineDetail({ m, onNavigate }: { m: Medicine; onNavigate: (r: DetailRef) => void }) {
  const relatedCases = casesForMedicine(m.id);
  const relatedTongue = tongueForMedicine(m.id);
  const relatedAcupoints = acupointsForMedicine(m.id);
  return (
    <>
      <div className="rounded-xl bg-secondary/60 p-3.5">
        <Row label="组方" value={m.ingredients} />
        <Row label="适应症" value={m.indications} />
        <Row label="用法用量" value={m.dosage} />
        <Row label="禁忌" value={m.precautions} />
        <Row label="适用人群" value={m.applicable} />
      </div>
      {(m.noteSections ?? []).length > 0 && (
        <div className="mt-5">
          <p className="font-serif-cn mb-1 text-sm font-bold text-muted-foreground">心得与方解</p>
          <div className="rounded-xl border border-border bg-card px-4">
            {(m.noteSections ?? []).map((s, i) => (
              <Fold key={i} title={s.title} defaultOpen={i === 0}>{s.body}</Fold>
            ))}
          </div>
        </div>
      )}
      <RelatedLinks label="相关医案" onNavigate={onNavigate}
        refs={relatedCases.map(c => ({ ref: { type: 'case' as const, id: c.id }, text: `${c.patient ?? ''} · ${(c.chiefComplaint ?? '').slice(0, 12)}…` }))} />
      <RelatedLinks label="相关舌象" onNavigate={onNavigate}
        refs={relatedTongue.map(t => ({ ref: { type: 'tongue' as const, id: t.id }, text: t.sign }))} />
      <RelatedLinks label="配合穴位" onNavigate={onNavigate}
        refs={relatedAcupoints.map(a => ({ ref: { type: 'acupoint' as const, id: a.id }, text: a.name }))} />
    </>
  );
}

function CaseDetail({ c, onNavigate }: { c: MedCase; onNavigate: (r: DetailRef) => void }) {
  const meds = medsForCase(c);
  return (
    <>
      <div className="rounded-xl bg-secondary/60 p-3.5">
        <Row label="患者" value={c.patient} />
        <Row label="主诉" value={c.chiefComplaint} />
        <Row label="证型" value={c.syndrome} />
        <Row label="方药" value={c.formula} />
        <Row label="疗效" value={c.effect} />
      </div>
      {c.reflection && (
        <div className="mt-5">
          <p className="font-serif-cn mb-1 text-sm font-bold text-muted-foreground">按语反思</p>
          <div className="rounded-xl border border-border bg-card px-4">
            {(c.noteSections?.length ? c.noteSections : [{ title: '按语', body: c.reflection }]).map((s, i) => (
              <Fold key={i} title={s.title} defaultOpen={i === 0}>{s.body}</Fold>
            ))}
          </div>
        </div>
      )}
      <RelatedLinks label="本案用药" onNavigate={onNavigate}
        refs={meds.map(m => ({ ref: { type: 'medicine' as const, id: m.id }, text: m.name }))} />
    </>
  );
}

function TongueDetail({ t, onNavigate }: { t: TongueTip; onNavigate: (r: DetailRef) => void }) {
  return (
    <>
      <div className="rounded-xl bg-secondary/60 p-3.5">
        <Row label="舌象" value={t.sign} />
        <Row label="部位" value={t.location} />
        <Row label="辨证" value={t.meaning} />
        <Row label="诊断" value={t.diagnosis} />
      </div>
      <RelatedLinks label="相关医案" onNavigate={onNavigate}
        refs={parseIds(t.relatedCases).filter(id => caseById.has(id)).map(id => ({
          ref: { type: 'case' as const, id },
          text: `${caseById.get(id)!.patient ?? ''} · ${(caseById.get(id)!.chiefComplaint ?? '').slice(0, 12)}…`,
        }))} />
      <RelatedLinks label="对应方药" onNavigate={onNavigate}
        refs={parseIds(t.relatedMeds).filter(id => medById.has(id)).map(id => ({
          ref: { type: 'medicine' as const, id }, text: medById.get(id)!.name,
        }))} />
    </>
  );
}

function AcupointDetail({ a, onNavigate }: { a: Acupoint; onNavigate: (r: DetailRef) => void }) {
  return (
    <>
      <div className="rounded-xl bg-secondary/60 p-3.5">
        <Row label="定位" value={a.location} />
        <Row label="手法" value={a.method} />
        <Row label="功效" value={a.func} />
        <Row label="主治" value={a.indications} />
      </div>
      {(a.noteSections ?? []).length > 0 && (
        <div className="mt-5">
          <p className="font-serif-cn mb-1 text-sm font-bold text-muted-foreground">笔记</p>
          <div className="rounded-xl border border-border bg-card px-4">
            {(a.noteSections ?? []).map((s, i) => <Fold key={i} title={s.title} defaultOpen={i === 0}>{s.body}</Fold>)}
          </div>
        </div>
      )}
      <RelatedLinks label="相关医案" onNavigate={onNavigate}
        refs={parseIds(a.relatedCases).filter(id => caseById.has(id)).map(id => ({
          ref: { type: 'case' as const, id },
          text: `${caseById.get(id)!.patient ?? ''} · ${(caseById.get(id)!.chiefComplaint ?? '').slice(0, 12)}…`,
        }))} />
      <RelatedLinks label="配合方药" onNavigate={onNavigate}
        refs={parseIds(a.relatedMeds).filter(id => medById.has(id)).map(id => ({
          ref: { type: 'medicine' as const, id }, text: medById.get(id)!.name,
        }))} />
    </>
  );
}

function ProtocolDetail({ p }: { p: Protocol }) {
  return (
    <>
      <div className="rounded-xl bg-secondary/60 p-3.5">
        <Row label="适用" value={p.target} />
        <Row label="服用安排" value={p.schedule} />
        <Row label="疗程" value={p.duration} />
        <Row label="预期效果" value={p.effect} />
      </div>
      {(p.noteSections ?? []).length > 0 && (
        <div className="mt-5 rounded-xl border border-border bg-card px-4">
          {(p.noteSections ?? []).map((s, i) => <Fold key={i} title={s.title} defaultOpen>{s.body}</Fold>)}
        </div>
      )}
    </>
  );
}

const TYPE_META: Record<DetailRef['type'], { seal: string; label: string }> = {
  medicine: { seal: '方', label: '中成药' },
  case: { seal: '案', label: '医案' },
  protocol: { seal: '调', label: '调理方案' },
  tongue: { seal: '舌', label: '舌诊' },
  acupoint: { seal: '穴', label: '穴位' },
};

export default function DetailSheet({ stack, onClose, onBack, onNavigate }: DetailSheetProps) {
  const [closing, setClosing] = useState(false);
  const dragY = useRef(0);
  const current = stack[stack.length - 1];
  const item = resolveDetail(current.type, current.id);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const requestClose = () => {
    setClosing(true);
    setTimeout(onClose, 240);
  };

  if (!item) return null;
  const meta = TYPE_META[current.type];
  const title =
    current.type === 'medicine' ? (item as Medicine).name :
    current.type === 'case' ? `${(item as MedCase).patient ?? '医案'}` :
    current.type === 'tongue' ? (item as TongueTip).sign :
    current.type === 'acupoint' ? (item as Acupoint).name :
    (item as Protocol).name ?? '调理方案';

  const subtitle =
    current.type === 'medicine' ? (item as Medicine).functions :
    current.type === 'case' ? (item as MedCase).syndrome :
    current.type === 'acupoint' ? (item as Acupoint).func : undefined;

  return (
    <div className="fixed inset-0 z-50">
      {/* 遮罩 */}
      <div
        className={`absolute inset-0 bg-black/45 ${closing ? 'opacity-0 transition-opacity duration-200' : 'animate-fade-in'}`}
        onClick={requestClose}
      />
      {/* 抽屉 */}
      <div
        className={`absolute inset-x-0 bottom-0 top-[5%] flex flex-col rounded-t-2xl bg-background shadow-2xl ${
          closing ? 'animate-sheet-down' : 'animate-sheet-up'
        }`}
      >
        {/* 把手 + 头部（可下拉关闭） */}
        <div
          className="shrink-0 touch-none px-5 pb-3 pt-2"
          onTouchStart={e => { dragY.current = e.touches[0].clientY; }}
          onTouchEnd={e => {
            const dy = e.changedTouches[0].clientY - dragY.current;
            if (dy > 70) requestClose();
          }}
        >
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />
          <div className="flex items-center gap-3">
            {stack.length > 1 ? (
              <button onClick={onBack} className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground">
                <ChevronLeft size={18} />
              </button>
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary font-serif-cn text-[15px] font-bold text-primary-foreground">
                {meta.seal}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="font-serif-cn truncate text-xl font-bold tracking-[0.1em]">{title}</h2>
                {current.type === 'medicine' && <CategorySeal label={(item as Medicine).category} />}
              </div>
              {subtitle && <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-muted-foreground">{subtitle}</p>}
            </div>
            <button onClick={requestClose} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
              <X size={17} />
            </button>
          </div>
        </div>

        {/* 内容 */}
        <div key={current.type + current.id} className="animate-fade-in flex-1 overflow-y-auto px-5 pb-10">
          {current.type === 'medicine' && <MedicineDetail m={item as Medicine} onNavigate={onNavigate} />}
          {current.type === 'case' && <CaseDetail c={item as MedCase} onNavigate={onNavigate} />}
          {current.type === 'tongue' && <TongueDetail t={item as TongueTip} onNavigate={onNavigate} />}
          {current.type === 'acupoint' && <AcupointDetail a={item as Acupoint} onNavigate={onNavigate} />}
          {current.type === 'protocol' && <ProtocolDetail p={item as Protocol} />}
          {/* 标签 */}
          {'tags' in item && (item as Medicine).tags && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {((item as Medicine).tags ?? []).map(t => (
                <span key={t} className="rounded bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">#{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
