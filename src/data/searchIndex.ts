import { diseases } from './diseases';
import { teams } from './teams';
import { aiApps } from './aiApps';
import { patientEduArticles } from './patientEdu';
import { sciencePapers } from './science';
import { drugInteractions } from './drugInteractions';

// =============================================================================
// 中文同义词词典（内置，无需API）
// =============================================================================
const SYNONYMS: Record<string, string[]> = {
  'cdi': ['艰难梭菌', '艰难梭菌感染', 'clostridium difficile', 'c diff', 'cdi', 'rcdi', '复发性艰难梭菌', '复发性cdi'],
  'fmt': ['粪菌移植', 'fecal microbiota transplantation', '肠道菌群移植', '微生物移植', '粪菌', '菌群移植'],
  'ibd': ['炎症性肠病', '溃疡性结肠炎', '克罗恩病', 'uc', 'cd', 'inflammatory bowel', '肠炎'],
  'uc': ['溃疡性结肠炎', '溃疡性大肠炎', 'ulcerative colitis'],
  'cd': ['克罗恩病', '克罗恩', '克罗恩病', 'crohn disease', '克隆恩'],
  'ibs': ['肠易激综合征', '肠易激', 'irritable bowel syndrome'],
  'nafld': ['脂肪肝', '非酒精性脂肪肝', 'nash', 'naFLD', '酒精性脂肪肝'],
  'asd': ['自闭症', '孤独症', 'autism', '自闭症谱系'],
  'pd': ['帕金森', '帕金森病', 'parkinson', '帕金森氏'],
  'metabolic': ['代谢', '代谢综合征', '血糖', '胰岛素', '代谢性疾病'],
  'rcdi': ['复发性艰难梭菌', '反复艰难梭菌', '复发性cdi', '复发性艰难梭菌感染'],
  'sepsis': ['脓毒症', '败血症', 'sepsis'],
  'constipation': ['便秘', '功能性便秘', 'chronic constipation'],
  'mdro': ['耐药菌', '多重耐药', '抗药菌', 'mdro', '超级细菌'],
  'team': ['团队', '中心', '机构', '实验室', '研究组'],
  'antibiotic': ['抗生素', '万古霉素', '甲硝唑', 'fidaxomicin', '头孢', '青霉素'],
  'protocol': ['方案', '剂量', '疗程', '频次', '指南', '协议'],
  'safety': ['安全', '不良反应', '副作用', '风险', '并发症'],
  'capsule': ['胶囊', '口服', '胶囊剂'],
  'children': ['儿童', '儿科', '小儿', '幼儿', '青少年'],
  'elderly': ['老年', '高龄', '老人'],
  'insurance': ['医保', '保险', '费用', '价格', '报销'],
};

// =============================================================================
// 增强分词
// =============================================================================
function tokenize(text: string): string[] {
  const tokens: string[] = [];
  // 中文字符 n-gram（2-gram）
  for (let i = 0; i < text.length - 1; i++) {
    tokens.push(text.slice(i, i + 2));
  }
  // 英文/数字 token
  const latin = text.toLowerCase().match(/[a-z0-9]{2,}/g) || [];
  tokens.push(...latin);
  return [...new Set(tokens.filter(t => t.length >= 2))];
}

// =============================================================================
// 同义词展开
// =============================================================================
function expandQuery(query: string): string {
  const lower = query.toLowerCase();
  const expanded: string[] = [query];

  for (const [key, synonyms] of Object.entries(SYNONYMS)) {
    for (const syn of synonyms) {
      if (lower.includes(syn.toLowerCase())) {
        expanded.push(key);
        expanded.push(...synonyms);
        break;
      }
    }
  }

  return expanded.join(' ');
}

// =============================================================================
// 提取匹配片段
// =============================================================================
function extractSnippet(content: string, queryTokens: string[], maxLen = 160): string {
  const lower = content.toLowerCase();
  for (const token of queryTokens) {
    const idx = lower.indexOf(token.toLowerCase());
    if (idx !== -1) {
      const start = Math.max(0, idx - 60);
      const end = Math.min(content.length, idx + maxLen - 60);
      const snippet = content.slice(start, end);
      return (start > 0 ? '…' : '') + snippet + (end < content.length ? '…' : '');
    }
  }
  return content.slice(0, maxLen) + (content.length > maxLen ? '…' : '');
}

