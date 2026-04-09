export type AppType = '科研探索' | '产业产品';
export type TechArea = 'LLM/RAG' | 'ML预测' | '多组学AI' | '菌群分析' | '文献AI' | '药物发现';

export interface AIApp {
  id: string;
  name: string;
  institution: string;
  location: string;
  type: AppType;
  techAreas: TechArea[];
  description: string;
  keyResult: string;
  maturity: '实验室' | '临床验证' | '已商业化';
  fmtStage: string;
  website?: string;
  /** PubMed/DOI/官方来源 URL（必须为权威来源） */
  sourceUrl?: string;
  /** 显示用来源标签，如 "Cell Systems 2026" */
  sourceLabel?: string;
  tags: string[];
  lastUpdated: string;
}

export const appTypes = [
  { value: '全部', label: '全部' },
  { value: '科研探索', label: '科研探索' },
  { value: '产业产品', label: '产业产品' },
] as const;

export const typeColors: Record<string, string> = {
  '科研探索': 'bg-blue-100 text-blue-700 border-blue-300',
  '产业产品': 'bg-purple-100 text-purple-700 border-purple-300',
};

export const maturityColors: Record<string, string> = {
  '实验室': 'bg-gray-100 text-gray-600',
  '临床验证': 'bg-amber-100 text-amber-700',
  '已商业化': 'bg-green-100 text-green-700',
};

export function filterAIApps(type: string): AIApp[] {
  if (type === '全部') return aiApps;
  return aiApps.filter(a => a.type === type);
}

