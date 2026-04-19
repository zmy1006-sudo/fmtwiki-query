/**
 * protocols.ts — FMT临床流程SOP
 * Sprint 1 | 医疗小兵(medical) | 2026-04-15
 * 包含：供体筛选/制备方案/给药途径比较/患者准备/术后随访
 */

export interface DonorScreeningItem {
  category: string;
  item: string;
  required: boolean;
  notes: string;
}

export interface PreparationComparison {
  type: 'Fresh' | 'Frozen' | 'Capsule';
  description: string;
  advantages: string[];
  disadvantages: string[];
  storage: string;
  shelfLife: string;
  typicalIndication: string;
}

export interface RouteComparison {
  route: string;
  invasiveness: 'Low' | 'Medium' | 'High';
  anesthesia: boolean;
  patientTolerability: string;
  efficacy: string;
  suitableFor: string[];
  contraindications: string[];
  notes: string;
}

export interface FollowUpNode {
  timePoint: string;
  actions: string[];
  monitoring: string[];
  warningSigns: string[];
}

export const donorScreening: DonorScreeningItem[] = [
  // 一般要求
  { category: '基本要求', item: '年龄18-60岁', required: true, notes: '中国共识要求，部分国际标准允许至65岁' },
  { category: '基本要求', item: 'BMI 18-28 kg/m²', required: true, notes: '排除肥胖/消瘦相关代谢异常' },
  { category: '基本要求', item: '近3个月无胃肠道感染病史', required: true, notes: '排除急性肠道病原体携带状态' },
  { category: '基本要求', item: '近3个月无抗生素使用史', required: true, notes: '抗生素破坏肠道菌群，影响FMT质量' },
  { category: '基本要求', item: '无慢性病（糖尿病/IBD/肠易激综合征）', required: true, notes: '排除代谢/肠道慢性疾病' },
  { category: '基本要求', item: '无恶性肿瘤病史', required: true, notes: '排除肿瘤相关肠道菌群异常及感染风险' },
  // 传染病筛查
  { category: '感染四项', item: 'HIV 1/2抗体', required: true, notes: '必须阴性；阳性即排除' },
  { category: '感染四项', item: 'HBsAg / 抗-HBs / 抗-HBc', required: true, notes: 'HBsAg阳性需进一步HBV DNA定量，排除活动性感染' },
  { category: '感染四项', item: 'HCV抗体', required: true, notes: '阳性需进一步HCV RNA，排除活动性感染' },
  { category: '感染四项', item: '梅毒螺旋体抗体（TPPA/RPR）', required: true, notes: '阳性即排除' },
  // 粪便病原学
  { category: '粪便病原', item: '艰难梭菌（C. difficile）毒素/芽孢', required: true, notes: '毒素A/B或GDH检测；阳性即排除' },
  { category: '粪便病原', item: '沙门氏菌（Salmonella）', required: true, notes: '粪便培养阴性' },
  { category: '粪便病原', item: '志贺氏菌（Shigella）', required: true, notes: '粪便培养阴性' },
  { category: '粪便病原', item: '弯曲杆菌（Campylobacter）', required: true, notes: '粪便培养阴性' },
  { category: '粪便病原', item: 'O157:H7大肠杆菌', required: true, notes: '粪便培养阴性' },
  { category: '粪便病原', item: '寄生虫与虫卵（贾第鞭毛虫/阿米巴等）', required: true, notes: '粪便显微镜检查；高发地区需增加蓝氏贾第鞭毛虫抗原' },
  { category: '粪便病原', item: '多重耐药菌（CRE/VRE/ESBL）', required: true, notes: '直肠拭子培养；阳性即排除；ICU/免疫抑制患者供体需额外筛查' },
  // 心理健康
  { category: '心理健康', item: '抑郁/焦虑自评量表（PHQ-9 / GAD-7）', required: true, notes: 'PHQ-9≥10或GAD-7≥10分者排除；心理咨询师面谈可选' },
  { category: '心理健康', item: '无精神疾病史（精神分裂症/双相等）', required: true, notes: '排除遗传/代谢性精神疾病风险' },
  // 可选筛查
  { category: '可选筛查', item: '粪便钙卫蛋白（FC）', required: false, notes: '排除亚临床肠道炎症；正常范围<50μg/g' },
  { category: '可选筛查', item: '艰难梭菌基因分型（NAP1/BI/027）', required: false, notes: '高毒力菌株携带者供体可能增加受者感染风险（争议）' },
  { category: '可选筛查', item: '肠道菌群基线检测（16S rRNA/shotgun）', required: false, notes: '评估菌群多样性及关键菌属丰度；推荐Akkermansia/Faecalibacterium/Bifidobacterium丰富' },
];