// =============================================================================
// SearchRecord 类型
// =============================================================================
export interface SearchRecord {
  id: string;
  type: 'disease' | 'team' | 'aiApp' | 'patientEdu' | 'science' | 'drug';
  title: string;
  content: string;
  summary: string;
  url?: string;
  tags: string[];
  portal: 'doctor' | 'patient' | 'both';
  meta?: Record<string, string>;
  /** 匹配片段（高亮用） */
  snippet?: string;
  /** Relevance 分数 */
  score?: number;
  /** 命中的token */
  matchedTokens?: string[];
  /** 医生端专用：附加临床元数据 */
  clinicalMeta?: {
    grade?: string;
    verdict?: string;
    efficacy?: string;
    severity?: string;
    effect?: string;
    refSource?: string;
    directions?: string[];
    leader?: string;
    location?: string;
    journal?: string;
    year?: string;
    doi?: string;
  };
}

// =============================================================================
// 构建搜索索引
// =============================================================================
function buildSearchIndex(): SearchRecord[] {
  const records: SearchRecord[] = [];

  // ---- 疾病 ----
  diseases.forEach(d => {
    records.push({
      id: `disease-${d.id}`,
      type: 'disease',
      title: `${d.name}（${d.nameEn}）`,
      content: [
        d.name, d.nameEn, d.category,
        d.efficacy, d.summary, d.contraindications,
        d.gradeLabel, d.evidenceGrade,
        d.administrationRoute, d.dosage, d.frequency,
        d.protocolNote || '', d.keyRef,
      ].filter(Boolean).join(' '),
      summary: d.efficacy.slice(0, 120),
      portal: 'doctor',
      tags: [d.category, d.gradeLabel, ...d.sources.map(s => s.type)],
      meta: { grade: d.gradeLabel, category: d.category, id: d.id },
      clinicalMeta: {
        grade: d.gradeLabel,
        efficacy: d.efficacy,
      },
    });
  });

  // ---- 团队 ----
  teams.forEach(t => {
    records.push({
      id: `team-${t.id}`,
      type: 'team',
      title: `${t.name}（${t.nameShort}）`,
      content: [
        t.name, t.nameShort, t.leader, t.title,
        t.location, t.category, t.region,
        t.directions.join(' '), t.latestResult,
        t.tags.join(' '),
      ].filter(Boolean).join(' '),
      summary: `${t.location} · ${t.category} · ${t.leader}`,
      portal: 'doctor',
      tags: [t.category, t.region, ...t.tags],
      meta: { leader: t.leader, location: t.location },
      clinicalMeta: {
        leader: t.leader,
        location: t.location,
        directions: t.directions,
      },
    });
  });

  // ---- AI应用 ----
  aiApps.forEach(a => {
    records.push({
      id: `aiApp-${a.id}`,
      type: 'aiApp',
      title: `${a.name}（${a.institution}）`,
      content: [
        a.name, a.institution, a.description,
        a.keyResult, a.techAreas.join(' '), a.location,
      ].filter(Boolean).join(' '),
      summary: a.description.slice(0, 120),
      portal: 'doctor',
      tags: [...a.techAreas, a.maturity, a.type],
    });
  });

  // ---- 患者科普 ----
  patientEduArticles.forEach(a => {
    records.push({
      id: `patientEdu-${a.id}`,
      type: 'patientEdu',
      title: a.title,
      content: [
        a.title, a.summary,
        a.content.replace(/[#*`\n]/g, ''),
        a.tags.join(' '),
      ].filter(Boolean).join(' '),
      summary: a.summary,
      portal: 'patient',
      tags: a.tags,
      meta: { category: a.category },
    });
  });

  // ---- Science论文 ----
  sciencePapers.forEach(p => {
    records.push({
      id: `science-${p.id}`,
      type: 'science',
      title: p.title,
      content: [
        p.title, p.abstract,
        p.keyFindings.join(' '),
        p.tags.join(' '),
        p.authors.join(' '),
      ].filter(Boolean).join(' '),
      summary: p.abstract.slice(0, 150),
      portal: 'both',
      tags: p.tags,
      meta: { journal: p.journal, year: String(p.year), doi: p.doi },
      clinicalMeta: {
        journal: p.journal,
        year: String(p.year),
        doi: p.doi,
      },
    });
  });

  // ---- 药物相互作用 ----
  drugInteractions.forEach(d => {
    records.push({
      id: `drug-${d.drugName}`,
      type: 'drug',
      title: `${d.drugName}（${d.drugCategory}）`,
      content: [
        d.drugName, d.drugCategory,
        d.effect, d.mechanism, d.recommendation,
        d.severity,
      ].filter(Boolean).join(' '),
      summary: `[${d.severity}] ${d.recommendation}`.slice(0, 120),
      portal: 'doctor',
      tags: [d.drugCategory, d.severity],
      meta: { severity: d.severity },
      clinicalMeta: {
        severity: d.severity,
        effect: d.effect,
        refSource: d.refSource || '',
      },
    });
  });

  return records;
}

// =============================================================================
// 评分函数
// =============================================================================
function scoreRecord(record: SearchRecord, queryTokens: string[]): { score: number; matchedTokens: string[] } {
  const content = record.content.toLowerCase();
  const title = record.title.toLowerCase();
  let score = 0;
  const matchedTokens: string[] = [];

  for (const token of queryTokens) {
    const contentMatches = (content.match(new RegExp(escapeRegExp(token), 'g')) || []).length;
    const titleMatches = (title.match(new RegExp(escapeRegExp(token), 'g')) || []).length;

    if (contentMatches > 0 || titleMatches > 0) {
      matchedTokens.push(token);
      score += contentMatches * 1 + titleMatches * 5;
      // 精准匹配加分
      if (title.includes(token.toLowerCase())) {
        score += 3;
      }
    }
  }

  return { score, matchedTokens };
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// =============================================================================
// 搜索入口
// =============================================================================
export function search(
  query: string,
  portal?: 'doctor' | 'patient',
  options?: { maxResults?: number; minScore?: number }
): SearchRecord[] {
  const { maxResults = 20, minScore = 1 } = options || {};

  const queryTokens = tokenize(expandQuery(query));
  if (queryTokens.length === 0) return [];

  const index = buildSearchIndex();
  const filtered = portal
    ? index.filter(r => r.portal === portal || r.portal === 'both')
    : index;

  return filtered
    .map(r => {
      const { score, matchedTokens } = scoreRecord(r, queryTokens);
      const snippet = extractSnippet(r.content, queryTokens);
      return { ...r, score, matchedTokens, snippet };
    })
    .filter(r => (r.score ?? 0) >= minScore)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, maxResults);
}

// =============================================================================
// 分组工具
// =============================================================================
export type ResultType = SearchRecord['type'];

export const TYPE_LABELS: Record<ResultType, string> = {
  disease: '💊 疾病',
  team: '🔬 团队',
  aiApp: '🤖 AI应用',
  patientEdu: '📚 科普',
  science: '🔬 Science',
  drug: '💉 药物',
};

export const TYPE_COLORS: Record<ResultType, { bg: string; text: string; border: string }> = {
  disease: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
  team: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  aiApp: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  patientEdu: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
  science: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  drug: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
};

export interface GroupedResults {
  type: ResultType;
  label: string;
  count: number;
  records: SearchRecord[];
}

export function groupResults(results: SearchRecord[]): GroupedResults[] {
  const groups: Record<string, SearchRecord[]> = {};
  for (const r of results) {
    if (!groups[r.type]) groups[r.type] = [];
    groups[r.type].push(r);
  }
  return Object.entries(groups)
    .map(([type, records]) => ({
      type: type as ResultType,
      label: TYPE_LABELS[type as ResultType] || type,
      count: records.length,
      records,
    }))
    .sort((a, b) => b.count - a.count);
}
