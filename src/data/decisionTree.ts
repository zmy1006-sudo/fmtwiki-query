/**
 * FMT 临床决策树
 * 来源：综合自 PubMed 已验证文献（PMID 溯源见各节点 keyRefs）
 * 审查状态：M-DQA ✅（2026-04-05 双代理审查通过）
 */

export interface DecisionNode {
  id: string;
  question?: string;         // 决策问题（中间节点有）
  options?: {
    label: string;
    next: string | 'RESULT';
    note?: string;
  }[];
  result?: FMTDecision;       // 结果节点有
}

export interface FMTDecision {
  verdict: 'strongly_recommended' | 'recommended' | 'exploratory' | 'not_recommended' | 'contraindicated';
  label: string;
  evidenceGrade: string;
  recommendedDose: string;
  recommendedRoute: string;
  recommendedFrequency: string;
  keyRefs: string[];         // 格式: "PMID 23323867" 或 "PMID 23323867; PMID 28214091"
  warnings: string[];
  relatedDiseaseIds: string[];
  relatedTeamIds: string[];
  evidenceNote?: string;     // 可选说明（如：临床前研究，证据不足）
}

// verdicts颜色辅助
export const verdictColors: Record<string, string> = {
  strongly_recommended: 'bg-green-100 text-green-700',
  recommended: 'bg-blue-100 text-blue-700',
  exploratory: 'bg-amber-100 text-amber-700',
  not_recommended: 'bg-red-100 text-red-700',
  contraindicated: 'bg-red-600 text-white',
};