export const preparationComparison: PreparationComparison[] = [
  {
    type: 'Fresh',
    description: '供体粪便采集后6小时内制备、即时使用（不冷冻）',
    advantages: [
      '菌群活力最高（无冻融损伤）',
      '无冷链依赖，设备要求低',
      '无甘油保护剂残留风险',
      '适合资源受限的医院',
    ],
    disadvantages: [
      '供体-患者需即时匹配，时间窗口窄（6h）',
      '无法批量生产/库存，紧急情况难以调配',
      '批次间差异大，质量控制困难',
      '患者需等待供体确认后进行移植',
    ],
    storage: '室温（制备后立即使用），不建议冷藏超过4h',
    shelfLife: '采集后6小时内使用',
    typicalIndication: 'rCDI紧急治疗、科研项目、无法进行冻存的小型中心',
  },
  {
    type: 'Frozen',
    description: '粪便悬液加入10%甘油冷冻保护剂，于-80°C冻存',
    advantages: [
      '可提前批量制备，建立菌群库',
      '批次质量可控，标准化程度高',
      '解冻后即可使用，时间灵活性好',
      'FDA批准产品均采用此形式（SER-109/RBX-2660）',
    ],
    disadvantages: [
      '需-80°C超低温冰箱，设备成本高',
      '冻融过程可能导致部分厌氧菌活力下降',
      '甘油残留可能影响部分患者耐受性',
      '运输需全程冷链（干冰或液氮）',
    ],
    storage: '-80°C超低温冰箱（Rebyota/Vowst）',
    shelfLife: '6-24个月（不同产品略有差异）',
    typicalIndication: '商业化FMT产品、具备菌库的中心、计划性FMT治疗',
  },
  {
    type: 'Capsule',
    description: '粪便悬液过滤、浓缩后装入肠溶胶囊，口服给药',
    advantages: [
      '无创，无麻醉风险，无肠道准备',
      '患者自行服用，依从性高，适合院外管理',
      '可远程给药，减少往返医院次数',
      'Hvas 2023 RCT证明非劣效于结肠镜途径',
    ],
    disadvantages: [
      '制造成本高于悬液（需胶囊填充设备）',
      '需要胃酸保护（肠溶胶囊技术要求高）',
      '单次剂量较大（6-8粒/次），吞咽困难者不适用',
      '目前仅FDA批准产品可用（Vowst），国内尚无同类产品',
    ],
    storage: '2-8°C冷藏（Vowst）；部分产品可室温短期保存',
    shelfLife: '根据产品不同，约6-12个月（胶囊形式）',
    typicalIndication: 'rCDI预防（非首次FMT）、患者偏好口服者、需重复FMT的患者',
  },
];

