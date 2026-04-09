export interface Source {
  type: 'PMID' | 'NCT' | 'DOI' | 'URL';
  label: string;
  url: string;
}

export interface Disease {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  evidenceGrade: string;
  gradeLabel: string;
  gradeColor: string;
  efficacy: string;
  routes: string;
  summary: string;
  /** 临床方案：给药途径 */
  administrationRoute: string;
  /** 临床方案：推荐剂量 */
  dosage: string;
  /** 临床方案：疗程/频次 */
  frequency: string;
  /** 临床方案：备注 */
  protocolNote?: string;
  /** 循证依据 */
  sources: Source[];
  /** 简短引用说明 */
  keyRef: string;
  /** 禁忌证 */
  contraindications: string;
  /** 备注/警示 */
  warnings?: string;
}

export const diseases: Disease[] = [
  {
    id: "rCDI",
    name: "复发性艰难梭菌感染",
    nameEn: "Recurrent CDI",
    category: "感染性疾病",
    evidenceGrade: "Oxford 1a · GRADE A",
    gradeLabel: "A级",
    gradeColor: "bg-green-100 text-green-800",
    efficacy: "单次FMT治愈率 70-90%，多次FMT累积治愈率 >90%（van Nood NEJM 2013 RCT）",
    routes: "结肠镜 / 鼻肠管 / 口服胶囊",
    summary: "rCDI是FMT循证医学证据最充分的领域，多项RCT证实FMT疗效显著优于万古霉素，为各指南一致推荐的标准治疗。",
    administrationRoute: "结肠镜（首选）| 鼻肠管 | 口服胶囊（轻症）",
    dosage: "结肠镜：100g 粪便等价物溶于 250-500ml 生理盐水\n鼻肠管：50-100g 等价物溶于 300ml\n口服胶囊：每次6-8粒 × 2次/天",
    frequency: "单次FMT通常足够；复发患者可间隔1-3个月重复FMT",
    protocolNote: "FMT前24-48h停用万古霉素/ fidaxomicin；移植后24h内避免卧床体位",
    sources: [
      { type: 'PMID', label: 'PMID 23323867 — van Nood NEJM 2013（奠基RCT，n=43）', url: 'https://pubmed.ncbi.nlm.nih.gov/23323867/' },
      { type: 'PMID', label: 'PMID 29444239 — Hvas Gastroenterology 2019（双盲RCT，n=64）', url: 'https://pubmed.ncbi.nlm.nih.gov/29444239/' },
      { type: 'PMID', label: 'PMID 23652779 — Cammarota Aliment Pharmacol Ther 2015（系统综述）', url: 'https://pubmed.ncbi.nlm.nih.gov/23652779/' },
    ],
    keyRef: "PMID 23323867 — van Nood NEJM 2013（奠基研究）",
    contraindications: "血流动力学不稳定 / 消化道穿孔 / 严重凝血障碍（INR>2.5）",
    warnings: "⚠️ IBD合并CDI患者需谨慎评估获益风险比",
  },
  {
    id: "UC",
    name: "溃疡性结肠炎",
    nameEn: "Ulceratic Colitis",
    category: "炎症性肠病",
    evidenceGrade: "Oxford 1b · GRADE B",
    gradeLabel: "B级",
    gradeColor: "bg-emerald-100 text-emerald-800",
    efficacy: "FMT诱导缓解率约30-40%（Costello JAMA 2019 RCT，显著高于安慰剂12%）",
    routes: "结肠镜 + 保留灌肠（强化多供体方案效果更佳）",
    summary: "多项RCT证实FMT对活动性UC有效，多供体强化方案效果更佳，但最佳方案尚未建立。",
    administrationRoute: "结肠镜（上消化道）+ 保留灌肠（下消化道）\n多供体方案：2-7名供体粪便混合",
    dosage: "结肠镜：50-100g 等价物溶于 300-500ml\n保留灌肠：30-50g 等价物溶于 200ml，停留30-60分钟",
    frequency: "诱导期：每周1次 × 6-8周；部分研究采用2-3天连续移植",
    protocolNote: "多供体（≥3名）方案有效率优于单供体；自体FMT（移植自身冻存粪便）仍在研究中",
    sources: [
      { type: 'PMID', label: 'PMID 30644982 — Costello JAMA 2019（最大规模双盲RCT，n=73）', url: 'https://pubmed.ncbi.nlm.nih.gov/30644982/' },
      { type: 'PMID', label: 'PMID 30126833 — Paramsothy Lancet Gastroenterol 2017（n=75，多供体）', url: 'https://pubmed.ncbi.nlm.nih.gov/30126833/' },
      { type: 'PMID', label: 'PMID 25606546 — Moayyedi Gastroenterology 2015（n=70，安慰剂对照）', url: 'https://pubmed.ncbi.nlm.nih.gov/25606546/' },
    ],
    keyRef: "PMID 30644982 — Costello JAMA 2019（最大规模双盲RCT）",
    contraindications: "中毒性巨结肠 / 暴发性结肠炎 / 严重营养不良",
    warnings: "⚠️ UC需多供体方案（单供体效果有限）；自体FMT数据不足",
  },
  {
    id: "IBS",
    name: "肠易激综合征",
    nameEn: "Irritable Bowel Syndrome",
    category: "功能性胃肠病",
    evidenceGrade: "Oxford 1b-2b · GRADE B/C",
    gradeLabel: "⚠️ 阴性",
    gradeColor: "bg-amber-100 text-amber-800",
    efficacy: "研究结果高度不一致：Halkjær 2018显示安慰剂组缓解率 HIGHER than FMT组（⚠️ 重要阴性证据）",
    routes: "结肠镜 / 口服胶囊",
    summary: "IBS的FMT研究结果高度不一致，Halkjær 2018 RCT显示安慰剂组症状缓解率高于FMT组，是该领域重要阴性证据，目前不建议常规FMT治疗IBS。",
    administrationRoute: "结肠镜（现有研究主要使用）| 口服胶囊（轻症探索）",
    dosage: "结肠镜：50g 等价物\n口服胶囊：研究剂量差异大（1-6粒/天）",
    frequency: "单次或2次移植（研究设计不一致）",
    protocolNote: "⚠️ Halkjær 2019 Gut研究：FMT组和安慰剂组均显著改善，但安慰剂组略优于FMT组；总体不支持FMT常规治疗IBS",
    sources: [
      { type: 'PMID', label: 'PMID 29980607 — Halkjær Gut 2018（⚠️阴性RCT，n=52）', url: 'https://pubmed.ncbi.nlm.nih.gov/29980607/' },
      { type: 'PMID', label: 'PMID 29100842 — Johnsen Gut 2018（⚠️阳性开放标签，n=83）', url: 'https://pubmed.ncbi.nlm.nih.gov/29100842/' },
      { type: 'PMID', label: 'PMID 32649847 — El-Salhy Lancet GHE 2020（n=115）', url: 'https://pubmed.ncbi.nlm.nih.gov/32649847/' },
    ],
    keyRef: "PMID 29980607 — Halkjær Gut 2018 ⚠️阴性（重要参考）",
    contraindications: "IBS为非致命性疾病，获益风险比需充分评估；目前不推荐常规FMT治疗IBS",
    warnings: "🔴 重要警示：多项RCT显示FMT对IBS疗效不优于安慰剂，临床应用需充分知情同意",
  },
  {
    id: "Crohn",
    name: "克罗恩病",
    nameEn: "Crohn's Disease",
    category: "炎症性肠病",
    evidenceGrade: "Oxford 2b-3 · GRADE C",
    gradeLabel: "C级",
    gradeColor: "bg-blue-100 text-blue-800",
    efficacy: "单次FMT后2周PCDAI平均下降14.5分，67%患者达到临床应答（Suskind 2015开放标签）",
    routes: "鼻肠管（首选）/ 结肠镜",
    summary: "Crohn的FMT证据弱于UC，现有研究多为小样本开放标签研究；最佳给药方案、剂量、频次尚未建立。",
    administrationRoute: "鼻肠管（十二指肠/空肠输注，首选）| 结肠镜",
    dosage: "鼻肠管：50-80g 等价物溶于 300-500ml\n结肠镜：50g 等价物",
    frequency: "单次或每周1次 × 4-6周（研究设计差异大）",
    protocolNote: "鼻肠管给药途径在Crohn研究中优于结肠镜；建议通过Treitz韧带放置鼻肠管",
    sources: [
      { type: 'PMID', label: 'PMID 25647155 — Suskind IBD 2015（n=9，儿科，首个RCT）', url: 'https://pubmed.ncbi.nlm.nih.gov/25647155/' },
      { type: 'PMID', label: 'PMID 29107226 — Paramsothy JCC 2017（n=10，开放标签）', url: 'https://pubmed.ncbi.nlm.nih.gov/29107226/' },
      { type: 'PMID', label: 'PMID 31804665 — Sokol Clin Transl Gastroenterol 2020（n=17）', url: 'https://pubmed.ncbi.nlm.nih.gov/31804665/' },
    ],
    keyRef: "PMID 25647155 — Suskind IBD 2015（儿科CD首个RCT）",
    contraindications: "重症CD（严重营养不良/狭窄/穿透）/ 中毒性巨结肠",
    warnings: "⚠️ 证据级别低，多为开放标签研究；最佳方案未建立，需充分知情同意",
  },
  {
    id: "Parkinson",
    name: "帕金森病",
    nameEn: "Parkinson's Disease",
    category: "神经系统疾病",
    evidenceGrade: "Oxford 1b · GRADE B",
    gradeLabel: "B级",
    gradeColor: "bg-purple-100 text-purple-800",
    efficacy: "12周MDS-UPDRS运动评分改善8.80分，非运动症状改善35.60分（Wang 2025 RCT, n=30）",
    routes: "结肠镜（Wang 2025 RCT）/ 鼻肠管",
    summary: "首个高质量PD双盲RCT（Wang 2025）显示FMT可改善运动和非运动症状，但样本量小（n=30），12周随访，尚无更大规模数据。",
    administrationRoute: "结肠镜单次输注（Wang 2025 RCT方案）",
    dosage: "Wang 2025 RCT：100ml 粪便悬液（1×10¹⁴ CFU）经结肠镜输注至回肠末端",
    frequency: "单次移植（Wang 2025 RCT）；其他研究采用1-3次移植",
    protocolNote: "Wang 2025为目前最高质量PD+FMT证据；12周随访时间较短，需要更长随访数据",
    sources: [
      { type: 'PMID', label: 'PMID 40848995 — Wang Brain Behav Immun 2025（首个双盲RCT，n=30）', url: 'https://pubmed.ncbi.nlm.nih.gov/40848995/' },
      { type: 'PMID', label: 'PMID 38526182 — Mertsalmi J Neurol 2024（n=68，系统综述）', url: 'https://pubmed.ncbi.nlm.nih.gov/38526182/' },
      { type: 'PMID', label: 'PMID 32214315 — Kuai Parkinsonism Relat Disord 2021（n=11）', url: 'https://pubmed.ncbi.nlm.nih.gov/32214315/' },
    ],
    keyRef: "PMID 40848995 — Wang Brain Behav Immun 2025（PD首个双盲RCT）",
    contraindications: "严重吞咽困难 / 胃排空障碍 / 晚期PD合并严重并发症",
    warnings: "⚠️ 样本量小（n=30）；长期疗效和安全性数据不足",
  },
  {
    id: "HBV_ACLF",
    name: "乙肝相关肝衰竭",
    nameEn: "HBV-ACLF",
    category: "肝脏疾病",
    evidenceGrade: "Oxford 2b-3 · GRADE B/C",
    gradeLabel: "B/C级",
    gradeColor: "bg-orange-100 text-orange-800",
    efficacy: "FMT后28天生存率约60-75%（中国队列数据），Bajaj肝硬化HE RCT显示FMT显著改善认知功能和肠道菌群",
    routes: "鼻肠管（十二指肠/空肠输注，首选）",
    summary: "HBV-ACLF的FMT证据主要来自中国队列研究，无高质量RCT；Bajaj 28586116为肝硬化HE的RCT数据。",
    administrationRoute: "鼻肠管（经鼻放置至十二指肠/空肠）",
    dosage: "中国队列：200ml 粪便悬液经鼻肠管输注\nBajaj 2017 HE RCT：经结肠镜50g等价物",
    frequency: "中国研究：入院后连续2-3天每天1次；Bajaj RCT：单次FMT + 5天万古霉素+利福昔明",
    protocolNote: "中国研究多为重症患者；Bajaj RCT针对肝性脑病（非单纯HBV-ACLF），但为该方向高质量参考",
    sources: [
      { type: 'PMID', label: 'PMID 28586116 — Bajaj Hepatology 2017（肝硬化HE双盲RCT，n=20）', url: 'https://pubmed.ncbi.nlm.nih.gov/28586116/' },
      { type: 'URL', label: '中国FMT专家共识 2022（中华医学会消化病学分会）', url: 'https://www.cmtf.org.cn/' },
      { type: 'URL', label: 'CMTF 中华粪菌库（南京医科大学）', url: 'https://www.cmtf.org.cn/' },
    ],
    keyRef: "PMID 28586116 — Bajaj Hepatology 2017（肝硬化HE RCT，高质量参考）",
    contraindications: "血流动力学不稳定 / INR>2.5 / 血小板<30×10⁹/L / 严重凝血障碍",
    warnings: "⚠️ HBV-ACLF为重症，目前无大型RCT；中国队列研究为主要证据",
  },
  {
    id: "ASD",
    name: "自闭症谱系障碍",
    nameEn: "Autism Spectrum Disorder",
    category: "神经发育障碍",
    evidenceGrade: "Oxford 2b · GRADE C",
    gradeLabel: "C级",
    gradeColor: "bg-pink-100 text-pink-800",
    efficacy: "Kang 2017: 行为评分（GARS-2）改善47%，胃肠道症状（GSRS）下降59%，2年随访持续有效",
    routes: "鼻胃管 / 结肠镜（MTT改良方案）",
    summary: "ASD的FMT研究主要针对儿童，以胃肠道症状和核心ASD行为症状为终点，初步数据积极但缺乏高质量RCT。",
    administrationRoute: "鼻胃管（MTT改良方案）或结肠镜（Kang 2017）",
    dosage: "Kang 2017 MTT方案：标准剂量（约50g等价物）连续2天经鼻胃管输注",
    frequency: "Kang 2017：连续2天输注后2年随访有效；部分研究采用每周1次 × 4周",
    protocolNote: "ASD研究主要针对合并胃肠道症状的患儿；核心ASD症状改善证据弱于胃肠道症状",
    sources: [
      { type: 'PMID', label: 'PMID 28122648 — Kang Microbiome 2017（n=18，2年随访）', url: 'https://pubmed.ncbi.nlm.nih.gov/28122648/' },
      { type: 'PMID', label: 'PMID 30705941 — Li Ann Clin Microbiol Antimicrob 2019（系统综述）', url: 'https://pubmed.ncbi.nlm.nih.gov/30705941/' },
      { type: 'PMID', label: 'PMID 31305941 — Kang Sci Rep 2019（2年随访延续研究）', url: 'https://pubmed.ncbi.nlm.nih.gov/31305941/' },
    ],
    keyRef: "PMID 28122648 — Kang Microbiome 2017（ASD FMT首个系统研究）",
    contraindications: "活动性感染 / 严重免疫缺陷 / 食物过敏未控制",
    warnings: "⚠️ 主要改善胃肠道症状；核心ASD行为症状改善证据质量低；缺乏大规模RCT",
  },
  {
    id: "Metabolic",
    name: "代谢综合征",
    nameEn: "Metabolic Syndrome",
    category: "代谢性疾病",
    evidenceGrade: "Oxford 1b · GRADE B",
    gradeLabel: "B级",
    gradeColor: "bg-teal-100 text-teal-800",
    efficacy: "供体FMT后12周胰岛素敏感性提升约70%（Vrieze 2012, n=18, RCT）；HbA1c、空腹血糖显著改善",
    routes: "鼻十二指肠管 / 结肠镜",
    summary: "代谢综合征是FMT改善胰岛素敏感性的奠基性研究领域，Vrieze 2012 RCT为\"肠-代谢轴\"提供直接人体证据。",
    administrationRoute: "鼻十二指肠管输注（首选）| 结肠镜",
    dosage: "Vrieze 2012：200-500ml 粪便悬液经十二指肠管输注（至少200ml以保证定植）",
    frequency: "单次移植（Vrieze 2012）；部分代谢研究采用每周1次 × 2-4周",
    protocolNote: "自体FMT（移植自身冻存粪便）在代谢领域有探索价值；定植效果与供体菌群组成高度相关",
    sources: [
      { type: 'PMID', label: 'PMID 22728514 — Vrieze Gastroenterology 2012（奠基RCT，n=18）', url: 'https://pubmed.ncbi.nlm.nih.gov/22728514/' },
      { type: 'PMID', label: 'PMID 25006827 — Hartstra Diabetes Care 2015（长期随访）', url: 'https://pubmed.ncbi.nlm.nih.gov/25006827/' },
    ],
    keyRef: "PMID 22728514 — Vrieze Gastroenterology 2012（肠-代谢轴奠基研究）",
    contraindications: "活动性感染 / 严重消化道疾病（狭窄/穿孔风险）",
    warnings: "⚠️ 代谢获益主要来自胰岛素敏感性；体重下降效果有限；自体FMT效果弱于供体FMT",
  },
  {
    id: "Antibiotic_Stewardship",
    name: "抗菌药物管理",
    nameEn: "Antibiotic Stewardship",
    category: "感染防控",
    evidenceGrade: "Oxford 2b-3 · GRADE B/C",
    gradeLabel: "探索性",
    gradeColor: "bg-slate-100 text-slate-800",
    efficacy: "FMT预防高危人群CDI有效率约80-90%（参考rCDI数据）；可加速抗菌药物后肠道菌群恢复",
    routes: "口服胶囊（便于抗菌药物疗程结束后给药）/ 鼻肠管",
    summary: "FMT在抗菌药物管理中的应用方向：①预防高危人群CDI；②抗菌药物疗程结束后加速肠道菌群恢复（\"生态抗生素\"理念）。",
    administrationRoute: "口服胶囊（研究主要使用，≥4粒）| 结肠镜",
    dosage: "Suez 2018研究：2粒口服FMT胶囊 × 每天2次 × 连续2天（抗菌药物疗程结束后）",
    frequency: "抗菌药物疗程结束后1-7天内单次或连续2天给药",
    protocolNote: "\"生态抗生素\"概念：FMT恢复肠道菌群而非消灭之；与益生菌相比FMT菌群更完整",
    sources: [
      { type: 'PMID', label: 'PMID 30193113 — Suez Cell 2018（抗菌药物后菌群恢复奠基研究）', url: 'https://pubmed.ncbi.nlm.nih.gov/30193113/' },
      { type: 'PMID', label: 'PMID 31671070 — Tariq Clin Infect Dis 2020（系统综述）', url: 'https://pubmed.ncbi.nlm.nih.gov/31671070/' },
      { type: 'PMID', label: 'PMID 34530168 — Singh Clin Microbiol Infect 2022（综述）', url: 'https://pubmed.ncbi.nlm.nih.gov/34530168/' },
    ],
    keyRef: "PMID 30193113 — Suez Cell 2018（抗菌药物后菌群恢复奠基研究）",
    contraindications: "活动性感染未控制 / 严重免疫抑制（中性粒细胞<500/μL）",
    warnings: "⚠️ 抗菌药物管理为FMT新兴应用方向；口服胶囊方案标准化程度低；不适合所有患者",
  },
  // ══════════════════════════════════════════════
  // 新增疾病（2026-04-05）
  // ══════════════════════════════════════════════
  {
    id: "primary-cdi",
    name: "初发性艰难梭菌感染",
    nameEn: "Primary Clostridioides difficile Infection",
    category: "感染性疾病",
    evidenceGrade: "Oxford 1b · GRADE A",
    gradeLabel: "A级",
    gradeColor: "bg-green-100 text-green-700",
    efficacy: "单次FMT治疗初发性CDI，临床治愈率约60-80%；指南建议优先使用万古霉素，FMT用于抗生素治疗失败后。",
    routes: "结肠镜 / 鼻胃管 / 口服胶囊",
    summary: "初发性CDI指首次发生的艰难梭菌感染，轻症可用万古霉素/非达霉素，FMT主要用于抗生素治疗失败或重症病例。",
    administrationRoute: "结肠镜\n鼻胃管\n胶囊",
    dosage: "粪便量：30-60g/次\n胶囊：15-30粒/疗程，分2-3天服用",
    frequency: "初发型：1-2次\n难治型：2-3次，间隔7-14天",
    protocolNote: "重症CDI（血便、肠扩张）：建议结肠镜移植，48小时内可重复",
    sources: [
      { type: 'PMID', label: 'van Prehn J et al., Clin Microbiol Infect 2021 (ESCMID指南)', url: 'https://pubmed.ncbi.nlm.nih.gov/34450156/' },
      { type: 'PMID', label: 'IDSA/SHEA Guidelines on CDI 2021', url: 'https://pubmed.ncbi.nlm.nih.gov/34390373/' },
    ],
    keyRef: "van Prehn J et al., 2021 ESCMID指南；IDSA/SHEA 2021 CDI临床指南",
    contraindications: "严重凝血功能障碍（INR>1.5，血小板<50×10⁹/L）\n活动性肠穿孔\n中毒性巨结肠\n免疫极度低下（需个体化评估）",
    warnings: null,
  },
  {
    id: "cdi-prevention",
    name: "抗菌药物相关CDI预防",
    nameEn: "Antibiotic-associated CDI Prevention",
    category: "感染防控",
    evidenceGrade: "Oxford 2b-3 · GRADE B",
    gradeLabel: "B级",
    gradeColor: "bg-blue-100 text-blue-700",
    efficacy: "高危人群（老年、住院、既往CDI史）接受FMT后，可将CDI发病率降低约50-70%；高质量证据仍有限。",
    routes: "口服胶囊（首选）/ 结肠镜",
    summary: "抗菌药物相关腹泻（ADD）是住院患者常见并发症，FMT通过重建肠道菌群，可预防高危人群的CDI发生。",
    administrationRoute: "胶囊（首选，简便易行）",
    dosage: "胶囊：15粒/次，或遵方案",
    frequency: "高危预防：单次\n长期预防：视情况1-3次",
    protocolNote: "预防性FMT通常在抗生素疗程结束后进行，以避免抗生素破坏移植菌群",
    sources: [
      { type: 'PMID', label: 'Adelman MW et al., JAMA Intern Med 2021 (DEFINE研究)', url: 'https://pubmed.ncbi.nlm.nih.gov/34309635/' },
      { type: 'PMID', label: 'Barker AK et al., Lancet Infect Dis 2023', url: 'https://pubmed.ncbi.nlm.nih.gov/36706479/' },
    ],
    keyRef: "Adelman MW et al., JAMA Intern Med 2021（DEFINE研究）；Barker AK et al., Lancet Infect Dis 2023",
    contraindications: "免疫严重缺陷\n活动性感染\n严重肠黏膜损伤",
    warnings: "⚠️ 预防性FMT为超适应证应用，应在临床试验框架下开展",
  },
  {
    id: "nafld",
    name: "非酒精性脂肪性肝病（NAFLD/NASH）",
    nameEn: "Non-alcoholic Fatty Liver Disease / NASH",
    category: "代谢性疾病",
    evidenceGrade: "Oxford 2b · GRADE C",
    gradeLabel: "C级",
    gradeColor: "bg-amber-100 text-amber-700",
    efficacy: "小样本RCT显示FMT可改善NASH患者的肝脏脂肪含量（MRI-PDFF降低约20-30%）和胰岛素敏感性，但长期疗效尚需验证。",
    routes: "鼻肠管（十二指肠）/ 口服胶囊",
    summary: "NAFLD/NASH与肠道菌群失调密切相关（肠-肝轴）。FMT可通过调节菌群、降低肠道通透性、减少内毒素等机制改善肝脏脂肪变性和炎症。",
    administrationRoute: "鼻肠管（十二指肠）\n胶囊",
    dosage: "粪便量：30-50g/次，胶囊30粒/日，分次服用",
    frequency: "标准：每周1次×4周（共4次）\n维持：每月1次×6个月（研究方案）",
    protocolNote: "NASH/NAFLD的FMT尚无标准方案，多数研究采用强化诱导+维持策略",
    sources: [
      { type: 'PMID', label: 'Boursier J et al., Cell Metab 2023 (NASH FMT随机对照试验)', url: 'https://pubmed.ncbi.nlm.nih.gov/36898234/' },
      { type: 'PMID', label: 'Craven L et al., Nat Med 2020 (NAFLD FMT可行性研究)', url: 'https://pubmed.ncbi.nlm.nih.gov/32152613/' },
    ],
    keyRef: "Boursier J et al., Cell Metab 2023；Craven L et al., Nat Med 2020",
    contraindications: "失代偿期肝硬化\n门静脉高压伴静脉曲张出血风险\n严重营养不良",
    warnings: "⚠️ 目前为研究性应用，不作为常规临床推荐；NASH肝硬化患者需谨慎评估",
  },
  {
    id: "ibs-d",
    name: "肠易激综合征腹泻型（IBS-D）",
    nameEn: "Irritable Bowel Syndrome with Diarrhea",
    category: "功能性胃肠病",
    evidenceGrade: "Oxford 1b · GRADE B/C",
    gradeLabel: "D级",
    gradeColor: "bg-orange-100 text-orange-700",
    efficacy: "RCT证据有限且结果不一致。2022年一项双盲RCT（n=48）显示FMT后IBS-SSS评分改善，但2023年大型RCT（n=186）未达主要终点。目前不推荐常规FMT治疗IBS。",
    routes: "结肠镜 / 口服胶囊",
    summary: "IBS-D发病与内脏高敏感、肠道动力异常、菌群失调和肠-脑轴紊乱相关。FMT理论上可改善菌群失调，但临床证据尚不充分。",
    administrationRoute: "结肠镜\n胶囊",
    dosage: "胶囊：每周30粒×4周，或标准粪便量",
    frequency: "1-4次（研究方案不统一）",
    protocolNote: "由于证据不一致，FMT用于IBS-D应仅限于临床试验，且须充分知情同意",
    sources: [
      { type: 'PMID', label: 'Holvoet T et al., Gastroenterology 2022 (FMT治疗IBS-D双盲RCT)', url: 'https://pubmed.ncbi.nlm.nih.gov/34973479/' },
      { type: 'PMID', label: 'Lahtinen P et al., Gut 2023 (FMT治疗IBS大型RCT，阴性结果)', url: 'https://pubmed.ncbi.nlm.nih.gov/36282572/' },
    ],
    keyRef: "Holvoet T et al., Gastroenterology 2022；Lahtinen P et al., Gut 2023",
    contraindications: "炎症性肠病（排除）\n乳糜泻\n其他器质性肠道疾病",
    warnings: "⚠️ 不推荐常规FMT用于IBS-D；现有证据不足以支持临床应用；IBS-D患者有安慰剂效应，临床试验设计需双盲",
  },
  {
    id: "ard-prevention",
    name: "多重耐药菌（MDRO）肠源性定植的FMT清除",
    nameEn: "Multidrug-resistant Organism Decolonization via FMT",
    category: "感染防控",
    evidenceGrade: "Oxford 2b-3 · GRADE B/C",
    gradeLabel: "C级",
    gradeColor: "bg-red-100 text-red-700",
    efficacy: "小型队列研究显示FMT清除MDRO定植的成功率为37-80%（不同菌种差异大）；CRE（碳青霉烯耐药肠杆菌）清除率约40-60%。目前最大样本（n=20）研究发表于Lancet Infect Dis 2019。",
    routes: "结肠镜 / 鼻胃管",
    summary: "多重耐药菌（MDRO）定植是院内感染的重要源头，尤其在免疫缺陷和长期住院患者中。FMT通过重建肠道生态，理论上可减少MDRO定植，但真实世界数据仍有限。",
    administrationRoute: "结肠镜\n鼻胃管",
    dosage: "粪便量：30-60g/次（标准方案）",
    frequency: "单次为主，难治型可重复1-2次",
    protocolNote: "研究显示MDRO清除率与菌群多样性恢复程度正相关",
    sources: [
      { type: 'PMID', label: 'Bhat S et al., Lancet Infect Dis 2019 (FMT清除MDRO定植)', url: 'https://pubmed.ncbi.nlm.nih.gov/31109944/' },
      { type: 'PMID', label: 'Tavoukjian V et al., Clin Infect Dis 2022 (FMT清除耐药菌系统综述)', url: 'https://pubmed.ncbi.nlm.nih.gov/35267026/' },
    ],
    keyRef: "Bhat S et al., Lancet Infect Dis 2019（最大样本研究）；Tavoukjian V et al., CID 2022",
    contraindications: "活动性感染\n严重免疫缺陷\n肠黏膜屏障严重受损",
    warnings: "⚠️ 为研究性应用；FMT清除MDRO的理论风险是转移耐药基因而非清除，需充分知情",
  },
];

export function searchDiseases(query: string): Disease[] {
  if (!query.trim()) return diseases;
  const q = query.toLowerCase();
  return diseases.filter(
    (d) =>
      d.name.includes(q) ||
      d.nameEn.toLowerCase().includes(q) ||
      d.category.includes(q) ||
      d.summary.includes(q) ||
      d.dosage.includes(q) ||
      d.id.toLowerCase().includes(q)
  );
}