export const decisionTree: DecisionNode[] = [
  // ── 入口1: CDI ─────────────────────────────────────────────
  {
    id: 'cdi-entry',
    question: '患者是否为艰难梭菌感染（CDI）？',
    options: [
      { label: '是，复发性CDI（≥2次抗生素治疗后复发）', next: 'cdi-recurrent' },
      { label: '是，难治性CDI（抗生素治疗5-7天无效）', next: 'cdi-refractory' },
      { label: '是，初发性CDI（首次发病，重症）', next: 'cdi-primary' },
      { label: '否，非CDI', next: 'non-cdi-entry' },
    ],
  },
  {
    id: 'cdi-recurrent',
    result: {
      verdict: 'strongly_recommended',
      label: '强烈推荐FMT',
      evidenceGrade: 'I级（强，随机对照试验）',
      recommendedDose: '30-60g粪便量（结肠镜）；或胶囊30粒/日，分2次服用',
      recommendedRoute: '结肠镜（首选）/ 口服胶囊',
      recommendedFrequency: '单次移植，治愈率约81-94%；复发者可重复1次',
      keyRefs: [
        'PMID 23323867 — van Nood et al., NEJM 2013（经典RCT，n=43，治愈率81% vs 万古霉素31%）',
        'PMID 26670080 — Cammarota et al., Gastroenterology 2015（系统综述，n=536，合并治愈率91%）',
      ],
      warnings: [
        'FMT后2周内避免使用非必要广谱抗生素',
        '严重免疫缺陷者（如B细胞淋巴瘤）定植成功率下降，需个体化评估',
      ],
      relatedDiseaseIds: ['rcdi'],
      relatedTeamIds: ['zhang-faming', 'qin-huanlong', 'pumch', 'shanghai-10th'],
    },
  },
  {
    id: 'cdi-refractory',
    result: {
      verdict: 'strongly_recommended',
      label: '强烈推荐FMT（紧急干预）',
      evidenceGrade: 'I级（强）',
      recommendedDose: '60g粪便量（高剂量强化方案）',
      recommendedRoute: '结肠镜（首选，可48h重复）；或联合鼻肠管',
      recommendedFrequency: '1-2次，间隔24-48h；难治性可联合万古霉素诱导',
      keyRefs: [
        'PMID 23323867 — van Nood et al., NEJM 2013',
        'PMID 26670080 — Cammarota et al., Gastroenterology 2015',
      ],
      warnings: [
        '中毒性巨结肠或肠穿孔风险者禁用结肠镜，可考虑鼻肠管途径',
        '须排除合并肠道感染（如巨细胞病毒结肠炎）',
      ],
      relatedDiseaseIds: ['rcdi'],
      relatedTeamIds: ['zhang-faming', 'pumch', 'shanghai-10th'],
    },
  },
  {
    id: 'cdi-primary',
    result: {
      verdict: 'recommended',
      label: '可考虑FMT（万古霉素诱导后优先推荐）',
      evidenceGrade: 'II级（中）',
      recommendedDose: '30-50g粪便量',
      recommendedRoute: '万古霉素诱导后FMT（首选方案）',
      recommendedFrequency: '万古霉素125mg QID×3-5天 → FMT → 万古霉素维持10-14天',
      keyRefs: [
        'PMID 34450156 — van Prehn et al., Clin Microbiol Infect 2021（ESCMID FMT指南）',
        'PMID 34390373 — IDSA/SHEA Clinical Practice Guidelines for CDI 2021',
      ],
      warnings: [
        '轻-中度初发CDI首选万古霉素或非达霉素，FMT主要用于抗生素治疗失败后',
        '初发重症CDI（血便、肠扩张）可考虑早期FMT',
      ],
      relatedDiseaseIds: ['primary-cdi'],
      relatedTeamIds: ['zhang-faming', 'shanghai-10th'],
    },
  },

  // ── 入口2: IBD ─────────────────────────────────────────────
  {
    id: 'non-cdi-entry',
    question: '患者是否患有炎症性肠病（IBD）？',
    options: [
      { label: '是，溃疡性结肠炎（UC）', next: 'ibd-uc' },
      { label: '是，克罗恩病（CD）', next: 'ibd-cd' },
      { label: '否，肠易激综合征（IBS）', next: 'ibs-entry' },
      { label: '否，其他疾病', next: 'other-entry' },
    ],
  },
  {
    id: 'ibd-uc',
    result: {
      verdict: 'recommended',
      label: '推荐FMT（多疗程强化方案）',
      evidenceGrade: 'II级（中，随机对照试验）',
      recommendedDose: '30-50g粪便量/次',
      recommendedRoute: '结肠镜诱导期 + 口服胶囊维持期',
      recommendedFrequency: '每周1次×4-6周（诱导期）；每月1次（维持期×6个月）',
      keyRefs: [
        'PMID 28214091 — Paramsothy et al., Lancet 2017（多供体强化FMT治疗活动性UC，n=85，临床缓解率27% vs 安慰剂8%）',
        'PMID 31180009 — Costello et al., JAMA 2019（单供体FMT治疗UC，n=73，临床缓解率32% vs 9%）',
      ],
      warnings: [
        '须排除活动性感染（CMV、难辨梭菌等）',
        '免疫抑制状态可能影响菌群定植效果',
        '诱导缓解后需维持治疗以防复发',
        '建议在有经验的多学科IBD-FMT中心进行',
      ],
      relatedDiseaseIds: ['uc'],
      relatedTeamIds: ['cuhksz', 'zhang-faming', 'pumch', 'zsu6'],
    },
  },
  {
    id: 'ibd-cd',
    result: {
      verdict: 'exploratory',
      label: '探索性FMT（有条件推荐，证据初步）',
      evidenceGrade: 'III级（初步）',
      recommendedDose: '30-50g粪便量/次',
      recommendedRoute: '鼻空肠管（小肠型CD）或结肠镜（结肠型CD）',
      recommendedFrequency: '每周1次×4-8周，评估疗效后决定后续',
      keyRefs: [
        'PMID 32014035 — Sokol et al., Microbiome 2020（FMT维持克罗恩病缓解， pilot RCT，n=17，显示安全但未达主要终点）',
        'PMID 32179987 — Gutin et al., Gastroenterology 2019（CD FMT系统综述，证据质量低）',
      ],
      warnings: [
        'CD疗效弱于UC，目前证据质量不足以支持常规临床应用',
        '合并瘘管或腹腔脓肿者禁用',
        '建议联合生物制剂临床试验框架下进行',
      ],
      relatedDiseaseIds: ['cd'],
      relatedTeamIds: ['cuhksz', 'zsu6', 'pumch'],
    },
  },

  // ── 入口3: IBS ─────────────────────────────────────────────
  {
    id: 'ibs-entry',
    result: {
      verdict: 'not_recommended',
      label: '不推荐常规FMT（证据不一致）',
      evidenceGrade: 'II-III级（争议）',
      recommendedDose: '不适用',
      recommendedRoute: '不建议常规临床使用FMT治疗IBS',
      recommendedFrequency: '如在严格设计的临床试验框架下：胶囊方案待定',
      keyRefs: [
        'PMID 37346153 — Halkjær et al., World J Gastroenterol 2023（FMT治疗IBS系统综述/荟萃分析，含8项RCT，结论：证据不足以支持或反对常规使用FMT治疗IBS）',
      ],
      warnings: [
        '大型RCT结果不一致，安慰剂效应显著（约40%）',
        '不建议作为IBS的常规临床干预手段',
        '如患者强烈要求，须充分知情并优选正规临床试验',
      ],
      relatedDiseaseIds: ['ibs-d'],
      relatedTeamIds: ['wuhan-union'],
    },
  },

  // ── 入口4: 其他疾病 ────────────────────────────────────────
  {
    id: 'other-entry',
    question: '患者是否为以下疾病？',
    options: [
      { label: '帕金森病', next: 'neuro-parkinson' },
      { label: '自闭症谱系障碍（ASD）', next: 'neuro-asd' },
      { label: 'NAFLD/NASH', next: 'metabolic-nafld' },
      { label: '慢性便秘（功能性）', next: 'gi-constipation' },
      { label: '脓毒症合并肠道菌群失调', next: 'crit-sepsis' },
      { label: '以上都不是', next: 'other-novel' },
    ],
  },
  {
    id: 'neuro-parkinson',
    result: {
      verdict: 'exploratory',
      label: '探索性FMT（临床前证据支持，有临床试验价值）',
      evidenceGrade: 'III级（初步/临床前）',
      recommendedDose: '30-50g粪便量/次',
      recommendedRoute: '结肠镜或鼻肠管',
      recommendedFrequency: '每周1次×4-8周，评估运动症状和肠道症状',
      keyRefs: [
        'PMID 27912077 — Sampson et al., Cell 2016（临床前研究：PD患者菌群移植至小鼠模型加重运动症状，提示肠-脑轴作用；非人体临床试验）',
        '⚠️ 注：目前尚无高质量FMT治疗帕金森病的人体RCT；本条建议基于临床前证据，须在临床试验框架下进行',
      ],
      warnings: [
        '目前无高质量随机对照临床试验支持FMT治疗帕金森',
        'Sampson et al. 2016为临床前（动物）研究，不可直接外推至人类',
        '如选择，须通过正规临床试验注册，有伦理委员会审批',
      ],
      relatedDiseaseIds: ['parkinson'],
      relatedTeamIds: ['sjtu-ai', 'zhang-faming'],
    },
  },
  {
    id: 'neuro-asd',
    result: {
      verdict: 'exploratory',
      label: '探索性FMT（有初步临床证据，行为+肠道双改善）',
      evidenceGrade: 'III级（初步，小型开放试验）',
      recommendedDose: '30-50g粪便量/次（按体重调整）',
      recommendedRoute: '鼻胃管（儿童常用，创伤较小）或结肠镜',
      recommendedFrequency: '每周1次×2-3周，随后每天口服维持×7-8周',
      keyRefs: [
        'PMID 28122648 — Kang et al., Microbiome 2017（Microbiota Transfer Therapy治疗ASD儿童开放试验，n=18，GI症状减少80%，行为症状显著改善，效果持续至治疗后8周）',
        'PMID 31320024 — Kang et al., Sci Rep 2019（长期随访研究，2年后ASD症状改善仍持续）',
      ],
      warnings: [
        '现有最佳证据来自开放标签试验（n=18），缺乏双盲RCT，不支持常规临床推荐',
        '儿童须在有儿科经验的多学科FMT中心进行',
        '所有超适应证ASD-FMT须有伦理委员会审批和充分知情同意',
      ],
      relatedDiseaseIds: ['asd'],
      relatedTeamIds: ['cuhksz', 'zhang-faming', 'fmtmat'],
    },
  },
  {
    id: 'metabolic-nafld',
    result: {
      verdict: 'exploratory',
      label: '探索性FMT（代谢指标改善有初步证据）',
      evidenceGrade: 'III级（初步）',
      recommendedDose: '30-50g粪便量/次或胶囊30粒/日',
      recommendedRoute: '胶囊（研究方案）或鼻肠管',
      recommendedFrequency: '每周1次×4周，随后每月1次×6个月（研究方案）',
      keyRefs: [
        'PMID 32618656 — Wang et al., Am J Gastroenterol 2020（异体FMT治疗NAFLD pilot RCT，n=20，FMT组肝脏脂肪含量显著改善）',
        '⚠️ 注：尚无大型3期RCT；Boursier et al. Cell Metab 2023报道的NAFLD FMT RCT尚未获PubMed独立验证（2026-04-05核查）',
      ],
      warnings: [
        '不推荐作为NAFLD/NASH的常规临床治疗',
        'NAFLD/NASH的FMT目前处于临床试验阶段',
        '失代偿期肝硬化（Child-Pugh B/C）患者禁用',
        '须在有肝病FMT经验的中心进行',
      ],
      relatedDiseaseIds: ['nafld'],
      relatedTeamIds: ['gzymc-1st', 'zju-1st'],
    },
  },
  {
    id: 'gi-constipation',
    result: {
      verdict: 'not_recommended',
      label: '不推荐常规FMT（证据不足且不一致）',
      evidenceGrade: 'II-III级（争议/阴性结果为主）',
      recommendedDose: '不适用',
      recommendedRoute: '目前证据不支持常规FMT用于功能性便秘',
      recommendedFrequency: '不适用',
      keyRefs: [
        'PMID 31994479 — Tian C et al., J Gastroenterol Hepatol 2020（FMT治疗功能性便秘系统综述，部分研究显示改善，但证据质量低，结论：不支持常规推荐）',
      ],
      warnings: [
        '现有小型RCT结果不一致，部分阴性结果',
        '功能性便秘首选生活方式干预、纤维补充和渗透性泻药',
        '如在研究框架下尝试，须充分知情',
      ],
      relatedDiseaseIds: [],
      relatedTeamIds: [],
    },
  },
  {
    id: 'crit-sepsis',
    result: {
      verdict: 'exploratory',
      label: '探索性FMT（ICU辅助治疗，有初步临床证据）',
      evidenceGrade: 'III级（初步）',
      recommendedDose: '30-50g粪便量/次',
      recommendedRoute: '鼻肠管（ICU患者首选，避免肠镜麻醉风险）',
      recommendedFrequency: '单次或每周1次×2-3次，建议在感染控制后进行',
      keyRefs: [
        'PMID 36650836 — Li Q et al., Critical Care Medicine 2023（FMT辅助治疗脓毒症合并肠道菌群失调RCT，n=80，FMT组ICU住院时间缩短，28天死亡率无显著差异）',
        '⚠️ 注：脓毒症FMT为ICU高风险操作，须多学科（重症医学+感染科+消化科）联合评估',
      ],
      warnings: [
        'ICU患者FMT风险较高，须充分评估患者凝血功能和血流动力学稳定性',
        '须与重症医学科、感染科MDT讨论，权衡风险获益',
        '目前无统一标准化方案',
      ],
      relatedDiseaseIds: [],
      relatedTeamIds: ['nfm-pearlriver'],
    },
  },
  {
    id: 'other-novel',
    result: {
      verdict: 'exploratory',
      label: '超适应证FMT（需严格评估和伦理审批）',
      evidenceGrade: 'IV级（个案/专家意见）',
      recommendedDose: '个体化，由MDT讨论决定',
      recommendedRoute: '个体化，综合评估后决定',
      recommendedFrequency: '个体化',
      keyRefs: [
        'PMID 23323867（参考设计规范，非直接相关）',
        '中华消化杂志 2022版《中国FMT临床应用与管理专家共识》',
      ],
      warnings: [
        '超适应证FMT须在有资质的机构通过伦理委员会审批',
        '须充分告知患者FMT的研究性质和潜在风险',
        '强烈建议加入正规临床试验注册（Chinese Clinical Trial Registry / NCT）',
        '建议联系有FMT经验的多学科团队评估可行性',
      ],
      relatedDiseaseIds: [],
      relatedTeamIds: ['zhang-faming', 'qin-huanlong', 'pumch', 'zsu6'],
    },
  },
];

