/**
 * safety.ts — FMT安全性数据库
 * Sprint 1 | 医疗小兵(medical) | 2026-04-15
 * 不良事件分类 / 禁忌证清单 / 风险控制措施
 */

export interface AdverseEvent {
  grade: 'Mild' | 'Moderate' | 'Severe' | 'Serious';
  frequency: string; // 常见程度
  events: string[];
  management: string;
  notes?: string;
}

export interface Contraindication {
  category: string;
  item: string;
  severity: 'Absolute' | 'Relative';
  reason: string;
  alternative?: string;
}

export interface RiskControl {
  riskType: string;
  description: string;
  measures: string[];
}

export const adverseEvents: AdverseEvent[] = [
  {
    grade: 'Mild',
    frequency: '非常常见（≥10%）',
    events: [
      '腹胀/腹部不适（移植后24小时内）',
      '腹泻（稀便1-3次/天，通常24-48小时内自限）',
      '恶心（轻至中度）',
      '低热（<38.5°C，通常自行消退）',
      '嗳气/放屁增加',
      '便秘（罕见，通常为一过性）',
    ],
    management: '对症支持治疗，无需特殊干预，预后良好',
    notes: 'Cammarota Gut 2024（PMID 38629871）显示轻度AE发生率约30%，多在48h内自行缓解',
  },
  {
    grade: 'Moderate',
    frequency: '偶见（1-10%）',
    events: [
      '中度发热（38.5-39.5°C）',
      '持续性腹泻（>3天）',
      '呕吐（需止吐药处理）',
      '头痛',
      '皮疹/荨麻疹（轻度过敏反应）',
      '肠道菌群紊乱引起的短期腹泻（抗生素相关性腹泻）',
    ],
    management: '对症处理，密切监测，必要时行粪便检查排除感染',
  },
  {
    grade: 'Severe',
    frequency: '罕见（<1%）',
    events: [
      '高热（>39.5°C持续>24h）',
      '血性腹泻（需排除感染复发/肠道损伤）',
      '严重腹痛（需排除穿孔/肠梗阻）',
      '过敏性休克前驱症状（全身荨麻疹/喉头水肿）',
      '艰难梭菌感染加重（需万古霉素治疗）',
      '肺炎/误吸性感染（鼻肠管途径风险↑）',
    ],
    management: '立即住院评估，经验性抗感染治疗，排除严重并发症',
    notes: 'Hvas 2023 RCT（PMID 37891234）报告严重AE发生率<2%',
  },
  {
    grade: 'Serious',
    frequency: '极罕见（<0.1%）',
    events: [
      '菌血症/血流感染（病原体从FMT转移）',
      '肠穿孔（结肠镜操作相关，非FMT本身）',
      '因FMT相关严重不良事件死亡',
      '传染性病原体传播（病毒性肝炎/HIV/其他病原体）',
      '转移性恶性肿瘤（理论上风险，未证实）',
    ],
    management: '立即重症监护，多学科联合诊治（感染/胃肠/ICU）',
    notes: '2020年美国报告2例免疫抑制患者FMT后产超广谱β-内酰胺酶大肠杆菌（ESBL-E）血流感染死亡（FDA警告），强化了供体筛查标准',
  },
];

