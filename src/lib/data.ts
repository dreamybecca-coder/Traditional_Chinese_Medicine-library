import rawData from '../data.merged.json';
import type { TcmData, Medicine, MedCase, TongueTip, Acupoint, DetailRef } from '../types';

export const data = rawData as TcmData;

export const medById = new Map(data.medicines.map(m => [m.id, m]));
export const caseById = new Map(data.cases.map(c => [c.id, c]));
export const tongueById = new Map(data.tongue.map(t => [t.id, t]));
export const acupointById = new Map(data.acupoints.map(a => [a.id, a]));
export const protocolById = new Map(data.protocols.map(p => [p.id, p]));

export function parseIds(s?: string): string[] {
  if (!s) return [];
  return s.split(/[,，]/).map(x => x.trim()).filter(Boolean);
}

/** 反向索引：某味中成药被哪些医案引用（按方药/按语中出现的药名） */
const medToCases = new Map<string, MedCase[]>();
for (const m of data.medicines) {
  const hits: MedCase[] = [];
  for (const c of data.cases) {
    const hay = `${c.formula ?? ''}\n${c.reflection ?? ''}\n${(c.tags ?? []).join(',')}`;
    if (m.name && hay.includes(m.name)) hits.push(c);
  }
  // 兼容别名：生脉饮 → 红参版生脉饮 等（按名称包含关系）
  if (hits.length === 0) {
    for (const c of data.cases) {
      const hay = `${c.formula ?? ''} ${c.reflection ?? ''}`;
      if (m.name && m.name.length >= 3 && hay.includes(m.name.slice(0, 3))) hits.push(c);
    }
  }
  medToCases.set(m.id, hits);
}
export function casesForMedicine(id: string): MedCase[] {
  return medToCases.get(id) ?? [];
}

/** 某味药关联的舌诊/穴位（通过 relatedMeds 字段） */
export function tongueForMedicine(id: string): TongueTip[] {
  return data.tongue.filter(t => parseIds(t.relatedMeds).includes(id));
}
export function acupointsForMedicine(id: string): Acupoint[] {
  return data.acupoints.filter(a => parseIds(a.relatedMeds).includes(id));
}

/** 医案中出现的中成药 */
export function medsForCase(c: MedCase): Medicine[] {
  const hay = `${c.formula ?? ''}\n${c.reflection ?? ''}\n${(c.tags ?? []).join(',')}`;
  return data.medicines.filter(m => m.name && hay.includes(m.name));
}

/** 分类、标签、手法统计 */
export const medCategories = [...new Set(data.medicines.map(m => m.category).filter(Boolean))] as string[];
export const acupointMethods = [...new Set(data.acupoints.map(a => a.method).filter(Boolean))] as string[];

export const allTags: { tag: string; count: number }[] = (() => {
  const cnt = new Map<string, number>();
  const add = (tags?: string[]) => tags?.forEach(t => cnt.set(t, (cnt.get(t) ?? 0) + 1));
  data.medicines.forEach(m => add(m.tags));
  data.cases.forEach(c => add(c.tags));
  data.tongue.forEach(t => add(t.tags));
  data.acupoints.forEach(a => add(a.tags));
  return [...cnt.entries()].map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count);
})();

/** 全局搜索 */
export interface SearchResults {
  medicines: Medicine[];
  cases: MedCase[];
  tongue: TongueTip[];
  acupoints: Acupoint[];
}
export function searchAll(query: string): SearchResults {
  const q = query.trim().toLowerCase();
  if (!q) return { medicines: [], cases: [], tongue: [], acupoints: [] };
  const match = (fields: (string | undefined)[], tags?: string[]) =>
    fields.some(f => f && f.toLowerCase().includes(q)) ||
    (tags ?? []).some(t => t.toLowerCase().includes(q));
  return {
    medicines: data.medicines.filter(m =>
      match([m.name, m.category, m.functions, m.ingredients, m.indications, m.applicable], m.tags)),
    cases: data.cases.filter(c =>
      match([c.patient, c.title, c.method, c.chiefComplaint, c.syndrome, c.formula, c.effect,
        (c.teachingPoints ?? []).join(' ')], c.tags)),
    tongue: data.tongue.filter(t => match([t.sign, t.location, t.meaning, t.diagnosis], t.tags)),
    acupoints: data.acupoints.filter(a =>
      match([a.name, a.location, a.method, a.func, a.indications], a.tags)),
  };
}

/** 首页"按症寻方"快捷入口 */
export const symptomEntries: { label: string; query: string; icon: string }[] = [
  { label: '失眠', query: '失眠', icon: '寐' },
  { label: '疲劳乏力', query: '疲劳', icon: '乏' },
  { label: '手脚冰凉', query: '手脚冰凉', icon: '寒' },
  { label: '水肿', query: '水肿', icon: '湿' },
  { label: '腹泻便溏', query: '便溏', icon: '泄' },
  { label: '心慌心悸', query: '心悸', icon: '悸' },
  { label: '面色萎黄', query: '萎黄', icon: '黄' },
  { label: '痛风', query: '痛风', icon: '痛' },
  { label: '脱发', query: '脱发', icon: '发' },
  { label: '痛经闭经', query: '闭经', icon: '经' },
  { label: '咳嗽', query: '咳嗽', icon: '咳' },
  { label: '痤疮疮肿', query: '痤疮', icon: '疮' },
];

export function resolveDetail(type: DetailRef['type'], id: string) {
  switch (type) {
    case 'medicine': return medById.get(id);
    case 'case': return caseById.get(id);
    case 'protocol': return protocolById.get(id);
    case 'tongue': return tongueById.get(id);
    case 'acupoint': return acupointById.get(id);
  }
}