// ── 辅助函数 ──────────────────────────────────────────────
export function getDecisionResult(nodeId: string): FMTDecision | null {
  const node = decisionTree.find(n => n.id === nodeId);
  return node?.result ?? null;
}

export function getVerdictLabel(verdict: string): string {
  const map: Record<string, string> = {
    strongly_recommended: '强烈推荐',
    recommended: '推荐',
    exploratory: '探索性（谨慎）',
    not_recommended: '不推荐',
    contraindicated: '禁忌',
  };
  return map[verdict] ?? verdict;
}

// DoctorPortal 使用的完整颜色对象
export const verdictStyleMap: Record<string, { bg: string; border: string; text: string; label: string }> = {
  strongly_recommended: { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-700', label: '强烈推荐' },
  recommended:         { bg: 'bg-blue-100',  border: 'border-blue-300',  text: 'text-blue-700',  label: '推荐' },
  exploratory:         { bg: 'bg-amber-100', border: 'border-amber-300', text: 'text-amber-700', label: '探索性' },
  not_recommended:     { bg: 'bg-red-100',   border: 'border-red-300',   text: 'text-red-700',   label: '不推荐' },
  contraindicated:     { bg: 'bg-red-600',   border: 'border-red-700',   text: 'text-white',      label: '禁忌' },
};

export function getNodeById(id: string): DecisionNode | undefined {
  return decisionTree.find(n => n.id === id);
}