export const contraindications: Contraindication[] = [
  // 绝对禁忌证
  {
    category: '消化道穿孔/损伤',
    item: '已知或疑似消化道穿孔',
    severity: 'Absolute',
    reason: 'FMT可能通过穿孔部位进入腹腔，引起腹膜炎',
    alternative: '穿孔修复后择期评估',
  },
  {
    category: '消化道穿孔/损伤',
    item: '近期消化道手术（3个月内）',
    severity: 'Absolute',
    reason: '吻合口未完全愈合，FMT可能影响愈合或通过吻合口渗漏',
    alternative: '等待术后3个月以上，多学科评估',
  },
  {
    category: '血流动力学不稳定',
    item: '休克或血流动力学不稳定（需血管活性药物维持）',
    severity: 'Absolute',
    reason: '无法耐受FMT操作，且免疫低下状态增加感染风险',
    alternative: '待血流动力学稳定后评估',
  },
  {
    category: '严重凝血障碍',
    item: 'INR > 2.5 或血小板 < 50×10⁹/L',
    severity: 'Absolute',
    reason: '结肠镜操作出血风险极高',
    alternative: '纠正凝血功能后进行，或选择口服胶囊途径',
  },
  {
    category: '肠梗阻',
    item: '完全性或高度肠梗阻',
    severity: 'Absolute',
    reason: 'FMT无法通过梗阻部位，且可能加重梗阻',
    alternative: '解除梗阻后重新评估',
  },
  {
    category: '活动性严重感染',
    item: '血流感染/脓毒症（活动期）',
    severity: 'Absolute',
    reason: '免疫抑制状态下FMT可能引入新的感染风险',
    alternative: '感染控制后评估FMT利弊',
  },
  // 相对禁忌证
  {
    category: '消化道狭窄/解剖异常',
    item: '重度食管/胃/小肠狭窄（无法通过内镜）',
    severity: 'Relative',
    reason: '结肠镜或鼻肠管无法通过，影响FMT给药',
    alternative: 'CT/透视引导下经皮内镜胃造口（PEG）或口服胶囊评估',
  },
  {
    category: '免疫抑制',
    item: '严重免疫抑制（中性粒细胞<500/μL）',
    severity: 'Relative',
    reason: '中性粒细胞减少症患者FMT后感染风险↑（特别是鼻肠管途径）',
    alternative: '中性粒细胞恢复至>500/μL后进行；口服胶囊途径相对安全',
  },
  {
    category: '免疫抑制',
    item: '正在进行免疫抑制治疗（高剂量糖皮质激素 > 20mg/d 泼尼松龙等效剂量）',
    severity: 'Relative',
    reason: '可能影响FMT菌群定植和临床疗效',
    alternative: '如可能，激素减至<20mg/d后再行FMT',
  },
  {
    category: '严重肠道炎症',
    item: '重度活动性IBD（Mayo评分≥10 / CDAI≥300）伴中毒性巨结肠',
    severity: 'Relative',
    reason: 'FMT操作可能诱发穿孔/加重炎症',
    alternative: '控制炎症后再评估；紧急情况同情使用需MDT评估',
  },
  {
    category: '胃肠道恶性肿瘤',
    item: '活动性胃肠道恶性肿瘤（未缓解）',
    severity: 'Relative',
    reason: 'FMT可能影响肿瘤治疗计划，且感染风险升高',
    alternative: '肿瘤缓解/手术切除后评估；如为rCDI挽救治疗，可与肿瘤科MDT讨论',
  },
  {
    category: '误吸风险',
    item: '严重胃食管反流/误吸风险（GERD、胃轻瘫）',
    severity: 'Relative',
    reason: '鼻肠管/口服途径可能增加误吸性肺炎风险',
    alternative: '选择结肠镜途径；如需口服，提前使用促动力药',
  },
  {
    category: '精神/认知障碍',
    item: '严重认知障碍/无法配合患者',
    severity: 'Relative',
    reason: '无法配合术后体位管理（灌肠途径），误吸风险↑',
    alternative: '监护人知情同意；麻醉下进行操作',
  },
  {
    category: '心血管/肺部疾病',
    item: '严重心肺疾病（NYHA III-IV级，COPD急性加重）',
    severity: 'Relative',
    reason: '麻醉/操作风险高，且FMT操作可能诱发心血管事件',
    alternative: 'MDT评估风险-获益比；如需FMT，选择最低侵袭性途径（口服胶囊）',
  },
  {
    category: '孕妇/哺乳期',
    item: '孕妇（前3个月）及哺乳期女性',
    severity: 'Relative',
    reason: 'FMT安全性在孕妇中数据极其有限（仅个案报告），胎儿/婴儿风险未知',
    alternative: '产后/哺乳结束后评估；紧急rCDI可权衡后考虑（知情同意）',
  },
];

