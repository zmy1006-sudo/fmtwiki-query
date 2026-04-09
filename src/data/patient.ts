/**
 * FMTWiki 患者端数据
 * 简化医学术语 + 费用估算 + 就诊医院推荐
 */

export interface PatientDisease {
  id: string;
  name: string;
  medicalName: string;
  who: string;
  what: string;
  why: string;
  how: string;
  effectiveness: string;
  sideEffects: string;
  duration: string;
  preparation: string;
  aftercare: string;
  costRange: string;
  costNote: string;
  processSteps: string[];
  warnings: string;
  recommendedTeams: string[];
  source: string;
  sourceUrl: string;
}

export const patientDiseases: PatientDisease[] = [
  {
    id: "rCDI",
    name: "复发性艰难梭菌感染",
    medicalName: "复发性CDI",
    who: "反复腹泻、腹痛，曾使用抗生素后感染且反复发作的患者",
    what: "粪菌移植是将健康人的粪便中的有益菌群移植到患者肠道，重建健康的肠道菌群，从而抑制艰难梭菌的生长。这不是手术，是一种类似「肠道菌群换血」的治疗。",
    why: "反复感染会导致严重腹泻、脱水甚至危及生命。常规抗生素有效率低且容易复发，粪菌移植可从根本上恢复肠道健康，治愈率超过90%。",
    how: "通过结肠镜将处理好的健康菌群输注到肠道，或口服胶囊。整个过程约30分钟，无需手术。",
    effectiveness: "单次治疗治愈率约70-90%，多次治疗累计治愈率超过90%，显著优于单纯使用抗生素。",
    sideEffects: "常见：腹胀、排气增多、腹泻（一过性）；严重（罕见）：内镜操作相关的肠穿孔、感染。",
    duration: "通常单次治疗即可；部分患者可能需要2-3次治疗。治疗后1-2周内症状明显改善。",
    preparation: "治疗前需清肠（服用泻药排空肠道）；治疗前48小时停用抗生素；如实告知既往病史和用药情况。",
    aftercare: "治疗后保持卧位2-4小时；24小时内避免剧烈运动；遵医嘱逐步恢复正常饮食；如出现严重腹痛或大量出血立即就医。",
    costRange: "约 15,000 - 50,000 元/次",
    costNote: "部分省份医保可报销，具体请咨询当地医保局。中华粪菌库（CMTF）有公益援助通道。",
    processSteps: [
      "1. 肠道准备：治疗前1天服用泻药清肠",
      "2. 麻醉：多数医院采用静脉麻醉",
      "3. 结肠镜：经结肠镜将菌群悬液输注至回肠末端（约20-30分钟）",
      "4. 术后：卧床2-4小时，观察后当日可出院",
      "5. 随访：治疗后1周、4周复诊",
    ],
    warnings: "必须选择有FMT资质的正规医院；治疗前需充分知情同意；如实告知医生既往病史。",
    recommendedTeams: ["zhang-faming", "qin-huanlong", "pumch"],
    source: "PMID 23323867 — van Nood NEJM 2013",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/23323867/",
  },
  {
    id: "UC",
    name: "溃疡性结肠炎",
    medicalName: "溃疡性结肠炎（Ulcerative Colitis）",
    who: "确诊溃疡性结肠炎，常规药物治疗效果不佳的患者；便血、腹泻反复发作。",
    what: "粪菌移植通过改善肠道菌群，帮助控制肠道炎症。可作为传统药物的补充治疗，而非替代所有药物。",
    why: "溃疡性结肠炎与肠道菌群失调密切相关。部分患者对粪菌移植有良好应答，可减少激素用量，改善生活质量。",
    how: "多数研究采用结肠镜输注（多供体方案效果更佳），部分中心采用保留灌肠联合结肠镜。",
    effectiveness: "约30-40%的患者可达到临床缓解，多供体方案效果更好。但并非所有患者都有效，需个体评估。",
    sideEffects: "常见：腹胀、轻度腹泻；结肠镜操作相关风险（麻醉反应、穿孔，极罕见）。",
    duration: "通常需要多次治疗（每周1次×6-8周为一个疗程），症状改善通常在2-4周后出现。",
    preparation: "同常规结肠镜检查的肠道准备；如实告知目前用药（部分药物需提前停用）。",
    aftercare: "治疗后卧床观察；按医嘱继续原有药物治疗（不要擅自停药）；定期复诊评估疗效。",
    costRange: "约 8,000 - 30,000 元/疗程",
    costNote: "目前大部分地区尚未纳入医保，需自费。可咨询中华粪菌库合作医院是否有援助项目。",
    processSteps: [
      "1. 肠道准备：标准清肠方案",
      "2. 麻醉/镇静",
      "3. 结肠镜+菌群输注（20-30分钟）",
      "4. 保留灌肠（部分方案）",
      "5. 定期复诊评估，通常6-8周后评估疗效",
    ],
    warnings: "不能替代所有药物治疗；多供体方案优于单供体；需在有经验中心进行。",
    recommendedTeams: ["zhang-faming", "qin-huanlong", "pumch"],
    source: "PMID 30644982 — Costello JAMA 2019",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/30644982/",
  },
  {
    id: "Parkinson",
    name: "帕金森病（肠脑轴）",
    medicalName: "帕金森病（Parkinson's Disease）",
    who: "确诊帕金森病，出现便秘、腹胀等消化道症状，或药物效果减退的患者。",
    what: "帕金森病不只是大脑疾病，肠道菌群紊乱被认为是发病的重要机制之一。粪菌移植或可同时改善运动症状和肠道问题。",
    why: "最新临床试验（2025年）显示粪菌移植可改善帕金森患者的运动评分和非运动症状，为治疗提供新思路。",
    how: "通过结肠镜单次输注健康菌群，治疗帕金森的运动和非运动症状（研究阶段）。",
    effectiveness: "最新临床试验（2025年，30例患者）：12周后运动评分改善约8.8分，便秘等非运动症状显著改善。但样本量小，需要更多研究验证。",
    sideEffects: "研究显示安全性良好；结肠镜操作相关的低级别不适。",
    duration: "目前研究为单次移植；长期疗效和最佳方案仍在探索中。",
    preparation: "帕金森药物在治疗当日按医嘱调整（部分药物需停用）；标准肠道准备。",
    aftercare: "继续原有帕金森药物治疗（不要擅自停药）；记录症状变化日记；定期神经科复诊。",
    costRange: "约 15,000 - 35,000 元/次",
    costNote: "目前属研究性治疗，费用因中心而异。部分临床试验入组患者可免费治疗。",
    processSteps: [
      "1. 神经科和消化科联合评估",
      "2. 肠道准备",
      "3. 结肠镜下单次菌群输注（约30分钟）",
      "4. 定期随访评估（4周、8周、12周）",
    ],
    warnings: "目前证据有限，属于研究阶段；必须继续原有药物治疗；需选择有研究资质的中心。",
    recommendedTeams: ["zhang-faming", "zsu6"],
    source: "PMID 40848995 — Wang Brain Behav Immun 2025",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/40848995/",
  },
  {
    id: "ASD",
    name: "自闭症谱系障碍（肠脑轴）",
    medicalName: "自闭症谱系障碍（Autism Spectrum Disorder）",
    who: "确诊自闭症谱系障碍，伴有严重便秘、腹泻等胃肠道症状的儿童患者（主要研究对象）。",
    what: "越来越多的证据表明肠道菌群与大脑发育相关。粪菌移植可能通过改善肠道健康，间接改善部分自闭症相关行为和消化症状。",
    why: "研究发现自闭症儿童的肠道菌群与健康儿童存在差异，且胃肠道症状与行为问题高度相关。改善肠道健康或可帮助缓解部分症状。",
    how: "通过鼻胃管或结肠镜输注健康菌群（改良方案MTT）。主要针对改善胃肠道症状。",
    effectiveness: "已有研究（2年随访）显示：胃肠道症状改善约59%，部分行为评分改善约47%。但核心自闭症症状改善证据有限。",
    sideEffects: "研究显示安全性良好；主要观察胃肠道短期不适。",
    duration: "通常连续2天输注，2年随访显示效果持续。但最佳方案尚未建立。",
    preparation: "需充分评估患儿身体状况；部分中心要求患儿配合口服泻药。",
    aftercare: "观察胃肠道症状变化；按医嘱调整饮食；定期发育行为评估。",
    costRange: "约 10,000 - 25,000 元/疗程",
    costNote: "属研究性治疗，部分临床试验入组免费；需选择有资质医疗机构。",
    processSteps: [
      "1. 发育行为科和消化科联合评估",
      "2. 肠道准备（改良方案）",
      "3. 鼻胃管或结肠镜输注（连续2天）",
      "4. 定期随访（行为评估+消化道评估）",
    ],
    warnings: "主要改善胃肠道症状；核心自闭症行为改善证据有限；需充分知情同意。",
    recommendedTeams: ["zhang-faming", "zsu6"],
    source: "PMID 28122648 — Kang Microbiome 2017",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/28122648/",
  },
  {
    id: "Metabolic",
    name: "代谢综合征（肠代谢轴）",
    medicalName: "代谢综合征（Metabolic Syndrome）",
    who: "肥胖、胰岛素抵抗、2型糖尿病前期或早期患者，肠道菌群紊乱相关代谢异常。",
    what: "肠道菌群参与调控血糖、血脂代谢。粪菌移植可将健康的代谢菌群移植到代谢异常患者体内，帮助改善胰岛素敏感性。",
    why: "研究证实：移植健康人粪菌后，胰岛素敏感性显著提升，为代谢疾病提供全新治疗思路。",
    how: "通过鼻十二指肠管或结肠镜输注健康菌群。",
    effectiveness: "研究显示12周后胰岛素敏感性提升约70%，但效果持续时间因人而异。体重下降效果有限。",
    sideEffects: "主要为一过性腹胀、排气；长期安全性数据仍在积累。",
    duration: "单次移植即可看到代谢改善；部分研究采用多次治疗。效果通常在8-12周后评估。",
    preparation: "空腹或清淡饮食后进行；标准肠道准备；部分中心要求治疗前控制饮食。",
    aftercare: "持续改善生活方式（饮食+运动）；定期监测血糖、血脂；部分研究建议自体粪菌冻存备后续使用。",
    costRange: "约 15,000 - 40,000 元/次",
    costNote: "目前属研究性治疗，部分研究入组免费。",
    processSteps: [
      "1. 代谢科评估（血糖、血脂，体脂分析）",
      "2. 肠道准备",
      "3. 鼻十二指肠管或结肠镜输注",
      "4. 定期代谢指标随访（4周、8周、12周）",
    ],
    warnings: "不能替代生活方式干预；主要改善胰岛素敏感性，体重下降有限；需持续健康管理和监测。",
    recommendedTeams: ["zhang-faming", "sjtu-ai"],
    source: "PMID 22728514 — Vrieze Gastroenterology 2012",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/22728514/",
  },
  {
    id: "CDI_Prevention",
    name: "抗菌药物后肠道恢复",
    medicalName: "抗菌药物管理（FMT辅助）",
    who: "长期反复使用抗菌药物的患者（尤其是老年人、免疫低下者），希望减少抗菌药物相关性腹泻和CDI风险。",
    what: "抗菌药物会同时杀死有害菌和有益菌，破坏肠道生态。粪菌移植可帮助快速重建健康的肠道菌群，减少再次感染风险。",
    why: "长期用抗菌药物后肠道菌群恢复需要数周至数月，粪菌移植可加速这一过程，降低CDI等感染风险。",
    how: "抗菌药物疗程结束后，通过口服胶囊或结肠镜输注健康菌群。口服胶囊方案最方便。",
    effectiveness: "研究显示可显著加速菌群恢复，降低CDI复发风险，但具体数据因人群和方案而异。",
    sideEffects: "口服胶囊方案安全性良好；主要为一过性腹胀、排气。",
    duration: "通常在抗菌药物疗程结束后1-7天内给药，单次或连续2天。",
    preparation: "抗菌药物疗程结束后进行肠道准备（口服胶囊方案要求较低）。",
    aftercare: "恢复正常饮食；观察排便情况；如再次使用抗菌药物，菌群可能再次紊乱。",
    costRange: "约 5,000 - 20,000 元/次",
    costNote: "抗菌药物管理方向费用因方案差异较大；部分为临床研究一部分。",
    processSteps: [
      "1. 抗菌药物疗程结束",
      "2. 肠道评估（如有必要清肠）",
      "3. 口服胶囊或结肠镜输注",
      "4. 观察排便恢复情况",
    ],
    warnings: "不适合所有抗菌药物使用场景；需医生评估获益风险比；严重免疫抑制者需谨慎。",
    recommendedTeams: ["zhang-faming", "fmtmat"],
    source: "PMID 30193113 — Suez Cell 2018",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/30193113/",
  },
];

export function getPatientDiseaseById(id: string): PatientDisease | undefined {
  return patientDiseases.find((d) => d.id === id);
}
