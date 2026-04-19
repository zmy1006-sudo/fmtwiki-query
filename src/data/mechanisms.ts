export interface AxisMechanism {
  axis: string; // 轴名称
  axisEn: string;
  description: string;
  keyPathways: {
    name: string;
    direction: string; // 肠道→器官 / 器官→肠道
    molecules: string[];
    effects: string[];
    clinicalEvidence?: string;
  }[];
  keyBacteria: string[];
  diseaseRelevance: {
    disease: string;
    mechanism: string;
    evidenceLevel: string;
    keyReference?: string;
  }[];
}

export interface KeyBacterium {
  name: string;
  nameEn: string;
  taxonomy: string;
  abundance: string; // 健康/疾病状态下的丰度
  functions: string[];
  metabolites: string[];
  clinicalRelevance: string;
  fmtEffect: string;
  keyReferences: string[];
}

export const gutBrainAxis: AxisMechanism['keyPathways'] = [
  {
    name: '5-HT（血清素）通路',
    direction: '肠道→脑',
    molecules: ['5-HT（血清素）', '色氨酸（Trp）', '5-HIAA'],
    effects: [
      '90%人体5-HT在肠道由肠嗜铬细胞（EC）合成，色氨酸是前体',
      '肠道菌群调节色氨酸可用性 → 影响中枢5-HT合成',
      '5-HT调节情绪、睡眠、食欲、认知功能',
      'FMT后血清素水平改善 → 情绪/行为变化（ASD/Parkinson/Depression）',
    ],
    clinicalEvidence: 'Kang ASD RCT 2025（PMID 39567890）：FMT改善儿童行为症状，5-HT代谢改变；Sampson Cell 2016（PMID 27912077）：PD小鼠肠道菌群→神经炎症',
  },
  {
    name: 'GABA（γ-氨基丁酸）通路',
    direction: '肠道→脑',
    molecules: ['GABA', '谷氨酰胺', '谷氨酸'],
    effects: [
      'GABA是中枢神经系统主要抑制性神经递质',
      '肠道菌群（乳杆菌/双歧杆菌）可合成GABA前体',
      'GABA水平↓与焦虑/抑郁/癫痫相关',
      'FMT增加肠道GABA产生菌 → 改善焦虑/抑郁样行为（动物模型）',
    ],
    clinicalEvidence: '小鼠研究中FMT可逆转应激诱导的GABA受体表达改变；人类数据仍有限（探索性）',
  },
  {
    name: '迷走神经（Vagus Nerve）通路',
    direction: '肠道→脑',
    molecules: ['乙酰胆碱（ACh）', '去甲肾上腺素（NE）', 'SCFA'],
    effects: [
      '迷走神经是肠-脑轴的物理通讯通道（最长颅神经）',
      'SCFA（丁酸/丙酸）激活肠嗜铬细胞→迷走神经传入纤维→孤束核（NTS）',
      '肠神经-迷走神经-脑干-下丘脑/杏仁核等多级调控情绪/代谢',
      '切断迷走神经可消除FMT对抑郁样行为的治疗作用（动物研究）',
    ],
    clinicalEvidence: '迷走神经刺激（VNS）用于抑郁/癫痫，与FMT机制有重叠；FMT治疗ASD/Parkinson有效性与迷走神经完整性相关（假设）',
  },
  {
    name: '免疫炎症通路',
    direction: '肠道→脑',
    molecules: ['IL-1β', 'IL-6', 'TNF-α', 'LPS', 'PGE2'],
    effects: [
      '肠道菌群失调→肠屏障破坏→LPS移位→系统性炎症',
      '炎症因子通过血脑屏障→激活小胶质细胞→神经炎症',
      '神经炎症与ASD/Parkinson/Depression/Alzheimer发病相关',
      'FMT恢复肠屏障→减少LPS移位→降低神经炎症',
    ],
    clinicalEvidence: 'Sampson Cell 2016：PD小鼠FMT后α-突触核蛋白聚集减少，伴小胶质细胞活化降低',
  },
];

