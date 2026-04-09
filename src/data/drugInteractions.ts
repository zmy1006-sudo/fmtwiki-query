export interface DrugInteraction {
  drugName: string;        // 药物名称
  drugCategory: string;    // 药物类别
  effect: '冲突' | '谨慎' | '可能有益' | '需评估';
  mechanism: string;       // 作用机制
  recommendation: string;  // 临床建议
  severity: '高' | '中' | '低';
  refSource?: string;      // 主要参考来源
}

export const drugInteractions: DrugInteraction[] = [
  {
    drugName: '万古霉素（Vancomycin）',
    drugCategory: '抗生素',
    effect: '可能有益',
    mechanism: 'FMT前清除艰难梭菌，为移植菌群创造有利环境',
    recommendation: 'rCDI标准方案：FMT前万古霉素诱导3-5天，FMT当天停用，FMT后视情况可继续10-14天',
    severity: '低',
  },
  {
    drugName: '非达霉素（Fidaxomicin）',
    drugCategory: '抗生素',
    effect: '可能有益',
    mechanism: '相比万古霉素，对肠道菌群破坏更小，FMT前使用效果可能更优',
    recommendation: '可作为万古霉素替代，FMT前3-5天使用',
    severity: '低',
  },
  {
    drugName: '广谱抗生素（哌拉西林/他唑巴坦等）',
    drugCategory: '抗生素',
    effect: '冲突',
    mechanism: '强力破坏肠道菌群，可直接杀死移植的功能菌群',
    recommendation: 'FMT后2个月内尽量避免使用非必要广谱抗生素；如必须使用，优先窄谱药物，事后尽快恢复菌群',
    severity: '高',
  },
  {
    drugName: '甲硝唑',
    drugCategory: '抗生素',
    effect: '谨慎',
    mechanism: '对厌氧菌有抑制作用，可能干扰移植菌群定植',
    recommendation: 'FMT后1-2周内避免；如用于治疗CDI复发，应先评估是否需再次FMT',
    severity: '中',
  },
  {
    drugName: '质子泵抑制剂（PPI，奥美拉唑等）',
    drugCategory: '消化系统药',
    effect: '谨慎',
    mechanism: '抑制胃酸，减少胃内杀菌作用，理论上可能影响经胃肠道上段移植的菌群；但证据不一致',
    recommendation: 'FMT后1周内尽量停用PPI；如必须使用，优先选择需要胃内释放的胶囊FMT而非鼻胃管',
    severity: '中',
  },
  {
    drugName: '免疫抑制剂（硫唑嘌呤、甲氨蝶呤）',
    drugCategory: '免疫抑制剂',
    effect: '谨慎',
    mechanism: '抑制免疫应答，理论上可能影响菌群-宿主互作；但研究显示短期影响有限',
    recommendation: 'IBD患者通常可继续使用；建议在FMT前与风湿免疫科讨论，监测感染指标',
    severity: '中',
  },
  {
    drugName: '英夫利西单抗（IFX）等抗TNF生物制剂',
    drugCategory: '生物制剂',
    effect: '谨慎',
    mechanism: '抑制TNF-α，可能影响菌群-免疫互作；目前研究未显示对FMT疗效有明显负面影响',
    recommendation: 'IBD患者生物制剂不应停用；建议在FMT前完成生物制剂给药（FMT在给药间隔中点进行）',
    severity: '中',
  },
  {
    drugName: '糖皮质激素（泼尼松龙>20mg/日）',
    drugCategory: '激素',
    effect: '谨慎',
    mechanism: '大剂量激素（泼尼松龙≥10mg/日）抑制免疫，可能影响菌群定植和免疫调节效果',
    recommendation: 'FMT期间尽量降低激素剂量至泼尼松龙10mg/日以下；短期使用（<2周低剂量）影响有限',
    severity: '中',
  },
  {
    drugName: '化疗药物（氟尿嘧啶、奥沙利铂等）',
    drugCategory: '抗肿瘤药',
    effect: '冲突',
    mechanism: '强力骨髓抑制和黏膜损伤，严重破坏肠道菌群，并可致移植物抗宿主病风险',
    recommendation: 'FMT须在化疗前完成或在化疗结束后菌群恢复稳定后进行；化疗期间FMT须MDT讨论',
    severity: '高',
  },
  {
    drugName: '泻药（聚乙二醇、乳果糖等）',
    drugCategory: '泻药',
    effect: '谨慎',
    mechanism: '大量泻药可机械性冲刷肠道，理论上减少移植菌群在肠道的停留时间',
    recommendation: 'FMT后2周内避免大剂量泻药；FMT前清肠准备按医嘱执行（清肠本身是标准流程的一部分）',
    severity: '中',
  },
  {
    drugName: '益生菌补充剂（多种活菌）',
    drugCategory: '微生态制剂',
    effect: '谨慎',
    mechanism: '外源益生菌可能与移植菌群竞争生态位；也有研究认为可辅助定植',
    recommendation: 'FMT后2周内不推荐自行服用益生菌补充剂；2周后可在医生指导下选择性补充特定菌株',
    severity: '中',
  },
  {
    drugName: '益生元（菊粉、膳食纤维）',
    drugCategory: '微生态制剂',
    effect: '可能有益',
    mechanism: '为移植菌群提供代谢底物，有助于功能菌群扩增和定植',
    recommendation: 'FMT后第2周起可适度增加膳食纤维/益生元摄入，有助于维持FMT效果；具体方案咨询营养科',
    severity: '低',
  },
  {
    drugName: '磺胺类（SMZ-TMP）',
    drugCategory: '抗生素',
    effect: '谨慎',
    mechanism: '对肠道菌群有中等抑制作用，可能影响定植',
    recommendation: 'FMT后1-2周内避免；如为预防卡氏肺孢子虫，须与FMT医生讨论替代方案',
    severity: '中',
  },
  {
    drugName: '阿司匹林（低剂量）',
    drugCategory: '抗血小板药',
    effect: '可能有益',
    mechanism: '抗血小板药物可改善肠道微循环，可能有助于菌群-血管互作',
    recommendation: 'FMT前后可继续使用低剂量阿司匹林；结肠镜操作本身需停用7-10天（请遵医嘱）',
    severity: '低',
  },
  {
    drugName: '利福平',
    drugCategory: '抗生素',
    effect: '冲突',
    mechanism: '强力抗生素，对肠道菌群破坏显著，且半衰期短需多次给药',
    recommendation: 'FMT后3个月内尽量避免；如用于结核治疗，须MDT讨论利弊',
    severity: '高',
  },
];

export const effectColors: Record<DrugInteraction['effect'], { bg: string; text: string; label: string }> = {
  '冲突': { bg: 'bg-red-100', text: 'text-red-700', label: '⚠️ 冲突' },
  '谨慎': { bg: 'bg-amber-100', text: 'text-amber-700', label: '⚡ 谨慎' },
  '可能有益': { bg: 'bg-green-100', text: 'text-green-700', label: '✅ 可能有益' },
  '需评估': { bg: 'bg-blue-100', text: 'text-blue-700', label: '🔍 需评估' },
};

export const severityColors: Record<DrugInteraction['severity'], string> = {
  '高': 'text-red-500',
  '中': 'text-amber-500',
  '低': 'text-green-500',
};

export const drugCategories = [...new Set(drugInteractions.map(d => d.drugCategory))];