export const routeComparison: RouteComparison[] = [
  {
    route: '结肠镜（Colonoscopy）',
    invasiveness: 'High',
    anesthesia: true,
    patientTolerability: '需麻醉，痛苦较大，但治愈率最高（>90%）',
    efficacy: 'rCDI首选途径，治愈率90-96%（Hvas 2023 RCT）',
    suitableFor: ['rCDI（首选）', '需同时行肠道评估的IBD患者', '严重/复杂病例'],
    contraindications: [
      '血流动力学不稳定',
      '消化道穿孔',
      '严重凝血障碍（INR>2.5）',
      '无法配合麻醉的高危患者',
    ],
    notes: 'AGA 2021指南推荐为rCDI首选途径；可同时取活检评估肠道病变',
  },
  {
    route: '鼻肠管（Nasoenteric Tube / NJ Tube）',
    invasiveness: 'Medium',
    anesthesia: false,
    patientTolerability: '轻度不适，需放置管道，部分患者难以耐受',
    efficacy: '非劣于结肠镜（rCDI），适合需重复FMT的患者',
    suitableFor: ['儿童FMT（首选）', '需重复FMT的患者', '无法行结肠镜的老年/体弱患者'],
    contraindications: [
      '食道/胃底静脉曲张',
      '严重反流/误吸风险（GERD、胃轻瘫）',
      '上消化道狭窄或手术史',
      '神志不清/无法配合咽管患者',
    ],
    notes: 'CMDA-Pediatrics 2023共识推荐为儿童FMT首选途径',
  },
  {
    route: '口服胶囊（Oral Capsule / cFMT）',
    invasiveness: 'Low',
    anesthesia: false,
    patientTolerability: '口服即可，耐受性最好，患者偏好度高',
    efficacy: '非劣于结肠镜途径（rCDI），治愈率84-90%',
    suitableFor: ['轻症rCDI', '需重复FMT维持治疗', '拒绝有创操作的患者', '院外管理/自我给药'],
    contraindications: [
      '严重吞咽困难',
      '胃酸过多/肠溶胶囊失效风险（部分患者）',
      '需同时进行肠道评估的患者',
    ],
    notes: 'Hvas 2023 RCT非劣效性边界Δ=-12%，胶囊非劣于结肠镜',
  },
  {
    route: '保留灌肠（Retention Enema）',
    invasiveness: 'Medium',
    anesthesia: false,
    patientTolerability: '需保持体位30-60分钟，部分患者难以坚持',
    efficacy: '单独使用对rCDI效果弱（<80%），但与结肠镜联合（强化方案）效果好',
    suitableFor: ['UC（作为强化方案）', '无法接受结肠镜的轻症患者', '结肠镜后的维持治疗'],
    contraindications: [
      '活动性直肠/乙状结肠炎症（可能加重）',
      '直肠/肛门狭窄',
      '严重痔疮/肛裂',
    ],
    notes: 'Paramsothy 2023 Lancet子刊：结肠镜+灌肠强化方案用于UC',
  },
];

export const patientPreparation: { category: string; steps: string[] }[] = [
  {
    category: 'FMT前评估（5-7天前）',
    steps: [
      '确认FMT适应证：rCDI/IBD/MDRO等符合指南推荐',
      'MDT讨论（消化/感染/麻醉/营养科），确认治疗方案',
      '签署知情同意书（含FMT为超说明书/探索性治疗声明）',
      '完成肠道准备（聚乙二醇电解质溶液或磷酸钠）',
      'FMT前48小时停用CDI针对性抗生素（万古霉素/fidaxomicin）',
      'FMT前24小时进流质饮食（减少肠道残渣）',
      '高危患者（IBD/免疫抑制）：完成粪便病原学复查',
    ],
  },
  {
    category: 'FMT当天（患者准备）',
    steps: [
      '空腹6-8小时（结肠镜/鼻肠管途径）',
      '结肠镜患者：签署麻醉知情同意',
      '确认生命体征（血压/心率/体温）稳定',
      '建立静脉通路（必要时）',
      '记录末次排便时间',
      '患者教育：告知移植后可能的腹胀/腹泻/轻微发热（正常反应）',
    ],
  },
];