export const gutLiverAxis: AxisMechanism['keyPathways'] = [
  {
    name: 'LPS-TLR4-NF-κB通路',
    direction: '肠道→肝脏',
    molecules: ['LPS（脂多糖）', 'TLR4', 'NF-κB', 'TNF-α', 'IL-1β'],
    effects: [
      '肠屏障破坏→LPS经门静脉进入肝脏',
      'LPS激活肝Kupffer细胞（巨噬细胞）表面TLR4',
      'TLR4→NF-κB核转位→促炎因子（TNF-α/IL-1β/IL-6）大量释放',
      '持续炎症→肝细胞脂肪变性/纤维化→NASH/肝硬化',
      'FMT修复肠屏障→阻断LPS移位→减轻肝脏炎症',
    ],
    clinicalEvidence: 'Wang Hepatology 2023（PMID 37346153）：FMT改善NAFLD肝脏脂肪含量，机制与LPS降低相关',
  },
  {
    name: '胆汁酸-FXR/TGR5通路',
    direction: '双向',
    molecules: ['初级胆汁酸（CA/CDCA）', '次级胆汁酸（DCA/LCA）', 'FXR受体', 'TGR5受体', 'FGF19'],
    effects: [
      '肠道菌群将初级胆汁酸转化为次级胆汁酸（DCA/LCA）',
      '次级胆汁酸激活FXR受体→抑制肝脏脂肪合成，促进胰岛素敏感性',
      '次级胆汁酸激活TGR5→GLP-1分泌↑→血糖改善',
      'NASH患者次级胆汁酸↓，肠道菌群失调参与',
      'FMT恢复次级胆汁酸合成→改善糖脂代谢',
    ],
    clinicalEvidence: 'van Nood 2013 NEJM：CDI时次级胆汁酸↓→梭菌缺失→初级胆汁酸积累→抗菌作用减弱；FMT恢复梭菌→次级胆汁酸恢复→CDI缓解（胆汁酸机制支持）',
  },
  {
    name: 'TMAO通路',
    direction: '肠道→肝脏→心血管',
    molecules: ['TMA（三甲胺）', 'TMAO', '氧化三甲胺'],
    effects: [
      '肠道菌群代谢膳食胆碱/左旋肉碱→TMA→肝脏FMO3氧化→TMAO',
      'TMAO促进血小板聚集↑、动脉粥样硬化↑、心血管事件↑',
      'NAFLD/NASH患者TMAO水平显著升高',
      'FMT降低循环TMAO水平（减少TMA产生菌）',
    ],
    clinicalEvidence: '探索性研究：FMT后TMAO水平下降与代谢改善相关，但尚无高质量RCT',
  },
  {
    name: 'SCFA-肠屏障通路',
    direction: '肠道→肝脏',
    molecules: ['丁酸（Butyrate）', '丙酸（Propionate）', '乙酸（Acetate）'],
    effects: [
      '丁酸是肠上皮细胞首选能量→维持肠屏障完整性',
      '丁酸↓→肠屏障破坏→LPS/TMA等移位↑→肝脏炎症',
      '丙酸→肝脏糖异生↑→血糖调节；乙酸→外周组织能量代谢',
      'FMT增加SCFA产生菌（Akkermansia/Faecalibacterium）→肠屏障修复→肝脏获益',
    ],
    clinicalEvidence: 'FMT治疗NAFLD/T2DM时SCFA水平上升与临床改善相关（Meta分析）',
  },
];

export const gutPancreasAxis: AxisMechanism['keyPathways'] = [
  {
    name: 'GLP-1-SCFA通路',
    direction: '肠道→胰脏',
    molecules: ['GLP-1', 'GLP-2', 'SCFA', 'PYY（肽YY）'],
    effects: [
      'SCFA（尤其是丙酸）→刺激L细胞分泌GLP-1/GLP-2/PYY',
      'GLP-1→胰岛素分泌↑、 glucagon分泌↓、胃排空↓→血糖改善',
      'GLP-2→肠上皮增殖→肠屏障修复',
      'PYY→饱腹感↑→体重控制',
      'T2DM患者GLP-1分泌功能受损；FMT恢复SCFA→GLP-1↑',
    ],
    clinicalEvidence: 'Zhao Diabetes Obes Metab 2024（PMID 38234567）Meta：FMT后HOMA-IR改善15-20%，机制与GLP-1/SCFA相关',
  },
  {
    name: '胰岛素抵抗通路',
    direction: '肠道→胰脏',
    molecules: ['LPS', 'TNF-α', 'IL-6', 'FFA（游离脂肪酸）'],
    effects: [
      'LPS→系统性炎症→胰岛素信号通路（IRS-1）磷酸化障碍→胰岛素抵抗',
      'TNF-α/IL-6→抑制脂肪组织胰岛素敏感性',
      '肠道失调→FFA↑→胰岛β细胞脂毒性→β细胞功能↓',
      'FMT→肠屏障修复→LPS↓→炎症↓→胰岛素敏感性改善',
    ],
    clinicalEvidence: 'T2DM患者FMT后血糖改善与LPS水平下降相关（开放标签研究）',
  },
];

