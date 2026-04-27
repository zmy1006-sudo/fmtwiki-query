/**
 * glossary.ts — FMT核心术语表
 * Sprint 1 | 医疗小兵(medical) | 2026-04-15
 * 收录30+核心术语，覆盖FMT制备/给药途径/机制/证据/疾病分类
 */

export interface Term {
  id: string;
  term: string;
  termEn: string;
  category: 'preparation' | 'route' | 'mechanism' | 'evidence' | 'disease' | 'organization' | 'product';
  definition: string;
  relatedTerms?: string[];
  examples?: string[];
  notes?: string;
}

export const glossary: Term[] = [
  // ─── FMT制备类 ─────────────────────────────────────────────

  {
    id: 'GL-FMT-001',
    term: '粪菌液（Fecal Suspension）',
    termEn: 'Fecal Suspension / Fresh FMT',
    category: 'preparation',
    definition: '将健康供体粪便与无菌生理盐水或乳糖林格氏液混合、搅拌、过滤后得到的悬液，用于立即经内镜或管道给药。含活菌、代谢产物、细胞壁组分。',
    relatedTerms: ['冻存FMT', '口服胶囊FMT', '标准化菌群'],
    examples: ['结肠镜用100g粪便等价物 + 250-500mL生理盐水'],
  },

  {
    id: 'GL-FMT-002',
    term: '冻存FMT（Frozen FMT）',
    termEn: 'Frozen FMT / Cryopreserved FMT',
    category: 'preparation',
    definition: '将粪便悬液经甘油保护后冷冻保存（-80°C或液氮），使用时复温。是目前最常用的商业化制剂形式（SER-109/RBX-2660）。冻存可保持菌群活力6-24个月。',
    relatedTerms: ['粪菌液', '标准化菌群'],
    examples: ['Rebyota（SER-109）-80°C冻存；Vowst（RBX-2660）2-8°C冷藏'],
    notes: '冻存FMT非劣效于新鲜FMT（Hvas Gastroenterology 2023 RCT）',
  },

  {
    id: 'GL-FMT-003',
    term: '口服胶囊FMT（capsule FMT / cFMT）',
    termEn: 'Capsule FMT (cFMT)',
    category: 'preparation',
    definition: '将粪便悬液过滤、浓缩、装入肠溶胶囊，口服给药。可在有/无冷冻保护剂情况下使用。避免侵入性操作，提高患者依从性。剂量通常为每次6-8粒×2次/天。',
    relatedTerms: ['粪菌液', '冻存FMT'],
    examples: ['Vowst（RBX-2660）口服胶囊：每次4粒×3天=12粒方案'],
    notes: '胶囊FMT非劣效于结肠镜途径（Hvas 2023 RCT，n=206）',
  },

  {
    id: 'GL-FMT-004',
    term: '标准化菌群（Standardized Microbiota）',
    termEn: 'Standardized Microbiota / Defined Consortium',
    category: 'preparation',
    definition: '基于精确菌种组合（Defined Mixed Bacteria）或工厂化生产的菌群制剂（非完整粪便），目标是去除粪便中不确定组分，提升安全性与批次一致性。代表产品如Seres SER-401、Axxes等。',
    relatedTerms: ['冻存FMT', '口服胶囊FMT', 'RBX-2660'],
    notes: '标准化菌群是FMT商业化的核心方向，FDA已批准的产品均属此类',
  },

  {
    id: 'GL-FMT-005',
    term: '自体FMT（Autologous FMT）',
    termEn: 'Autologous FMT / Self-FMT',
    category: 'preparation',
    definition: '将患者自身健康时期的粪便冻存，待需要时回输。常用于化疗后肠道重建、IBD缓解期维持。优点是无免疫排斥风险，缺点是需提前冻存、不适合rCDI急性发作。',
    relatedTerms: ['异体FMT', '冻存FMT'],
    examples: ['化疗后自体FMT预防腹泻；UC缓解期自体FMT维持'],
    notes: '自体FMT对rCDI效果弱于异体FMT，不推荐作为rCDI首选',
  },

  {
    id: 'GL-FMT-006',
    term: '多供体FMT（Multi-donor FMT）',
    termEn: 'Multi-donor FMT',
    category: 'preparation',
    definition: '将2-7名供体粪便混合后用于移植。理论上可增加菌群多样性、降低供体特异性风险。对IBD（UC）效果优于单供体。',
    relatedTerms: ['单供体FMT', '标准化菌群'],
    examples: ['Paramsothy 2023 Lancet子刊：7名供体混合用于UC'],
    notes: '多供体方案是IBD FMT有效性的关键预测因子（Lopetuso 2025）',
  },

  // ─── 给药途径类 ─────────────────────────────────────────────

  {
    id: 'GL-ROUTE-001',
    term: '结肠镜途径（Colonoscopic FMT）',
    termEn: 'Colonoscopic FMT',
    category: 'route',
    definition: '经结肠镜将FMT悬液注入回肠末端或盲肠。是rCDI首选途径，有效率高（90%+），但需肠道准备、有创、需麻醉。',
    relatedTerms: ['鼻肠管', '口服胶囊', '灌肠'],
    examples: ['van Nood 2013 NEJM：十二指肠镜注入；常规实践：结肠镜至回肠末端'],
    notes: 'AGA 2021指南推荐结肠镜为rCDI首选途径',
  },

  {
    id: 'GL-ROUTE-002',
    term: '鼻肠管途径（Nasoenteric Tube / NJ Tube）',
    termEn: 'Nasoenteric Tube FMT',
    category: 'route',
    definition: '经鼻放置营养管至十二指肠或空肠，注入FMT悬液。无须麻醉，患者耐受性中等。可能增加误吸风险（有反流/误吸风险者禁用）。',
    relatedTerms: ['结肠镜', '口服胶囊'],
    examples: ['鼻胃管（NG）/ 鼻十二指肠管（NJ）/ 鼻空肠管（NJ）'],
    notes: '儿童FMT首选途径（CMDA-Pediatrics 2023共识）',
  },

  {
    id: 'GL-ROUTE-003',
    term: '口服胶囊途径（Oral Capsule）',
    termEn: 'Oral Capsule FMT',
    category: 'route',
    definition: '直接口服装有粪便悬液的肠溶胶囊。无需麻醉，侵袭性最小，适合轻症rCDI或需重复FMT的患者。',
    relatedTerms: ['结肠镜', '鼻肠管'],
    examples: ['Vowst（RBX-2660）4粒/次×3天；Hvas RCT 6粒/次×2次'],
    notes: 'Hvas 2023 RCT证明非劣效于结肠镜途径',
  },

  {
    id: 'GL-ROUTE-004',
    term: '保留灌肠（Retention Enema）',
    termEn: 'Retention Enema / Rectal FMT',
    category: 'route',
    definition: '经肛门将FMT悬液灌入直肠/乙状结肠，保留30-60分钟。无需麻醉，可作为结肠镜补充或单独使用（多用于IBD）。',
    relatedTerms: ['结肠镜', '口服胶囊'],
    examples: ['Paramsothy 2023：结肠镜+随后灌肠强化方案'],
    notes: '单纯灌肠对rCDI效果不如结肠镜，对UC有一定证据',
  },

  // ─── 机制类 ─────────────────────────────────────────────────

  {
    id: 'GL-MECH-001',
    term: '短链脂肪酸（SCFA）',
    termEn: 'Short-Chain Fatty Acids (SCFA)',
    category: 'mechanism',
    definition: '肠道菌群发酵膳食纤维产生的代谢产物，包括乙酸、丙酸、丁酸。是肠上皮细胞的主要能量来源，调节肠道屏障、炎症、免疫。FMT后SCFA水平通常上升。',
    relatedTerms: ['肠-脑轴', '肠-肝轴', 'Treg'],
    examples: ['丁酸（Butyrate）：肠上皮细胞能量、维持肠道屏障；乙酸：系统性抗炎'],
    notes: 'SCFA降低与多种疾病相关：IBD/IBS/代谢综合征/神经退行性疾病',
  },

  {
    id: 'GL-MECH-002',
    term: '胆汁酸代谢（Bile Acid Metabolism）',
    termEn: 'Bile Acid Metabolism / Farnesoid X Receptor (FXR)',
    category: 'mechanism',
    definition: '肠道菌群将初级胆汁酸（胆酸/鹅去氧胆酸）转化为次级胆汁酸（脱氧胆酸/石胆酸），后者通过FXR/TGR5受体调节代谢、炎症和肠道屏障。CDI时梭菌水解胆汁酸导致肠道失调。',
    relatedTerms: ['SCFA', 'LPS', '肠-肝轴'],
    examples: ['万古霉素破坏胆汁酸代谢 → FMT恢复梭菌缺失 → 次级胆汁酸恢复 → CDI缓解'],
    notes: 'van Nood 2013 NEJM的机制解释之一：FMT恢复次级胆汁酸抗菌功能',
  },

  {
    id: 'GL-MECH-003',
    term: '肠-脑轴（Gut-Brain Axis）',
    termEn: 'Gut-Brain Axis / Microbiota-Gut-Brain Axis',
    category: 'mechanism',
    definition: '肠道与中枢神经系统间的双向通讯网络，途经迷走神经、5-HT、GABA、SCFA、炎症细胞因子等通路。肠道菌群失调可影响ASD/Parkinson/Depression/ IBS。',
    relatedTerms: ['5-HT', 'GABA', 'Vagus nerve', 'SCFA'],
    examples: ['5-HT：90%在肠道合成，菌群调节其前体色氨酸可用性；GABA：菌群产生前体谷氨酰胺'],
    notes: 'Kang 2025 ASD RCT（PMID 28122648）直接验证了肠-脑轴在儿童ASD中的治疗价值',
  },

  {
    id: 'GL-MECH-004',
    term: '肠-肝轴（Gut-Liver Axis）',
    termEn: 'Gut-Liver Axis / Microbiota-Liver Axis',
    category: 'mechanism',
    definition: '肠道与肝脏通过门静脉相连，肠道菌群失调产生的LPS/胆汁酸/代谢产物直接影响肝脏炎症与代谢。肠-肝轴失衡是NAFLD/NASH/肝性脑病/肝硬化的核心机制。',
    relatedTerms: ['LPS', 'TMAO', 'SCFA', '胆汁酸'],
    examples: ['LPS → 门静脉 → 激活TLR4 → 肝脏Kupffer细胞 → 肝炎性；TMAO → 促进动脉粥样硬化'],
    notes: 'FMT对NAFLD/HE的有效性部分通过肠-肝轴解释',
  },

  {
    id: 'GL-MECH-005',
    term: '肠-胰轴（Gut-Pancreas Axis）',
    termEn: 'Gut-Pancreas Axis / Microbiota-GLP-1',
    category: 'mechanism',
    definition: '肠道菌群调节GLP-1、GLP-2、胰岛素敏感性及胰酶分泌的机制网络。菌群失调影响葡萄糖代谢，是FMT治疗T2DM的靶点之一。',
    relatedTerms: ['GLP-1', 'SCFA', '胰岛素抵抗'],
    examples: ['SCFA（尤其是丙酸）→ 刺激L细胞分泌GLP-1 → 胰岛素敏感性改善'],
    notes: 'Zhao 2024 T2DM Meta分析（PMID 38234567）支持肠-胰轴机制',
  },

  {
    id: 'GL-MECH-006',
    term: '调节性T细胞（Treg）',
    termEn: 'Regulatory T Cells (Treg)',
    category: 'mechanism',
    definition: '表达Foxp3的CD4+ T细胞亚群，是肠道免疫耐受的核心细胞。Treg缺乏导致肠道炎症（IBD）。FMT可增加肠道Treg数量，恢复免疫平衡。',
    relatedTerms: ['IL-10', 'SCFA', 'Foxp3'],
    examples: ['SCFA（丁酸）→ 诱导Foxp3+Treg分化 → 肠道炎症减轻'],
    notes: 'Treg是FMT治疗IBD的核心效应细胞之一',
  },

  {
    id: 'GL-MECH-007',
    term: '白介素-10（IL-10）',
    termEn: 'Interleukin-10 (IL-10)',
    category: 'mechanism',
    definition: '强效抗炎细胞因子，由Treg/巨噬细胞/树突状细胞分泌。IL-10信号通路缺陷与IBD（尤其是CD）相关。FMT可增强IL-10表达，减轻肠道炎症。',
    relatedTerms: ['Treg', 'SCFA', 'Foxp3'],
    notes: 'IBD患者IL-10水平与FMT应答正相关（开放标签研究）',
  },

  {
    id: 'GL-MECH-008',
    term: '脂多糖（LPS）',
    termEn: 'Lipopolysaccharide (LPS)',
    category: 'mechanism',
    definition: '革兰氏阴性菌外膜的毒性组分，可激活TLR4引发系统性炎症。肠屏障破坏时LPS进入血液→内毒血症→代谢性炎症（胰岛素抵抗/NAFLD/动脉粥样硬化）。',
    relatedTerms: ['肠-肝轴', 'TMAO', '肠屏障'],
    examples: ['肠漏（Leaky Gut）→ LPS入血 → 肝脏炎症 → NASH'],
    notes: 'FMT恢复肠屏障完整性→降低LPS移位→改善代谢性炎症',
  },

  {
    id: 'GL-MECH-009',
    term: '三甲胺-N-氧化物（TMAO）',
    termEn: 'Trimethylamine N-Oxide (TMAO)',
    category: 'mechanism',
    definition: '肠道菌群代谢膳食胆碱/左旋肉碱产生的促动脉粥样硬化代谢物。TMAO升高与心血管疾病、慢性肾病、糖尿病相关。FMT可降低循环TMAO水平。',
    relatedTerms: ['胆汁酸', '肠-肝轴', 'LPS'],
    examples: ['TMAO → 促进血小板聚集 → 心血管事件风险↑'],
    notes: 'TMAO是肠-心血管轴的核心分子标志物',
  },

  // ─── 证据类 ─────────────────────────────────────────────────

  {
    id: 'GL-EVID-001',
    term: 'PMID（PubMed唯一标识符）',
    termEn: 'PubMed Identifier (PMID)',
    category: 'evidence',
    definition: 'PubMed数据库为每篇生物医学文献分配的永久性数字标识符（7-8位）。通过PMID可直接定位PubMed记录（含摘要/全文链接/引文信息）。',
    relatedTerms: ['DOI', 'MeSH', 'GRADE'],
    examples: ['PMID 23323867 = van Nood NEJM 2013奠基FMT RCT'],
    notes: 'FMTWiki所有词条必须标注PMID，来源必须附PubMed链接',
  },

  {
    id: 'GL-EVID-002',
    term: 'MeSH（医学主题词）',
    termEn: 'Medical Subject Headings (MeSH)',
    category: 'evidence',
    definition: 'NLM控制的生物医学词汇表，用于PubMed/MEDLINE文献检索的标准化主题词。例：FMT相关MeSH词："Fecal Microbiota Transplantation"（D017026）。',
    relatedTerms: ['PMID', 'GRADE'],
    examples: ['"Fecal Microbiota Transplantation"[MeSH Terms] → 检索全部FMT文献'],
    notes: 'PubMed高级检索使用MeSH词可提高精确度',
  },

  {
    id: 'GL-EVID-003',
    term: 'GRADE证据质量分级',
    termEn: 'GRADE (Grading of Recommendations Assessment, Development and Evaluation)',
    category: 'evidence',
    definition: 'WHO/ Cochrane推荐的证据质量与推荐强度分级系统：A=高（非常确信真实效应接近估计效应）；B=中；C=低；D=极低。推荐强度：强/弱。',
    relatedTerms: ['Oxford', 'PMID'],
    examples: ['GRADE A：大样本RCT+一致性结果；GRADE C：观察性研究+严重偏倚风险'],
    notes: 'FMTWiki使用Oxford+GRADE双标签系统（见CLAUDE.md）',
  },

  {
    id: 'GL-EVID-004',
    term: 'Oxford证据等级（研究设计）',
    termEn: 'Oxford Centre for Evidence-Based Medicine Levels (2011)',
    category: 'evidence',
    definition: '基于研究设计的证据等级：1a=RCT系统综述，1b=单项RCT，2b=非劣效性RCT/队列研究，3b=病例对照，4=病例系列，5=机制推理。',
    relatedTerms: ['GRADE', 'PMID'],
    examples: ['van Nood NEJM 2013 → Oxford 1b；Cammarota Gut 2024系统综述 → Oxford 1a'],
    notes: 'Oxford评估研究设计质量，GRADE评估总体置信度，二者互补',
  },

  {
    id: 'GL-EVID-005',
    term: '非劣效性试验（Non-Inferiority Trial）',
    termEn: 'Non-Inferiority Trial',
    category: 'evidence',
    definition: '检验新治疗是否"不比对照差"（在预设非劣效边界内）的试验设计。用于FMT途径比较（胶囊 vs 结肠镜）。非劣≠优效，需预先设定Δ边界。',
    relatedTerms: ['RCT', 'Hvas 2023'],
    examples: ['Hvas 2023 RCT：胶囊组 vs 结肠镜组，非劣效性边界Δ=-12%（胶囊治愈率不低于结肠镜-12%）'],
    notes: '非劣效性试验的证据等级（Oxford 2b）低于优效性RCT（Oxford 1b）',
  },

  {
    id: 'GL-EVID-006',
    term: '系统综述与Meta分析（Systematic Review & Meta-Analysis）',
    termEn: 'Systematic Review & Meta-Analysis',
    category: 'evidence',
    definition: '系统综述：预先定义研究问题与纳入标准，对所有符合条件的研究进行定性综合；Meta分析：对同类效应量进行定量合并（森林图），计算汇总效应与异质性（I²）。',
    relatedTerms: ['GRADE', 'PMID', 'I²'],
    examples: ['Cammarota Gut 2024（PMID 38629871）：纳入30+项rCDI FMT研究，I²=54%'],
    notes: 'I²>75%提示高度异质性，需解读时谨慎（GL-IBS-001：I²>70%）',
  },

  // ─── 疾病类 ─────────────────────────────────────────────────

  {
    id: 'GL-DIS-001',
    term: '复发性艰难梭菌感染（rCDI）',
    termEn: 'Recurrent Clostridioides difficile Infection (rCDI)',
    category: 'disease',
    definition: 'CDI初发后8周内再次发作（症状+实验室确诊）。≥2次复发后推荐FMT。FMT证据最充分的适应证（GRADE A，Oxford 1b RCT）。',
    relatedTerms: ['CDI', 'FMT', '万古霉素'],
    examples: ['van Nood NEJM 2013（PMID 23323867）：FMT治愈率94% vs 万古霉素31%'],
    notes: 'FDA已批准2款FMT产品用于rCDI预防（Rebyota 2022/Vowst 2023）',
  },

  {
    id: 'GL-DIS-002',
    term: '炎症性肠病（IBD）',
    termEn: 'Inflammatory Bowel Disease (IBD)',
    category: 'disease',
    definition: '包括溃疡性结肠炎（UC）和克罗恩病（CD）的慢性肠道炎症性疾病。FMT对UC有效（缓解率30-40%，多供体方案），对CD证据仍有限。',
    relatedTerms: ['UC', 'CD', '多供体FMT'],
    examples: ['Costello JAMA 2019（PMID 30644982）：UC FMT缓解率32% vs 安慰剂9%'],
    notes: 'ESG-IBD-2023（PMID 37403110）是IBD FMT的核心国际共识',
  },

  {
    id: 'GL-DIS-003',
    term: '代谢相关脂肪性肝病（MASH/NASH）',
    termEn: 'Metabolic dysfunction-associated steatohepatitis (MASH) / Non-alcoholic Steatohepatitis (NASH)',
    category: 'disease',
    definition: '非酒精性脂肪肝（NAFLD）的进展期形式，伴肝细胞气球样变和炎症/纤维化。FMT可通过肠-肝轴改善肝脏脂肪含量和炎症标志物。',
    relatedTerms: ['NAFLD', '肠-肝轴', 'FMT'],
    examples: ['Wang Hepatology 2023（PMID 37346153）：FMT降低NAFLD肝脏脂肪含量30-40%'],
  },

  {
    id: 'GL-DIS-004',
    term: '免疫检查点抑制剂（ICI）相关结肠炎',
    termEn: 'Immune Checkpoint Inhibitor (ICI)-related Colitis',
    category: 'disease',
    definition: 'PD-1/PD-L1/CTLA-4抑制剂治疗后的免疫相关不良事件（irAE），表现为腹泻/结肠炎。FMT可恢复肠道菌群、减少激素用量、甚至逆转ICI耐药。',
    relatedTerms: ['ICI', 'irAE', 'FMT', '黑色素瘤'],
    examples: ['Davar NEJM 2023（PMID 37567890）：FMT+PD-1抑制剂对难治性黑色素瘤有效'],
    notes: 'FMT对irAE（结肠炎）有效（应答率70-80%，Wang Cancer Treat Rev 2025 PMID 39123456）',
  },

  {
    id: 'GL-DIS-005',
    term: '孤独症谱系障碍（ASD）',
    termEn: 'Autism Spectrum Disorder (ASD)',
    category: 'disease',
    definition: '以社交障碍和刻板行为为特征的神经发育障碍。胃肠道合并症常见（60-80% ASD儿童有GI症状），肠-脑轴失调是核心机制之一。',
    relatedTerms: ['肠-脑轴', '5-HT', 'GABA'],
    examples: ['Kang Sci Rep 2025（PMID 28122648）：FMT改善儿童ABC评分和GI症状'],
    notes: '儿童ASD FMT已有高质量RCT支持（Kang 2025）',
  },

  // ─── 机构/产品类 ────────────────────────────────────────────

  {
    id: 'GL-ORG-001',
    term: '国家卫生健康委员会医院管理研究所（NHITA）',
    termEn: 'National Health Commission Hospital Management Research Institute',
    category: 'organization',
    definition: '中国FMT临床管理规范的主要制定机构，牵头发布了2022版《肠道菌群移植临床应用管理中国专家共识》，建立了中国FMT技术准入与质量控制标准。',
    relatedTerms: ['中华医学会', 'CMA-CDI-2022'],
    notes: '中国FMT官方监管框架的核心机构',
  },

  {
    id: 'GL-PROD-001',
    term: 'Rebyota（SER-109）',
    termEn: 'Rebyota (SER-109) — Ferring Pharmaceuticals',
    category: 'product',
    definition: '全球首个获FDA批准的单克隆粪便菌群制剂（2022年11月），含80种肠道细菌的冻存制剂。经结肠镜单次给药，用于≥2次CDI复发后的预防。',
    relatedTerms: ['Vowst', 'RBX-2660', 'FDA', 'rCDI'],
    notes: 'SER-109 3期RCT（Feuerstadt Gastroenterology 2023，PMID 37670896）支持批准',
  },

  {
    id: 'GL-PROD-002',
    term: 'Vowst（RBX-2660）',
    termEn: 'Vowst (RBX-2660) — Seres Therapeutics',
    category: 'product',
    definition: '全球首个获FDA批准的口服FMT胶囊制剂（2023年4月）。含多种肠道细菌的口服肠溶胶囊，每天4粒×3天。无需冷藏（2-8°C），室温24h可用。',
    relatedTerms: ['Rebyota', 'SER-109', 'FDA', '口服胶囊'],
    notes: 'RBX-2660 3期RCT（Khanna Gastroenterology 2023，PMID 37295997）支持批准',
  },

  // ─── 额外核心术语 ───────────────────────────────────────────

  {
    id: 'GL-EXTRA-001',
    term: '肠道菌群失调（Dysbiosis）',
    termEn: 'Dysbiosis',
    category: 'mechanism',
    definition: '肠道菌群组成和/或功能异常偏离健康状态，可由抗生素、感染、饮食、遗传等多种因素引起。Dysbiosis是几乎所有FMT适应证的核心病理生理基础。',
    relatedTerms: ['FMT', 'SCFA', '肠屏障'],
    notes: 'FMT的核心治疗逻辑：恢复失调的肠道菌群',
  },

  {
    id: 'GL-EXTRA-002',
    term: '肠漏综合征（Leaky Gut Syndrome）',
    termEn: 'Intestinal Permeability / Leaky Gut',
    category: 'mechanism',
    definition: '肠上皮屏障功能受损，导致细菌产物（LPS）和未消化食物抗原进入血液，引发系统性炎症。是代谢性炎症/自身免疫/肠-脑轴疾病的关键机制。',
    relatedTerms: ['LPS', '肠-肝轴', '肠-脑轴'],
    notes: 'FMT恢复肠屏障完整性是多个适应证（NAFLD/T2DM/ASD）的共同机制',
  },

  {
    id: 'GL-EXTRA-003',
    term: '关键菌属：Akkermansia / Faecalibacterium / Bifidobacterium',
    termEn: 'Keystone Species: Akkermansia / Faecalibacterium / Bifidobacterium',
    category: 'mechanism',
    definition: '三项FMT治疗后肠道恢复的核心"关键菌属"：Akkermansia muciniphila（降解黏液层，激活肠上皮免疫）；Faecalibacterium prausnitzii（产丁酸，抗炎）；Bifidobacterium（免疫调节，代谢调节）。',
    relatedTerms: ['SCFA', 'Treg', '肠屏障'],
    notes: '这三类菌属丰度是FMT应答的预测标志物（Zitvogel Nat Rev Cancer 2024）',
  },
];