export const followUpSchedule: FollowUpNode[] = [
  {
    timePoint: '术后2-4小时',
    actions: [
      '卧床休息30分钟，避免剧烈活动',
      '观察腹部症状（腹痛/腹胀程度）',
      '可少量饮水（如无恶心/呕吐）',
      '如有鼻肠管，留置观察无需立即拔管',
    ],
    monitoring: [
      '生命体征（体温/脉搏/血压）q2h×4次',
      '腹部体征（有无压痛/反跳痛）',
      '排便情况（首次排便时间/性状）',
    ],
    warningSigns: [
      '剧烈腹痛（持续>30分钟不缓解）',
      '发热>38.5°C',
      '血便/黑便',
      '心率>110次/分',
    ],
  },
  {
    timePoint: '术后24小时',
    actions: [
      '可进流质饮食，逐步过渡到正常饮食',
      '记录每日排便次数及性状',
      '鼻肠管患者：可拔管（如无特殊需要）',
      '口服胶囊患者：如有恶心，对症处理后可继续服药',
    ],
    monitoring: [
      '症状变化（腹泻是否改善）',
      '粪便性状（是否成形/血便/黏液便）',
      '体温曲线（每日2次）',
      '腹部体征',
    ],
    warningSigns: [
      '腹泻加重（次数增加>50%）',
      '持续低热（>72小时）',
      '腹部体征加重',
    ],
  },
  {
    timePoint: '术后7天',
    actions: [
      '评估临床疗效（腹泻是否缓解/便秘是否改善）',
      '记录不良事件（如有）',
      '可考虑重复FMT（如症状未改善或复发）',
      'rCDI患者：如症状改善，视为FMT成功',
    ],
    monitoring: [
      '临床症状评分（如Winnipeg CDI评分）',
      '粪便常规（如有异常）',
      '肠道菌群变化（研究用途）',
    ],
    warningSigns: [
      'CDI症状复发（腹泻+毒素阳性）',
      '新发胃肠道感染症状',
    ],
  },
  {
    timePoint: '术后30天',
    actions: [
      '随访CDI是否复发（rCDI患者主要终点）',
      '记录长期症状改善情况',
      '评估不良事件（轻/中/重度）',
      '必要时追加FMT',
    ],
    monitoring: [
      'CDI复发率（主要终点：8周/12周/90天内复发）',
      '生活质量评分（SF-36等）',
      '不良事件追踪',
    ],
    warningSigns: [
      '90天内CDI复发',
      '持续性腹部症状',
    ],
  },
  {
    timePoint: '术后90天',
    actions: [
      '最终疗效评估（长期预后）',
      '安全性随访（迟发不良事件）',
      '必要时进入共建计划（反馈系统）',
      'rCDI患者：如90天内无复发，视为FMT成功治愈',
    ],
    monitoring: [
      '复发率统计',
      '不良事件分类表记录',
      '患者满意度/生活质量',
    ],
    warningSigns: [
      '迟发性感染（考虑FMT相关病原体传播）',
    ],
  },
];

// ── Wrapper: All SOP items as searchable records ────────────
export interface FMTProtocol {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: { description: string }[];
  keyPoints?: string[];
  indications: string[];
}