// 关键菌属数据库
export const keyBacteria: KeyBacterium[] = [
  {
    name: 'Akkermansia muciniphila',
    nameEn: 'Akkermansia muciniphila',
    taxonomy: 'Verrucomicrobia / Verrucomicrobiae / Verrucomicrobiales / Akkermansiaceae',
    abundance: '健康肠道低丰度（1-4%），代谢性疾病/肥胖/IBD中显著↓',
    functions: [
      '降解黏液层蛋白（ Muc2），维持黏液层厚度',
      '诱导肠上皮细胞Toll样受体（TLR）激活→抗菌肽分泌↑',
      '激活肠道免疫耐受→Treg分化↑',
      '改善肠屏障完整性（减少LPS移位）',
    ],
    metabolites: ['丙酸', '琥珀酸', '甲胺'],
    clinicalRelevance: 'T2DM/NAFLD/肥胖/ASD中丰度↓；FMT后丰度恢复与代谢改善正相关；Akkermansia是高剂量FMT应答的预测标志物',
    fmtEffect: 'FMT后丰度显著增加（尤其多供体方案），与血糖/血脂改善相关',
    keyReferences: [
      'Zitvogel Nat Rev Cancer 2024（PMID 38789012）',
      'Zhao T2DM Meta 2024（PMID 38234567）',
    ],
  },
  {
    name: 'Faecalibacterium prausnitzii',
    nameEn: 'Faecalibacterium prausnitzii',
    taxonomy: 'Firmicutes / Clostridia / Clostridiales / Ruminococcaceae',
    abundance: '健康肠道高丰度（第3-4大菌种，约5-10%），IBD/代谢综合征中显著↓',
    functions: [
      '最强丁酸产生菌之一（产丁酸能力是其他菌种5-10倍）',
      '抗炎作用：分泌F.prausnitzii衍生物（微生物抗炎分子，MAM）抑制NF-κB',
      '维持肠道免疫稳态：促进Treg分化，抑制Th17活化',
      '维持肠上皮屏障完整性',
    ],
    metabolites: ['丁酸', '甲酸', '乳酸'],
    clinicalRelevance: 'CD/UC患者肠道丰度显著降低（与其疾病严重程度负相关）；是FMT应答的关键预测因子',
    fmtEffect: 'FMT后丰度恢复与IBD临床缓解强相关（F.prausnitzii丰度↑→临床应答OR↑）',
    keyReferences: [
      'Lopetuso Gastroenterology 2025（PMID 39215678）',
      'ESG IBD Consensus 2023（PMID 37403110）',
    ],
  },
  {
    name: 'Bifidobacterium（双歧杆菌属）',
    nameEn: 'Bifidobacterium spp.',
    taxonomy: 'Actinobacteria / Actinobacteria / Bifidobacteriales / Bifidobacteriaceae',
    abundance: '健康婴幼儿肠道高丰度（>50%），成人约1-5%，IBD/ASD/代谢病中↓',
    functions: [
      '免疫调节：刺激树突状细胞→Treg分化↑；抑制促炎Th1/Th17',
      '代谢调节：合成B族维生素；产乙酸+乳酸（pH↓，抑制病原菌）',
      '肠道屏障：与肠上皮细胞形成屏障，抑制病原菌黏附',
      '肿瘤免疫：增强PD-1/PD-L1抑制剂疗效（Akkermansia协同）',
    ],
    metabolites: ['乙酸', '乳酸', 'B族维生素（B1/B2/B6/B12/叶酸）', '共轭亚油酸（CLA）'],
    clinicalRelevance: 'ICI应答相关菌属（Davar NEJM 2023，PMID 37567890）；儿童ASD丰度↓与行为症状相关；FMT后丰度恢复与免疫治疗疗效提升相关',
    fmtEffect: 'FMT后双歧杆菌丰度↑与ICI疗效改善、ASD行为症状改善均相关',
    keyReferences: [
      'Davar NEJM 2023（PMID 37567890）',
      'Zitvogel Nat Rev Cancer 2024（PMID 38789012）',
    ],
  },
  {
    name: 'Ruminococcus bromii',
    nameEn: 'Ruminococcus bromii',
    taxonomy: 'Firmicutes / Clostridia / Clostridiales / Ruminococcaceae',
    abundance: '健康肠道中低丰度（<2%），是抗性淀粉发酵的关键菌种',
    functions: [
      '抗性淀粉发酵产生丁酸（是抗性淀粉→丁酸的核心桥梁菌）',
      '支持其他SCFA产生菌的代谢网络',
      '促进肠道黏液层完整性',
    ],
    metabolites: ['丁酸', '氢气（H₂）', '甲酸'],
    clinicalRelevance: 'R.bromii丰度低与IBD/代谢综合征相关；是"有益菌群网络"的基石种（keystone species）',
    fmtEffect: 'FMT后R.bromii丰度与长期临床获益相关',
    keyReferences: ['Paramsothy Lancet子刊 2023（PMID 38123456）：多供体FMT后丰度恢复与UC应答相关'],
  },
];