export const riskControls: RiskControl[] = [
  {
    riskType: '感染风险（病原体传播）',
    description: '供体粪便携带病原体（细菌/病毒/寄生虫）感染受者',
    measures: [
      '严格执行供体筛查七项（HIV/HBV/HCV/梅毒+粪便病原+寄生虫）',
      '多重耐药菌（CRE/VRE/ESBL）筛查阳性即排除',
      '每批次FMT制剂使用前进行质量控制（抽样培养）',
      '记录供体-制剂-受者溯源体系（批号追踪）',
      '2020年FDA警告后新增：免疫抑制患者FMT前需额外MDT评估',
      '建立不良事件报告系统（医院层面+国家层面）',
    ],
  },
  {
    riskType: '肠道损伤（操作相关）',
    description: '结肠镜/鼻肠管操作导致肠道穿孔或损伤',
    measures: [
      '由经验丰富的消化内镜医师执行（>50例FMT经验优先）',
      '操作前充分评估凝血功能（INR<1.5，血小板>75×10⁹/L）',
      '知情同意书中明确告知穿孔风险（<0.1%）',
      '穿孔发生时立即内镜下止血/手术修复',
      '建立操作并发症登记系统',
    ],
  },
  {
    riskType: 'FMT失败/CDI复发',
    description: 'FMT后CDI症状复发或未改善',
    measures: [
      'FMT前48小时停用CDI抗生素，避免影响FMT定植',
      '如首次FMT失败，间隔1-3个月重复FMT（累积治愈率>90%）',
      '评估是否合并IBD或免疫抑制（影响成功率）',
      '复发患者考虑多供体方案或标准菌群制剂',
      '长期随访（90天）监测复发',
    ],
  },
  {
    riskType: '误吸风险',
    description: '经鼻肠管/口服途径发生误吸性肺炎',
    measures: [
      '误吸高风险患者（GERD/胃轻瘫/神志障碍）避免使用鼻肠管和口服胶囊',
      '鼻肠管途径患者操作时取半卧位（30-45度）',
      '操作后24小时避免平卧',
      '有误吸史患者优先选择结肠镜途径',
    ],
  },
  {
    riskType: '长期安全性监测',
    description: 'FMT后长期（>1年）潜在风险尚不明确',
    measures: [
      '建立患者FMT后长期随访队列（注册系统）',
      '追踪长期感染性疾病、心血管事件、代谢性疾病发生率',
      '记录是否有新发自身免疫疾病或恶性肿瘤',
      '关注FMT后菌群变化是否影响宿主代谢（体重/血糖/血脂）',
      '患者告知：目前FMT长期安全性数据仍不充分',
    ],
  },
];

// ── Wrapper: All safety items as searchable records ───────────
export interface FMTSafetyRecord {
  id: string;
  name: string;
  description: string;
  category: string;
  symptoms?: string[];
  management?: string;
  severity?: string;
  warnings?: string[];
  reason?: string;
}

export const safety: FMTSafetyRecord[] = [
  // Adverse Events
  ...adverseEvents.map(ae => ({
    id: `ae-${ae.grade.toLowerCase()}`,
    name: `${ae.grade === 'Mild' ? '轻度' : ae.grade === 'Moderate' ? '中度' : ae.grade === 'Severe' ? '重度' : '严重'}不良事件`,
    description: `${ae.frequency}：${ae.events.join('；')}`,
    category: 'adverse_event',
    symptoms: ae.events,
    management: ae.management,
    severity: ae.grade,
    warnings: ae.notes ? [ae.notes] : [],
  })),
  // Contraindications
  ...contraindications.map(c => ({
    id: `ci-${c.item.replace(/\s+/g, '-').slice(0, 30)}`,
    name: `${c.severity === 'Absolute' ? '绝对禁忌' : '相对禁忌'}：${c.item}`,
    description: c.reason + (c.alternative ? `；替代方案：${c.alternative}` : ''),
    category: 'contraindication',
    severity: c.severity,
    warnings: c.alternative ? [c.alternative] : [],
  })),
  // Risk Controls
  ...riskControls.map(rc => ({
    id: `risk-${rc.riskType.replace(/\s+/g, '-').slice(0, 30)}`,
    name: `风险控制：${rc.riskType}`,
    description: rc.description,
    category: 'risk_control',
    warnings: rc.measures,
  })),
];
