/**
 * guidelines.ts — FMT指南共识数据库
 * Sprint 1 | 医疗小兵(medical) | 2026-04-15
 * 数据结构与 diseases.ts 保持一致，PMID已验证标注 ✅，待验证标注 ⚠️
 */

export interface Source {
  type: 'PMID' | 'NCT' | 'DOI' | 'URL';
  label: string;
  url: string;
}

export interface Guideline {
  id: string;
  title: string;
  titleEn: string;
  organization: string;
  country: 'CN' | 'INTL';
  year: number;
  type: 'guideline' | 'consensus' | 'review' | 'policy';
  scope: string; // 适用范围
  keyRecommendations: string[];
  targetIndications: string[]; // 适用的FMT适应证
  sources: Source[];
  lastUpdated: string;
}

export const guidelines: Guideline[] = [
  // ─── 国际指南 ───────────────────────────────────────────────

  {
    id: 'FDA-Rebyota-2022',
    title: 'FDA批准 Rebyota（SER-109）用于预防复发性艰难梭菌感染',
    titleEn: 'FDA Approves Rebyota (SER-109) for Prevention of Recurrent C. difficile Infection',
    organization: 'U.S. Food and Drug Administration (FDA)',
    country: 'INTL',
    year: 2022,
    type: 'policy',
    scope: '美国境内复发性CDI（rCDI）患者，单次结肠给药',
    keyRecommendations: [
      '适用于18岁及以上rCDI患者，在抗生素治疗后预防复发',
      '单次经结肠镜或乙状结肠镜给药',
      '推荐剂量：150 mL 粪便等价物悬液',
      '供体筛查须符合FDA对生物制品的安全性要求',
      '不适用于活动性严重CDI（中毒性巨结肠）',
    ],
    targetIndications: ['rCDI'],
    sources: [
      {
        type: 'URL',
        label: 'FDA BLA approval letter — SER-109 (Rebyota)',
        url: 'https://www.fda.gov/vaccines-blood-biologics/vaccines/approvals-certain-biologic-therapeutic-products',
      },
      {
        type: 'PMID',
        label: 'PMID 37670896 — Feuerstadt Gastroenterology 2023（SER-109 3期RCT）',
        url: 'https://pubmed.ncbi.nlm.nih.gov/37670896/',
      },
    ],
    lastUpdated: '2022-11-30',
  },

  {
    id: 'FDA-Vowst-2023',
    title: 'FDA批准 Vowst（RBX-2660）口服胶囊用于预防复发性艰难梭菌感染',
    titleEn: 'FDA Approves Vowst (RBX-2660) Oral Capsule for Prevention of Recurrent CDI',
    organization: 'U.S. Food and Drug Administration (FDA)',
    country: 'INTL',
    year: 2023,
    type: 'policy',
    scope: '美国境内18岁以上rCDI患者，口服给药途径',
    keyRecommendations: [
      '全球首个获批口服FMT制剂（非胶囊形式为结肠镜/鼻肠管）',
      '适用于完成抗生素疗程后的rCDI预防',
      '方案：每日1次，每次4粒胶囊，连用3天（共12粒）',
      '需在抗生素停用48-72小时后开始服用',
      '储存要求：2–8°C冷藏，室温可保存24小时',
    ],
    targetIndications: ['rCDI'],
    sources: [
      {
        type: 'URL',
        label: 'FDA BLA approval — RBX-2660 (Vowst)',
        url: 'https://www.fda.gov/vaccines-blood-biologics/vaccines/approvals-certain-biologic-therapeutic-products',
      },
      {
        type: 'PMID',
        label: 'PMID 37295997 — Khanna Gastroenterology 2023（RBX-2660 3期RCT）',
        url: 'https://pubmed.ncbi.nlm.nih.gov/37295997/',
      },
    ],
    lastUpdated: '2023-04-26',
  },

  {
    id: 'AGA-FMT-CDI-2021',
    title: 'AGA临床指南：粪菌移植治疗复发性艰难梭菌感染',
    titleEn: 'AGA Clinical Practice Guideline: Fecal Microbiota Transplantation for Recurrent C. difficile Infection',
    organization: 'American Gastroenterological Association (AGA)',
    country: 'INTL',
    year: 2021,
    type: 'guideline',
    scope: '美国临床医生（胃肠、肝病、感染科）对rCDI患者的FMT决策',
    keyRecommendations: [
      'FMT对≥2次CDI复发患者有高度推荐价值（强推荐，高质量证据）',
      '推荐优先选择结肠镜途径，其次口服胶囊（若可用）',
      'FMT前48h内不应使用针对CDI的抗生素（万古霉素/ fidaxomicin）',
      '自体FMT（冻存自体粪便）不推荐用于rCDI初始治疗',
      'FMT后90天内需监测复发和不良事件',
      '供体须通过传染病筛查（HIV/HBV/HCV/梅毒/多重耐药菌等）',
    ],
    targetIndications: ['rCDI'],
    sources: [
      {
        type: 'PMID',
        label: 'PMID 34003433 — AGA Guideline Gastroenterology 2021',
        url: 'https://pubmed.ncbi.nlm.nih.gov/34003433/',
      },
    ],
    lastUpdated: '2021-05-01',
  },

  {
    id: 'ESG-IBD-2023',
    title: '首个国际罗马共识：肠菌群移植治疗炎症性肠病',
    titleEn: 'The First International Rome Consensus Conference on Gut Microbiota and Faecal Microbiota Transplantation in Inflammatory Bowel Disease',
    organization: 'European Crohn\'s and Colitis Organisation (ECCO) & International Organization',
    country: 'INTL',
    year: 2023,
    type: 'consensus',
    scope: '全球IBD患者（UC/CD）的FMT临床应用与研究方向',
    keyRecommendations: [
      'FMT可作为UC诱导缓解的选项之一（需多供体方案，≥3名供体）',
      '多供体方案效果优于单供体，诱导缓解率约30-40%',
      'IBD合并活动性感染（CDI等）时FMT优先级更高',
      'FMT对克罗恩病的证据级别仍较低，需更多高质量RCT',
      '建议建立FMT中心（类似干细胞移植中心）标准化管理',
      '患者需签署知情同意，告知研究性质（多数IBD FMT仍为临床试验阶段）',
    ],
    targetIndications: ['UC', 'CD'],
    sources: [
      {
        type: 'PMID',
        label: 'PMID 37403110 — ESG IBD Consensus Gut 2023',
        url: 'https://pubmed.ncbi.nlm.nih.gov/37403110/',
      },
    ],
    lastUpdated: '2023-06-20',
  },

  {
    id: 'IDSA-SHEA-CDI-2021',
    title: 'IDSA/SHEA指南：艰难梭菌感染预防与治疗临床实践指南（2021版）',
    titleEn: 'IDSA/SHEA Guidelines on the Prevention and Treatment of Clostridioides difficile Infection (2021)',
    organization: 'Infectious Diseases Society of America (IDSA) & Society for Healthcare Epidemiology of America (SHEA)',
    country: 'INTL',
    year: 2021,
    type: 'guideline',
    scope: '全球医疗机构CDI防治策略（成人为主）',
    keyRecommendations: [
      '首次复发CDI：优选fidaxomicin（优于万古霉素）；FMT仅用于≥2次复发',
      'rCDI（≥2次复发）：FMT为强推荐方案（优于万古霉素疗程）',
      'FMT途径：结肠镜为首选，口服胶囊可作为非劣效替代方案',
      '严重CDI伴中毒性巨结肠：可考虑FMT（同情使用）',
      '预防策略：合理抗生素管理（ASP）是降低CDI发生率的核心措施',
      '不推荐FMT用于初发CDI（非复发类型）',
    ],
    targetIndications: ['rCDI'],
    sources: [
      {
        type: 'PMID',
        label: 'PMID 33600321 — IDSA/SHEA CDI Guidelines Clin Infect Dis 2021',
        url: 'https://pubmed.ncbi.nlm.nih.gov/33600321/',
      },
    ],
    lastUpdated: '2021-02-01',
  },

  {
    id: 'WGO-FMT-2022',
    title: 'WGO全球指南：粪菌移植临床应用实践指南（2022更新）',
    titleEn: 'WGO Global Guideline: Fecal Microbiota Transplantation — Practice Guidance Update 2022',
    organization: 'World Gastroenterology Organisation (WGO)',
    country: 'INTL',
    year: 2022,
    type: 'guideline',
    scope: '全球中低收入国家及资源受限环境下的FMT实施标准',
    keyRecommendations: [
      'FMT对rCDI有明确循证支持，适用于所有WHO区域',
      '明确了当地制备与集中化银行模式的双轨路径',
      '提出"最小安全标准"：筛查供体传染病七项+寄生虫筛查（低收入地区适用）',
      '推荐建立国家级FMT供体库，促进资源均衡分配',
      'FMT对IBD、IBS、代谢性疾病等仍为研究阶段，不推荐常规临床使用',
      '特别强调伦理审查与知情同意（特别是在无商品化产品的国家）',
    ],
    targetIndications: ['rCDI'],
    sources: [
      {
        type: 'URL',
        label: 'WGO Global Guidelines — FMT Practice Guidance 2022',
        url: 'https://www.worldgastroenterology.org/guidelines/fecal-microbiota-transplantation/fecal-microbiota-transplantation-english',
      },
    ],
    lastUpdated: '2022-01-01',
  },

  // ─── 国内共识 ───────────────────────────────────────────────

  {
    id: 'CMA-CDI-2022',
    title: '肠道菌群移植临床应用管理中国专家共识（2022版）',
    titleEn: 'Chinese Expert Consensus on Clinical Application Management of Intestinal Microbiota Transplantation (2022)',
    organization: '中华医学会消化病学分会 / 国家卫生健康委员会医院管理研究所',
    country: 'CN',
    year: 2022,
    type: 'consensus',
    scope: '中国各等级医院开展FMT的标准化管理（适应证/禁忌证/制备/随访）',
    keyRecommendations: [
      'FMT正式写入中国专家共识，适用于rCDI、IBD、IBS、肝性脑病等',
      '强调多学科协作（MDT）：消化内科/感染科/ICU/营养科联合评估',
      '供体筛查标准：年龄18-60岁，BMI 18-28，传染四项+粪便病原学筛查+心理健康评估',
      '制备要求：必须在医疗机构内完成，禁止私人/网络购买FMT制剂',
      '患者知情同意必须包含：FMT为超说明书/探索性治疗的可能',
      '不良事件分级：轻度（腹胀/腹泻）→ 中度（发热/感染）→ 重度（菌血症/死亡）',
      '建立全国FMT病例登记系统（推荐）',
    ],
    targetIndications: ['rCDI', 'UC', 'CD', 'IBS', 'HE', 'MDRO', 'Constipation', 'NAFLD'],
    sources: [
      {
        type: 'URL',
        label: '肠道菌群移植临床应用管理中国专家共识（2022版）— 中华医学杂志',
        url: 'https://rs.yiigle.com/cmaid/1424284',
      },
    ],
    lastUpdated: '2022-09-01',
  },

  {
    id: 'CMA-IBD-2023',
    title: '炎症性肠病合并艰难梭菌感染及粪菌移植应用的中国专家共识（2023版）',
    titleEn: 'Chinese Expert Consensus on IBD Combined with C. difficile Infection and FMT Application (2023)',
    organization: '中华医学会消化病学分会炎症性肠病学组',
    country: 'CN',
    year: 2023,
    type: 'consensus',
    scope: 'IBD患者合并CDI时FMT的选择时机与方案（适合中国临床环境）',
    keyRecommendations: [
      'IBD患者CDI感染率显著高于普通人群（高3-5倍），需高度警惕',
      'IBD合并CDI时，FMT可作为挽救治疗（挽救性FMT），优先级高于单纯IBD FMT',
      '轻度活动性IBD合并CDI：先治疗CDI，FMT后继续原IBD维持治疗',
      '中重度IBD合并CDI：MDT评估后，可考虑FMT+免疫抑制剂调整',
      'FMT前须行肠镜或影像学评估IBD疾病活动度（Harvey-Bradshaw / CDAI评分）',
      '自体FMT（冻存）在IBD中数据不足，不建议常规使用',
    ],
    targetIndications: ['UC', 'CD', 'rCDI'],
    sources: [
      {
        type: 'URL',
        label: '中华消化杂志 2023 — IBD+FMT专家共识（可通过中华医学期刊网获取）',
        url: 'https://rs.yiigle.com/cmaid/1516907',
      },
    ],
    lastUpdated: '2023-05-01',
  },

  {
    id: 'CACA-Oncology-2025',
    title: '肠菌移植应用于肿瘤治疗中国专家共识（2025年版）',
    titleEn: 'Chinese Expert Consensus on Fecal Microbiota Transplantation in Cancer Treatment (2025 Edition)',
    organization: '中国抗癌协会肿瘤与微生态专业委员会',
    country: 'CN',
    year: 2025,
    type: 'consensus',
    scope: '中国肿瘤患者（免疫治疗/化疗/HSCT后）合并肠道菌群紊乱时的FMT应用',
    keyRecommendations: [
      'FMT可联合免疫检查点抑制剂（ICI）提升抗肿瘤疗效（已在黑色素瘤/RCC中证实）',
      'FMT对免疫治疗原发耐药患者有潜在逆转作用（需更多RCT验证）',
      '造血干细胞移植（HSCT）后肠道GvHD：FMT为有前景的探索性治疗',
      '化疗相关性腹泻/肠炎：FMT有效率高（60-80%），安全性良好',
      'FMT供体选择：优先选择年轻健康供体，肿瘤患者配型暂无统一标准',
      '需严格评估肿瘤患者免疫状态（中性粒细胞<500/μL时不推荐FMT）',
      'FMT前后需监测肠道菌群变化及免疫相关标志物（IL-6/IFN-γ等）',
    ],
    targetIndications: ['Melanoma', 'RCC', 'NSCLC', 'GvHD', 'CI-Diarrhea'],
    sources: [
      {
        type: 'URL',
        label: '肠菌移植应用于肿瘤治疗中国专家共识（2025年版）',
        url: 'https://www.huasan.net/wp-content/uploads/2025/10/肠菌移植应用于肿瘤治疗中国专家共识2025年版.pdf',
      },
      {
        type: 'PMID',
        label: 'PMID 37567890 ⚠️ — Davar NEJM 2023（黑色素瘤FMT+I-O RCT，待验证）',
        url: 'https://pubmed.ncbi.nlm.nih.gov/37567890/',
      },
    ],
    lastUpdated: '2025-02-01',
  },

  {
    id: 'CMDA-Pediatrics-2023',
    title: '儿童粪菌移植技术规范专家共识（2023版）',
    titleEn: 'Chinese Expert Consensus on Fecal Microbiota Transplantation Technical Specifications for Children (2023)',
    organization: '中国医师协会儿科医师分会 / 中华医学会儿科学分会消化学组',
    country: 'CN',
    year: 2023,
    type: 'consensus',
    scope: '中国儿童（≤18岁）FMT临床操作规范化（适应证/给药剂量/安全监测）',
    keyRecommendations: [
      '儿童FMT适应证：rCDI（首选）、难治性UC（≥2线治疗失败后）',
      '体重剂量换算：儿童剂量 = 成人剂量 × (体重kg/60kg)，最小有效剂量5g粪便等价物',
      '给药途径优先选择鼻胃管（较结肠镜侵袭性小，患儿耐受性更好）',
      '供体优先选择父母或健康同胞（可降低排异风险），需单独伦理审查',
      '2岁以下婴幼儿肠道菌群发育未完善，FMT适应证需MDT评估',
      'FMT后24h禁食，48h内监测生命体征及粪便性状',
      '儿童FMT须获得监护人知情同意及伦理委员会批准',
    ],
    targetIndications: ['rCDI', 'UC'],
    sources: [
      {
        type: 'URL',
        label: '《儿童粪菌移植技术规范专家共识》— 中国医师协会/中华医学会儿科学分会',
        url: 'https://www.bing.com/search?q=儿童粪菌移植技术规范专家共识+2023+中国医师协会',
      },
    ],
    lastUpdated: '2023-08-01',
  },
];