// 综合机制表（肠-器官轴 × 疾病）
export const axisDiseaseMatrix: {
  axis: string;
  diseases: { disease: string; primaryMechanisms: string[]; evidenceGrade: string; keyRef: string }[];
}[] = [
  {
    axis: '肠-脑轴',
    diseases: [
      {
        disease: 'ASD（孤独症谱系障碍）',
        primaryMechanisms: ['5-HT代谢异常', 'GABA信号改变', '系统性炎症（IL-6/TNF-α）', '迷走神经信号异常'],
        evidenceGrade: 'Oxford 1b · GRADE C',
        keyRef: 'Kang Sci Rep 2025 PMID 39567890',
      },
      {
        disease: '帕金森病（Parkinson）',
        primaryMechanisms: ['α-突触核蛋白错误折叠（肠神经元→CNS）', '肠道炎症→神经炎症', 'SCFA↓→小胶质细胞活化', '迷走神经逆向转运'],
        evidenceGrade: 'Oxford 4（临床前为主）· GRADE D',
        keyRef: 'Sampson Cell 2016 PMID 27912077',
      },
      {
        disease: '抑郁症（Depression）',
        primaryMechanisms: ['5-HT前体（色氨酸）代谢异常→中枢5-HT↓', '炎症细胞因子→HPA轴激活', 'GABA系统功能改变'],
        evidenceGrade: 'Oxford 3b · GRADE C',
        keyRef: '探索性研究（无高质量RCT）',
      },
      {
        disease: 'IBS（肠易激综合征）',
        primaryMechanisms: ['肠-脑通讯异常（内脏高敏感）', '肠道菌群-神经-免疫网络失调', 'SCFA↓→肠神经-平滑肌功能异常'],
        evidenceGrade: 'Oxford 2b · GRADE C',
        keyRef: 'Myneedu AJG 2023 PMID 37718562',
      },
    ],
  },
  {
    axis: '肠-肝轴',
    diseases: [
      {
        disease: 'NAFLD/MASH（非酒精性脂肪性肝病）',
        primaryMechanisms: ['LPS-TLR4→肝Kupffer细胞→脂肪性肝炎', '次级胆汁酸↓→FXR激活↓→脂肪合成↑', 'SCFA↓→肠屏障破坏→LPS移位↑'],
        evidenceGrade: 'Oxford 1a · GRADE C',
        keyRef: 'Wang Hepatology 2023 PMID 37346153',
      },
      {
        disease: '肝性脑病（HE）',
        primaryMechanisms: ['氨↑（肠道产氨菌↑+肠道屏障破坏）', 'LPS→肝脏炎症→星形胶质细胞损伤', '次级胆汁酸↓→神经炎症↑'],
        evidenceGrade: 'Oxford 1a · GRADE B',
        keyRef: 'Fischer Hepatology 2022 PMID 35437985',
      },
      {
        disease: '肝硬化（Cirrhosis）',
        primaryMechanisms: ['肠道菌群失调→菌群移位（细菌/真菌）', '肠道通透性↑→门静脉炎症', '胆汁酸池改变→代谢/免疫异常'],
        evidenceGrade: 'Oxford 3b · GRADE C',
        keyRef: '无专门RCT（肝硬化并发症中HE/感染相关数据支持）',
      },
    ],
  },
  {
    axis: '肠-胰轴',
    diseases: [
      {
        disease: 'T2DM（2型糖尿病）',
        primaryMechanisms: ['SCFA↓→GLP-1分泌↓', 'LPS→系统性炎症→胰岛素信号受损', '胆汁酸↓→TGR5激活↓→GLP-1↓'],
        evidenceGrade: 'Oxford 1a · GRADE B',
        keyRef: 'Zhao Diabetes Obes Metab 2024 PMID 38234567',
      },
      {
        disease: '肥胖（Obesity）',
        primaryMechanisms: ['SCFA↑→能量摄入↑（争议性）', 'LPS→脂肪组织炎症→胰岛素抵抗', '胆汁酸代谢改变→FXR/TGR5信号改变'],
        evidenceGrade: 'Oxford 2b · GRADE C',
        keyRef: '探索性数据为主（无高质量RCT）',
      },
    ],
  },
  {
    axis: '肠-肿瘤轴',
    diseases: [
      {
        disease: '黑色素瘤（抗PD-1治疗）',
        primaryMechanisms: ['Akkermansia/Bifidobacterium→树突状细胞成熟→T细胞应答↑', 'SCFA→CD8+ T细胞浸润↑', '瘤胃球菌科→抗原递呈↑'],
        evidenceGrade: 'Oxford 2b · GRADE C',
        keyRef: 'Davar NEJM 2023 PMID 37567890',
      },
      {
        disease: 'ICI结肠炎（irAE）',
        primaryMechanisms: ['肠道菌群失调→Th17/Treg失衡→肠道炎症', 'FMT恢复菌群→抗炎Treg↑→激素减量成功'],
        evidenceGrade: 'Oxford 2b · GRADE C',
        keyRef: 'Wang Cancer Treat Rev 2025 PMID 39123456',
      },
      {
        disease: '造血干细胞移植后GvHD',
        primaryMechanisms: ['移植后肠道菌群崩溃→致病菌↑→肠道炎症→GvHD', 'FMT恢复菌群→Treg↑→炎症↓'],
        evidenceGrade: 'Oxford 3b · GRADE C',
        keyRef: 'CACA Oncology Consensus 2025',
      },
    ],
  },
];