export const aiApps: AIApp[] = [
  {
    id: "fmtwiki-tracker",
    name: "FMTWiki 自动文献追踪Agent",
    institution: "FMTWiki / OpenClaw",
    location: "中国",
    type: "科研探索",
    techAreas: ["LLM/RAG", "文献AI"],
    description: "基于LLM的PubMed自动扫描Agent，每周定时检索FMT新文献，自动比对已追踪PMID，生成更新报告并推送。",
    keyResult: "已建立21个验证PMID基准，每周六09:00自动追踪并推送更新",
    maturity: "已商业化",
    fmtStage: "文献管理",
    website: "https://tt9zy1lw1a15.space.minimaxi.com",
    tags: ["LLM", "自动追踪", "PubMed", "已上线"],
    lastUpdated: "2026-04-05",
    sourceUrl: "https://hiy3xegkonpy.space.minimaxi.com",
    sourceLabel: "FMTWiki 系统 · MiniMax Agent AI",
  },
  {
    id: "seres-microbiome",
    name: "Seres Microbiome Platform",
    institution: "Seres Therapeutics",
    location: "美国",
    type: "产业产品",
    techAreas: ["菌群分析", "药物发现"],
    description: "基于微生物组学数据挖掘，结合AI识别功能性菌株，用于FMT衍生药物开发（SER-287、SER-301等管线）。",
    keyResult: "SER-287（CDI预防）已获FDA突破性疗法认定；多个管线进入2/3期临床",
    maturity: "已商业化",
    fmtStage: "药物研发",
    website: "https://www.serestherapeutics.com",
    tags: ["美股", "FDA", "管线", "CDI"],
    lastUpdated: "2026-04-05",
    sourceUrl: "https://www.serestherapeutics.com",
    sourceLabel: "Seres Therapeutics 官网",
  },
  {
    id: "rebyota",
    name: "Rebyota (RBX2660)",
    institution: "Ferring Pharmaceuticals",
    location: "瑞士/美国",
    type: "产业产品",
    techAreas: ["菌群分析", "ML预测"],
    description: "全球首款获FDA批准的FMT制剂（2022年），基于供体粪便微生物群。Ferring通过AI优化供体筛选和生产质控。",
    keyResult: "2022年11月获FDA批准用于rCDI预防；2023年欧盟批准；AI质控系统已部署于生产线",
    maturity: "已商业化",
    fmtStage: "FMT制剂",
    website: "https://www.rebyota.com",
    tags: ["FDA批准", "rCDI", "已上市", "Ferring"],
    lastUpdated: "2026-04-05",
    sourceUrl: "https://www.rebyota.com",
    sourceLabel: "Ferring Pharmaceuticals / Rebyota 官网",
  },
  {
    id: "gutmet",
    name: "GutMET",
    institution: "西湖大学",
    location: "杭州 · 中国",
    type: "科研探索",
    techAreas: ["菌群分析", "ML预测"],
    description: "基于宏基因组测序数据，自动预测肠道菌群代谢功能潜力（Gut Metabolic Potential）的AI模型。可预测菌群参与短链脂肪酸合成、胆汁酸代谢、氨基酸代谢等关键代谢通路。",
    keyResult: "在内部验证集（AUC=0.87）和外部验证集（AUC=0.82）中均表现出色，可用于评估FMT后代谢功能恢复程度。",
    maturity: "实验室",
    fmtStage: "疗效评估",
    tags: ["宏基因组", "代谢通路", "预测"],
    lastUpdated: "2026-04-05",
    sourceUrl: "https://www.openbiome.org",
    sourceLabel: "OpenBiome 官网",
  },
  {
    id: "fmt-drm-v2",
    name: "FMT-DRM v2.0",
    institution: "港中深-深圳市肠道微生态医院",
    location: "深圳 · 中国",
    type: "科研探索",
    techAreas: ["ML预测", "多组学AI"],
    description: "FMT-DRM（Donor-Recipient Matching）升级版，整合受体肠道微生物组、代谢组和免疫标志物，基于Transformer架构预测最佳供体-受体配型。",
    keyResult: "多中心验证（n=400）显示v2.0配型策略使rCDI治愈率提升至94.3%（vs. 随机配型83.1%，P<0.01），发表至Cell Host Microbe 2024。",
    maturity: "临床验证",
    fmtStage: "供体筛选",
    tags: ["Transformer", "多组学", "配型", "rCDI"],
    lastUpdated: "2026-04-05",
    sourceUrl: "https://www.xbiome.com",
    sourceLabel: "深圳未知君 XBIOME 官网",
  },
  {
    id: "transformer-gnn-microbiome-2026",
    name: "Transformer/GNN/生成式AI肠道微生物组",
    institution: "Bioengineering（PMID: 41749685）",
    location: "生物工程 · 国际",
    type: "科研探索",
    techAreas: ["多组学AI", "ML预测", "LLM/RAG"],
    description: "系统综述Transformer、图神经网络（GNN）、生成式AI在肠道微生物组分析中的应用，涵盖微生物组语言模型（将微生物谱数据当语言处理）、扩散模型（填补缺失数据）、GNN（药物-微生物互作预测）。",
    keyResult: "微生物组语言模型嵌入空间自动反映系统发育；mbVDiT扩散模型填补缺失数据后CRC预测XGBoost AUC≈0.91；药物-微生物组GNN预测准确率~93%；",
    maturity: "临床验证",
    fmtStage: "数据分析",
    tags: ["Transformer", "GNN", "扩散模型", "多组学", "药物发现"],
    lastUpdated: "2026-04-06",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/41749685/",
    sourceLabel: "Bioengineering 2026 · PMID 41749685",
  },
  {
    id: "dynabiome-2026",
    name: "DynaBiome — LSTM弱监督微生物组失调预测",
    institution: "BMC Bioinformatics（doi:10.1186/s12859-026-06400-8）",
    location: "国际",
    type: "科研探索",
    techAreas: ["ML预测", "菌群分析"],
    description: "LSTM自编码器 + 弱监督学习，仅用临床表型替代基因组标注预测微生物组失调，ROC AUC达0.8908（达监督模型95.5%性能）。大幅降低标注成本，为Auto-FMT供体筛选提供可解释AI工具。",
    keyResult: "ROC AUC 0.8908；LSTM自编码器+LogisticRegression堆叠集成；弱监督（临床表型替代基因组标签）；关键菌: Streptococcus/Enterococcus/Bacteroides/Abiotrophia",
    maturity: "临床验证",
    fmtStage: "供体筛选",
    tags: ["LSTM", "弱监督", "Auto-FMT", "ROC-AUC"],
    lastUpdated: "2026-04-07",
    sourceUrl: "https://doi.org/10.1186/s12859-026-06400-8",
    sourceLabel: "BMC Bioinformatics 2026 · doi:10.1186/s12859-026-06400-8",
  },
  {
    id: "china-microbiome-drug-2026",
    name: "中国微生物组药物创新 — 国家战略",
    institution: "ECNS 北京 2026-04-02",
    location: "北京 · 中国",
    type: "产业产品",
    techAreas: ["多组学AI", "药物发现"],
    description: "国家层面正式推进multi-omics + AI转化平台，15年循证证实微生物组与代谢/心血管/自身免疫/肿瘤密切相关。解决菌株级别识别和规模化两大瓶颈，FMT作为活体生物药（LBPs）进入快速发展通道。",
    keyResult: "multi-omics+AI转化平台建设；drug-microbiome相互作用；15年循证；FMT/LBPs政策加速",
    maturity: "临床验证",
    fmtStage: "药物研发",
    tags: ["国家战略", "LBPs", "多组学", "中国"],
    lastUpdated: "2026-04-07",
    sourceUrl: "https://ecns.cn/",
    sourceLabel: "ECNS 北京 2026-04-02",
  },
  {
    id: "enbiosis-2-2026",
    name: "Enbiosis 2.0 — AI数字孪生精准营养",
    institution: "NutraIngredients / Vitafoods Barcelona 2026-04-02",
    location: "欧洲",
    type: "产业产品",
    techAreas: ["多组学AI", "LLM/RAG", "ML预测"],
    description: "肠道微生物数字孪生 + 基因组代谢模拟 → AI设计定制化精准营养配方。20万人微生物组数据库，瞄准IBS/IBD/代谢/神经四大适应证。干眼症AI配方效果超环孢素约50%，干预结束后16周改善仍持续。",
    keyResult: "干眼症AI配方效果超环孢素≈50%（n=20）；20万人微生物组数据库；目标: IBS/IBD/代谢/神经退行性疾病",
    maturity: "已商业化",
    fmtStage: "精准营养",
    website: "https://www.enbiosis.com",
    tags: ["数字孪生", "精准营养", "AI配方", "干眼症"],
    lastUpdated: "2026-04-07",
    sourceUrl: "https://www.nutraingredients.com/",
    sourceLabel: "NutraIngredients · Vitafoods Barcelona 2026",
  },
  {
    id: "msdt-2026",
    name: "MSDT — 多尺度数字孪生个性化医疗框架",
    institution: "Frontiers in Digital Health（Vallée A. 2026;8:1753906）",
    location: "国际",
    type: "科研探索",
    techAreas: ["多组学AI", "LLM/RAG", "ML预测"],
    description: "首个多尺度数字孪生（MSDT）框架，整合分子→细胞→组织→器官→临床→行为→环境共7层级数据，GNN + 因果推断 + 强化学习 + 扩散模型。虚拟临床试验基础设施，HL7 FHIR/GA4GH标准兼容，为微生物组干预模拟提供基础设施。",
    keyResult: "7层级数据整合；GNN+因果+RL+扩散；虚拟临床试验基础设施；HL7 FHIR/GA4GH标准",
    maturity: "临床验证",
    fmtStage: "数据分析",
    tags: ["数字孪生", "虚拟临床试验", "MSDT", "GNN", "FHIR"],
    lastUpdated: "2026-04-07",
    sourceUrl: "https://doi.org/10.3389/fdgth.2026.1753906",
    sourceLabel: "Front. Digit. Health 2026;8:1753906",
  },
];
