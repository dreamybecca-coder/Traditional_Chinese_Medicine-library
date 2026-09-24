#!/usr/bin/env node
/**
 * 内容流水线：把 content/ 下的 Markdown 医案/药方解析合并进 src/data.merged.json
 * 用法：node scripts/build-data.cjs
 * 新增内容 = 往 content/cases/ 丢一个 .md 文件，重新构建即上线。
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = path.join(ROOT, 'src', 'data.json');
const OUT = path.join(ROOT, 'src', 'data.merged.json');

/* ---------- 极简 frontmatter 解析 ---------- */
function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return { meta: {}, body: text };
  const meta = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    let [, k, v] = kv;
    v = v.trim();
    if (v === 'true') meta[k] = true;
    else if (v === 'false') meta[k] = false;
    else if (/^\d+$/.test(v)) meta[k] = Number(v);
    else if (v.startsWith('[') && v.endsWith(']')) {
      meta[k] = v.slice(1, -1).split(',').map(s => s.trim()).filter(Boolean);
    } else meta[k] = v;
  }
  return { meta, body: text.slice(m[0].length) };
}

/* ---------- Markdown 工具 ---------- */
const strip = s => s.replace(/\*\*/g, '').replace(/`/g, '').trim();

function parseTable(lines) {
  // | 药物 | 用量 | 结构归属 | 用意 |
  const rows = [];
  for (const line of lines) {
    if (!line.trim().startsWith('|')) continue;
    const cells = line.split('|').slice(1, -1).map(c => strip(c));
    if (cells.length < 2) continue;
    if (cells[0] === '药物' || /^-+$/.test(cells[0].replace(/\s/g, ''))) continue;
    rows.push({ name: cells[0], dose: cells[1] || '', source: cells[2] || '', intent: cells[3] || '' });
  }
  return rows;
}

function bullets(lines) {
  return lines
    .filter(l => /^\s*[-*]\s+/.test(l))
    .map(l => strip(l.replace(/^\s*[-*]\s+(\[[ xX]\]\s*)?/, '')));
}

function numbered(lines) {
  return lines
    .filter(l => /^\s*\d+\.\s+/.test(l))
    .map(l => strip(l.replace(/^\s*\d+\.\s+/, '')));
}

/* ---------- 医案 md → JSON ---------- */
function parseCaseMd(text) {
  const { meta, body } = parseFrontmatter(text);
  // 按 ## 二级标题切节
  const sections = [];
  const re = /^##\s+(.+)$/gm;
  let m, prev = null;
  const marks = [];
  while ((m = re.exec(body)) !== null) marks.push({ title: m[1].trim(), index: m.index, len: m[0].length });
  for (let i = 0; i < marks.length; i++) {
    const start = marks[i].index + marks[i].len;
    const end = i + 1 < marks.length ? marks[i + 1].index : body.length;
    sections.push({ title: marks[i].title, text: body.slice(start, end) });
  }

  const out = {
    id: meta.id, no: meta.no, title: meta.title, method: meta.method,
    patient: meta.patient, syndrome: meta.syndrome, effect: meta.effect,
    tags: meta.tags || [], hasSafety: !!meta.safety,
  };

  const visits = [];
  for (const sec of sections) {
    const lines = sec.text.split('\n');
    if (/病史|主诉/.test(sec.title)) {
      out.history = bullets(lines);
    } else if (/^[一二三四五六七八九十]+诊|诊[：:]/.test(sec.title)) {
      const visit = { name: strip(sec.title), herbs: [], analysis: [] };
      // 子节：### 全方组成 / ### 配伍分析
      const sub = sec.text.split(/^###\s+/m).slice(1);
      for (const s of sub) {
        const nl = s.indexOf('\n');
        const subTitle = s.slice(0, nl).trim();
        const subLines = s.slice(nl + 1).split('\n');
        if (/组成|方药|处方/.test(subTitle)) visit.herbs = parseTable(subLines);
        else if (/配伍|分析|方解/.test(subTitle)) visit.analysis = bullets(subLines);
      }
      visits.push(visit);
    } else if (/转折/.test(sec.title)) {
      out.turningPoint = strip(sec.text);
    } else if (/教学点|要点|启示/.test(sec.title)) {
      out.teachingPoints = numbered(lines).concat(
        numbered(lines).length === 0 ? bullets(lines) : []);
    } else if (/安全|禁忌|警示/.test(sec.title)) {
      out.safetyNotes = bullets(lines).map(s => s.replace(/^⚠️\s*/, ''));
    } else if (/待核|待补/.test(sec.title)) {
      out.pending = bullets(lines);
    } else if (/关联|相关/.test(sec.title)) {
      out.related = bullets(lines).map(l => {
        const idM = l.match(/-(c\d+|m\d+|t\d+|a\d+|p\d+)\]\]/) || l.match(/\b(c\d+|m\d+|t\d+|a\d+|p\d+)\b/);
        const tM = l.match(/\[\[(?:[^\]|]*\/)?([^\]|]+)\]\]/);
        return { id: idM ? idM[1] : null, title: tM ? strip(tM[1].replace(/-c\d+|-m\d+|-t\d+|-a\d+|-p\d+$/, '')) : l };
      });
    }
  }
  if (visits.length) out.visits = visits;

  // 兼容旧字段：卡片与搜索都能直接用
  out.chiefComplaint = (out.history || []).map(h => h.replace(/^[^：:]*[：:]/, '')).join('；')
    || out.title || '';
  out.formula = visits.map(v => v.name).join(' → ');
  out.reflection = (out.teachingPoints || []).join('\n');
  return out;
}

/* ---------- 主流程 ---------- */
const base = JSON.parse(fs.readFileSync(BASE, 'utf8'));
const merged = { ...base };

const dirs = [
  { dir: 'content/cases', key: 'cases', parse: parseCaseMd },
];

let added = 0;
for (const { dir, key, parse } of dirs) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) continue;
  for (const f of fs.readdirSync(abs).filter(f => f.endsWith('.md'))) {
    const item = parse(fs.readFileSync(path.join(abs, f), 'utf8'));
    if (!item.id) { console.warn('跳过（缺 id）:', f); continue; }
    const idx = merged[key].findIndex(x => x.id === item.id);
    if (idx >= 0) merged[key][idx] = { ...merged[key][idx], ...item };
    else merged[key].push(item);
    added++;
    console.log(`✓ ${key}: ${item.id} ${item.title || ''}`);
  }
}

fs.writeFileSync(OUT, JSON.stringify(merged, null, 1));
console.log(`\n合并完成：新增/更新 ${added} 条 → src/data.merged.json`);
console.log(`医案总数: ${merged.cases.length}，中成药: ${merged.medicines.length}`);