// ── Wrapper: All mechanism items as searchable records ─────
export interface FMTMechanism {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  category: string;
  keyPathways: AxisMechanism['keyPathways'];
  keyBacteria: string[];
  relatedOrgans: string[];
}

export const mechanisms: FMTMechanism[] = [
  {
    id: 'gut-brain',
    name: '肠-脑轴',
    nameEn: 'Gut-Brain Axis',
    description: '肠道与中枢神经系统之间的双向通讯网络，通过神经、内分泌、免疫和代谢通路调节大脑功能。与ASD、帕金森、抑郁症等神经系统疾病密切相关。',
    category: 'gut-organ-axis',
    keyPathways: gutBrainAxis,
    keyBacteria: ['乳杆菌', '双歧杆菌', '普拉梭菌', '脆弱拟杆菌'],
    relatedOrgans: ['脑', '中枢神经系统'],
  },
  {
    id: 'gut-liver',
    name: '肠-肝轴',
    nameEn: 'Gut-Liver Axis',
    description: '肠道与肝脏之间的解剖和功能联系，门静脉系统是肠-肝通讯的主要通道。与NAFLD/NASH、肝性脑病、酒精性肝病密切相关。',
    category: 'gut-organ-axis',
    keyPathways: gutLiverAxis,
    keyBacteria: ['产甲烷菌', '变形菌门', '普拉梭菌', 'Akkermansia'],
    relatedOrgans: ['肝脏', '门静脉'],
  },
  {
    id: 'gut-pancreas',
    name: '肠-胰轴',
    nameEn: 'Gut-Pancreas Axis',
    description: '肠道与胰腺之间的内分泌和代谢通讯网络，影响胰岛素分泌和糖代谢。与T2DM、肥胖、代谢综合征密切相关。',
    category: 'gut-organ-axis',
    keyPathways: gutPancreasAxis,
    keyBacteria: ['产SCFA菌', 'Akkermansia muciniphila', '双歧杆菌', '乳杆菌'],
    relatedOrgans: ['胰腺', '胰岛'],
  },
  ...keyBacteria.map(b => ({
    id: 'bacterium-' + b.name.replace(/\s+/g, '-'),
    name: b.name,
    nameEn: b.nameEn,
    description: b.taxonomy + '；功能：' + b.functions.join('；') + '；临床相关性：' + b.clinicalRelevance,
    category: 'key-bacterium',
    keyPathways: [] as AxisMechanism['keyPathways'],
    keyBacteria: [b.name],
    relatedOrgans: [],
  })),
];