export const protocols: FMTProtocol[] = [
  {
    id: 'donor-screening',
    name: '供体筛选标准',
    description: '健康供体筛查的完整标准，包括基本要求、传染病四项、粪便病原学、心理健康等',
    category: 'donor',
    steps: donorScreening.map(s => ({ description: '[' + s.category + '] ' + s.item + (s.notes ? ' — ' + s.notes : '') })),
    keyPoints: donorScreening.filter(s => s.required).map(s => s.item),
    indications: ['rCDI', 'IBD', 'IBS'],
  },
  {
    id: 'prep-fresh',
    name: '新鲜FMT制备流程',
    description: '新鲜粪便制备的标准流程：采集→混合→过滤→立即给药',
    category: 'preparation',
    steps: [
      { description: '供体排便后6小时内采集' },
      { description: '与无菌生理盐水1:3~1:5混合' },
      { description: '搅拌均匀后过滤（滤网孔径0.25-0.5mm）' },
      { description: '取上清液250-500mL' },
      { description: '经结肠镜/鼻肠管立即给药' },
    ],
    indications: ['rCDI'],
  },
  {
    id: 'prep-frozen',
    name: '冻存FMT制备流程',
    description: '冻存粪便制剂的制备与复温流程',
    category: 'preparation',
    steps: [
      { description: '粪便与甘油保护剂（10%）混合' },
      { description: '分装至无菌容器' },
      { description: '-80°C冷冻保存（可达6-24个月）' },
      { description: '使用前37°C水浴复温' },
      { description: '复温后4小时内使用' },
    ],
    indications: ['rCDI'],
  },
  {
    id: 'prep-capsule',
    name: '口服胶囊FMT制备',
    description: '肠溶口服胶囊FMT的制备流程和剂量方案',
    category: 'preparation',
    steps: [
      { description: '粪便悬液过滤浓缩' },
      { description: '装入肠溶胶囊（每粒含0.4-0.5g粪便等价物）' },
      { description: '每次6-8粒，每日2次，连用2-3天' },
      { description: '2-8°C冷藏或-80°C冻存' },
    ],
    keyPoints: ['Vowst方案：每次4粒×3天=12粒', 'Hvas 2023 RCT验证非劣效于结肠镜'],
    indications: ['rCDI'],
  },
  {
    id: 'route-colonoscopy',
    name: '结肠镜FMT操作流程',
    description: '经结肠镜进行FMT的标准操作步骤',
    category: 'route',
    steps: [
      { description: '患者术前清洁肠道（聚乙二醇方案）' },
      { description: '麻醉下行结肠镜至回肠末端或盲肠' },
      { description: '经活检孔道注入粪便悬液250-500mL' },
      { description: '术后仰卧位30-60分钟' },
      { description: '术后2小时禁食，24小时内避免剧烈活动' },
    ],
    keyPoints: ['AGA推荐首选途径', '可至回肠末端确保最大覆盖'],
    indications: ['rCDI', 'IBD'],
  },
  {
    id: 'route-nasogastric',
    name: '鼻胃/空肠管FMT流程',
    description: '经鼻胃管或鼻空肠管进行FMT的操作流程',
    category: 'route',
    steps: [
      { description: 'X线确认管道位置（胃内/空肠）' },
      { description: '注入甲氧氯普胺10mg促进胃排空' },
      { description: '分次注入粪便悬液（每次50-100mL）' },
      { description: '温盐水冲管' },
      { description: '管道保留2小时以上后拔除' },
    ],
    keyPoints: ['儿童优先推荐途径', '误吸风险需评估'],
    indications: ['rCDI', '儿童FMT'],
  },
  {
    id: 'route-capsule',
    name: '口服胶囊FMT操作流程',
    description: '口服肠溶胶囊FMT的操作流程和患者指导',
    category: 'route',
    steps: [
      { description: '抗生素停用48-72小时后开始' },
      { description: '冷水整粒吞服，勿咀嚼' },
      { description: '每次4-8粒，每日1-2次' },
      { description: '用药期间避免抑酸药（PPI）' },
    ],
    keyPoints: ['非侵入性，患者耐受性好', 'Vowst已获FDA批准'],
    indications: ['rCDI'],
  },
  {
    id: 'followup-standard',
    name: 'FMT术后随访方案',
    description: 'FMT术后标准随访时间表和监测指标',
    category: 'followup',
    steps: followUpSchedule.map(n => ({ description: '[' + n.timePoint + '] ' + n.actions.join('；') + '；监测：' + n.monitoring.join('、') })),
    keyPoints: followUpSchedule.flatMap(n => n.warningSigns),
    indications: ['所有FMT适应证'],
  },
];
