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
  /** 典型临床特征：主要症状/体征/实验室检查 */
  clinicalFeatures?: string;
  /** 流行病学：患病率/发病率/高危人群 */
  epidemiology?: string;
  /** 诊断标准：主要诊断依据和方法 */
  diagnosticCriteria?: string;
  /** FMT患者筛选条件：适合做FMT的具体标准 */
  patientCriteria?: string;
  /** 疾病进展与预后：自然史/不治疗后果/FMT后结局 */
  diseaseProgression?: string;
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
    clinicalFeatures: "主要症状：腹泻（水样便或血性便，每天≥3次），腹痛（脐周或左下腹痉挛性疼痛），腹胀（肠道产气增多）；体征：发热（38-39°C为主），腹部压痛（多为轻中度），脱水体征（皮肤弹性差、眼窝凹陷）；实验室：大便毒素检测（EIA法毒素A/B阳性），PCR检测毒素基因（tcdA/tcdB阳性），艰难梭菌培养阳性，白细胞升高（10-15×10⁹/L），肌酐升高（肾功能受损）；影像：腹部X线/CT示结肠壁增厚、水肿，无肠梗阻或穿孔证据",
    epidemiology: "美国每年约50万例CDI，复发率约20-30%，其中25-30%会经历第二次复发；65岁以上老年患者风险增加5-10倍；既往≥2次CDI复发或1次严重复发后再次发作即为rCDI定义；中国住院患者CDI发病率逐年上升，以老年和免疫抑制人群为主",
    diagnosticCriteria: "主要诊断依据：①大便艰难梭菌毒素阳性（EIA）或PCR检测毒素基因阳性；②临床症状符合CDI（腹泻≥3次/天，水样便或血便）；③近期抗菌药物使用史（1-8周内）；鉴别诊断：①感染性肠炎（沙门氏菌、志贺氏菌）；②炎症性肠病急性发作；③抗菌药物相关腹泻（非CDI型）；④缺血性结肠炎",
    patientCriteria: "适合FMT：年龄≥18岁；确诊rCDI（≥2次抗生素治疗无效或复发）；既往万古霉素/非达霉素治疗≥10天仍复发；无FMT绝对禁忌证；不适合FMT：血流动力学不稳定；消化道穿孔或肠梗阻；严重凝血障碍（INR>2.5，血小板<50×10⁹/L）；重度免疫缺陷（HIV/AIDS、化疗中粒缺）；中毒性巨结肠或暴发性结肠炎",
    diseaseProgression: "rCDI不治疗：每次复发均需延长万古霉素疗程，复发次数随时间增加，约20-30%患者经历多次复发，最终可能需长期万古霉素抑制治疗（维搏宁方案）；FMT治疗后：单次FMT治愈率70-90%，累积治愈率>95%；复发率约5-10%，多数复发发生于FMT后8周内，可再次FMT；长期随访（2年）显示FMT安全性良好",
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
    clinicalFeatures: "主要症状：反复发作性黏液脓血便（左下腹或全腹痛性腹泻，每天2-20次不等），里急后重感，腹痛（多为左下腹痉挛性）；体征：肛门指诊可见血便、黏液，结肠镜前体检可有左下腹压痛，重症可见贫血貌、消瘦；实验室：大便常规见黏液、红细胞、白细胞；血常规示贫血（Hb下降）、白细胞升高、血小板升高；CRP/ESR升高（反映炎症活动度）；粪钙卫蛋白（FC）显著升高（>250μg/g提示活动性炎症）；影像：腹部X线/CT排除中毒性巨结肠；结肠镜：连续性黏膜充血、水肿、溃疡、质脆易出血，病变自直肠向近端连续性分布",
    epidemiology: "西方国家UC发病率约10-20/10万，患病率150-300/10万；中国发病率约1-3/10万，呈上升趋势（与西化生活方式相关）；发病高峰年龄15-30岁和50-70岁；高危因素：城市生活、西式饮食、IBD家族史、吸烟（尼古丁对UC有保护作用，但机制复杂）；中国UC患者病情严重度与西方国家相似，但治疗可及性存在地区差异",
    diagnosticCriteria: "主要诊断依据：①临床表现（黏液脓血便、腹痛、里急后重）；②结肠镜特征（连续性、自直肠向近端分布的黏膜炎症）；③病理活检（隐窝脓肿、隐窝结构紊乱、基底部浆细胞浸润）；鉴别诊断：①感染性结肠炎（阿米巴、细菌性痢疾、CMV结肠炎）；②克罗恩病（不连续病变、节段性分布）；③缺血性结肠炎（老年患者，脾曲以远为主）；④药物相关结肠炎（NSAID相关）；⑤肠结核",
    patientCriteria: "适合FMT：中重度活动性UC（Mayo评分4-12分）经标准治疗（5-ASA/糖皮质激素/免疫抑制剂）效果不佳或激素依赖；轻中度UC拒绝免疫抑制剂者；不适合FMT：中毒性巨结肠或暴发性结肠炎（需紧急手术）；重度营养不良（BMI<16）；严重狭窄伴梗阻症状；既往FMT有严重不良反应；妊娠期（除非重症危及生命）；活动性感染未控制",
    diseaseProgression: "UC不治疗：慢性持续性炎症导致病情进展，约20-30%患者在诊断后10年内需结肠切除术，主要因为药物难以控制的持续出血或癌变风险；FMT治疗后：诱导缓解率30-40%（多供体方案可达40-50%），但长期维持效果不确切；复发率较高，约30-50%患者在FMT后6-12个月内复发，需重复FMT或其他治疗维持；FMT不能改变UC需终身管理的本质",
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
    clinicalFeatures: "主要症状：腹痛伴排便习惯改变（腹泻为主型IBS-D，便秘为主型IBS-C，或混合型IBS-M），症状反复发作（≥3天/周，持续≥3个月）；IBS-D：餐后腹痛伴急迫感，排便后缓解，大便松散/水样；IBS-C：腹痛伴排便困难，大便干硬如羊粪状；IBS-M：腹泻与便秘交替；体征：无特异性体征，腹部触诊可有广泛压痛（内脏敏感性增加）；实验室：常规实验室检查（血常规、生化、甲状腺功能、粪便常规）均正常，排除感染和炎症；IBS为功能性疾病，诊断基于症状而非器质性发现",
    epidemiology: "全球IBS患病率约10-15%（西方国家10-20%，亚洲5-10%）；中国患病率约5-7%，女性患病率是男性的1.5-2倍；发病高峰20-40岁；IBS-D是最常见亚型（约40%），其次为IBS-M（35%）和IBS-C（25%）；高危因素：精神心理障碍（焦虑、抑郁）、肠感染后（感染后IBS，PI-IBS）、肠道菌群失调；IBS患者常共病纤维肌痛、慢性疲劳综合征、偏头痛",
    diagnosticCriteria: "主要诊断依据：①Rome IV标准（近3个月反复腹痛伴排便后改善，发作频率≥1天/周，症状起始≥6个月）；②排除报警症状（体重下降、便血、夜间腹泻、进行性腹痛、50岁以上新发）；③无器质性疾病证据（肠镜/影像阴性）；鉴别诊断：①IBD（需结肠镜+活检排除）；②乳糜泻（tTG-IgA筛查）；③显微镜下结肠炎（老年女性水样腹泻需活检）；④胆汁酸腹泻（SeHCAT扫描或试验性考来烯胺）；⑤内分泌疾病（甲亢、Addison病）",
    patientCriteria: "适合FMT：经充分检查排除器质性疾病的高度选择性IBS患者；IBS-D亚型且菌群异常证据明确；保守治疗（饮食调整、益生菌、解痉药）3个月无效；不适合FMT：IBS-C为主型（菌群干预对其疗效更差）；有报警症状（体重下降、便血）未除外器质病；严重精神心理共病（需先稳定精神症状）；妊娠期；免疫抑制状态（感染风险）；目前多项RCT不支持常规FMT用于IBS",
    diseaseProgression: "IBS为慢性功能性肠病，不治疗：症状可持续存在，波动性加重，但不会导致器质性损害、肠癌或死亡；FMT治疗：现有RCT证据不一致，Halkjær 2018等多项研究显示FMT不优于安慰剂，长期益处不明确；即使部分患者短期改善，6-12个月随访大多复发；IBS整体预后与精神心理因素、生活方式密切相关，菌群干预仅适用于高度选择的患者",
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
    clinicalFeatures: "主要症状：慢性腹痛（多为右下腹或脐周，餐后加重）、慢性腹泻（可含黏液但血便少见）、体重下降、食欲减退、疲劳感；肛周病变（肛周脓肿、瘘管、皮肤溃疡）为CD特征性表现；体征：腹部肿块（右髂窝），肛周检查发现瘘管/皮赘，杵状指（慢性营养不良），口腔溃疡（鹅口疮样）；实验室：CRP/ESR升高（活动性炎症标志），粪钙卫蛋白（FC）升高，白蛋白下降（慢性蛋白丢失），维生素B12/铁缺乏（回肠受累/吸收不良）；影像/内镜：结肠镜示节段性、跳跃式黏膜炎症，阿弗他溃疡或纵行溃疡，病理见非干酪样肉芽肿；小肠CT/MRI示肠壁增厚、强化、梳征（梳状血管增粗）",
    epidemiology: "西方国家CD发病率约5-15/10万，患病率100-200/10万；中国CD发病率约0.5-2/10万，呈明显上升趋势（与西方化生活方式相关）；发病高峰15-30岁，男女比例接近1:1；高危因素：吸烟（是CD独立危险因素，吸烟者病情更重、术后复发更高）、一级亲属IBD史、NOD2/CARD15基因突变；肛周病变见于约30%CD患者，是重要预后指标",
    diagnosticCriteria: "主要诊断依据：①典型临床表现（慢性腹痛、腹泻、体重下降、肛周病变）；②结肠镜+活检（节段性/跳跃式溃疡、非干酪样肉芽肿）；③小肠影像（CT/MRI示肠壁增厚、系膜改变）；鉴别诊断：①肠结核（回盲部常见，需活检排除，PPD/IGRA阳性）；②UC（连续性病变、直肠受累为主）；③白塞病（口腔溃疡、眼炎、生殖器溃疡）；④淋巴瘤（需影像排除）；⑤药物性肠炎（NSAID相关）",
    patientCriteria: "适合FMT：轻中度活动性CD（CDAI 150-400分）伴肠道菌群失调证据；激素依赖或激素抵抗但尚无需生物制剂的患者；不适合FMT：重度CD（严重营养不良、CDAI>450、重症狭窄/穿透）；中毒性巨结肠；复杂肛瘘（需手术引流优先）；严重肠道狭窄（内镜无法通过）；妊娠期；活动性感染未控制；重症免疫抑制状态",
    diseaseProgression: "CD为慢性透壁性炎症，不治疗：进行性肠道损伤（狭窄、穿透、瘘管形成），约50-70%患者在诊断后10年内需至少一次手术，术后5年复发率约30-50%；FMT治疗后：现有小样本研究显示短期临床应答率约60-70%，但长期无复发生存数据不足；FMT可能作为激素/免疫抑制剂的辅助治疗，尚不能替代常规治疗；需更大样本RCT验证",
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
    clinicalFeatures: "主要运动症状：静止性震颤（4-6Hz，安静时明显、运动时减轻）、肌强直（铅管样或齿轮样）、运动迟缓（写字变小、面具脸、步态拖沓）、姿势不稳（后拉试验阳性）；非运动症状（NMS）：便秘（PD患者中占60-80%，可早于运动症状出现）、嗅觉减退/丧失、快速眼动期睡眠行为障碍（RBD）、焦虑/抑郁、认知功能下降、自主神经功能障碍（体位性低血压、尿频）；体征：面部表情减少、书写障碍（小写症）、前屈姿势、慌张步态",
    epidemiology: "全球PD患病率约1-2%，60岁以上人群患病率约1%，80岁以上升至2-4%；中国PD患者约300万（全球最多），每年新增约10万例；发病高峰55-65岁，男性略多于女性（1.5:1）；高危因素：年龄（最大风险因素）、家族史、农药/除草剂暴露（草甘膦等）、农村居住史、饮井水；便秘在PD患者中极为常见（肠-脑轴紊乱证据）",
    diagnosticCriteria: "主要诊断依据：①临床表现（运动迟缓+至少一项其他运动症状：静止性震颤或肌强直）；②UK脑库诊断标准或MDS诊断标准；③排除其他原因（血管性帕金森综合征、多系统萎缩、进行性核上性麻痹、药物性等）；鉴别诊断：①继发性帕金森综合征（药物性：氟哌啶醇、胃复安；血管性：多发腔隙性脑梗死）；②帕金森叠加综合征（多系统萎缩MSA、进行性核上性麻痹PSP）；③特发性震颤（无运动迟缓和肌强直）",
    patientCriteria: "适合FMT：临床确诊PD（Hoehn-Yahr 1-3期，运动症状明显但尚能行走）；合并便秘（NMS之一，肠道菌群失调证据）；非运动症状突出（睡眠障碍、焦虑抑郁）；不适合FMT：Hoehn-Yahr 4-5期（卧床/轮椅依赖）；严重认知障碍（MMSE<18，痴呆晚期）；严重吞咽困难（无法配合结肠镜前肠道准备）；血流动力学不稳定；消化道肿瘤或活动性消化道感染；预期寿命<12个月",
    diseaseProgression: "PD不治疗：进行性运动功能恶化，约5-7年后需辅助行走，10-15年后卧床；非运动症状（便秘、认知障碍、睡眠障碍）随病程加重，最终约80%患者合并痴呆；FMT治疗后：Wang 2025 RCT显示12周MDS-UPDRS运动评分改善8.80分，非运动症状改善35.60分；停药后效果持续性尚不明确，需更长随访（>1年）验证长期获益",
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
    clinicalFeatures: "主要症状：极度乏力（显著影响日常活动）、厌食/恶心、右上腹胀痛、黄疸（皮肤/巩膜黄染，尿色加深如茶色）、腹胀（腹水所致）、意识障碍（肝性脑病，表现为嗜睡、烦躁、定向力障碍、昏迷）；体征：肝病面容（晦暗、无光泽）、肝掌、蜘蛛痣、黄疸、腹水征（移动性浊音阳性）、双下肢水肿、肝浊音界缩小（提示肝萎缩）；实验室：转氨酶急剧升高（ALT/AST可达1000-5000 U/L），胆红素显著升高（总胆>171μmol/L），凝血功能严重障碍（INR≥1.5，PTA≤40%），肌酐升高（AKI），血氨升高（HE指标）；影像：腹部超声/CT示肝脏缩小、脾大、腹水、胆囊壁增厚（\"双层征\"）",
    epidemiology: "中国HBV感染者约7000万（HBV携带者约2000万），肝衰竭年发生率约0.5-1%；HBV-ACLF占所有ACLF病例的50-70%，是中国肝衰竭主要类型；高危人群：HBsAg阳性且HBV DNA高载量者（>10⁴-10⁵ IU/ml）、未抗病毒治疗或依从性差的慢乙肝患者、饮酒合并HBV者；HBV-ACLF 28天病死率约30-50%，肝移植是唯一确定有效治疗",
    diagnosticCriteria: "主要诊断依据：①HBsAg阳性或HBV DNA阳性慢乙肝基础；②黄疸（总胆红素≥171μmol/L）+凝血障碍（INR≥1.5或PTA≤40%）；③4周内出现腹水和/或肝性脑病；④伴随器官功能障碍（肝、肾、脑、肺、凝血、循环）；鉴别诊断：①急性戊型肝炎相关急性肝衰竭（HAV/HEV重叠）；②药物性肝损伤（对乙酰氨基酚等）；③酒精性肝衰竭（需HBsAg阴性）；④自身免疫性肝炎急性发作；⑤肝豆状核变性（年轻患者，K-F环）",
    patientCriteria: "适合FMT：HBV-ACLF早中期（肝性脑病1-2级，血流动力学相对稳定）；无肝移植绝对指征（尚未出现不可逆性多器官衰竭）；年龄18-65岁；不适合FMT：肝性脑病3-4级（昏迷/半昏迷状态）；血流动力学不稳定（需大剂量血管活性药物）；严重凝血障碍（INR>3.0，活动性出血）；AKI需要肾脏替代治疗；胆红素>500μmol/L且持续上升；严重感染未控制；肝移植等待名单患者（优先移植）",
    diseaseProgression: "HBV-ACLF不治疗：28天病死率30-50%，3个月病死率50-70%；主要死因：肝性脑病加重（脑水肿、脑疝）、感染性休克、多器官功能衰竭；FMT治疗后：现有队列研究显示28天生存率提升至60-75%，肠道菌群改善与肝功能改善相关；FMT不能逆转已发生的肝坏死，主要作用机制为减轻内毒素血症和全身炎症反应；长期预后仍取决于肝再生能力，部分患者需桥接至肝移植",
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
    clinicalFeatures: "ASD核心症状：社会交往障碍（目光回避、呼名不应、缺乏共同注意）、语言发育迟缓或倒退（词汇量减少、无双向语言）、刻板行为（重复动作、坚持同一性、强烈依恋特定物品）；胃肠道症状（ASD合并率60-80%）：便秘（最常见，约50%）、腹泻（25-30%）、腹胀/腹痛（行为异常如哭闹、拍打腹部）、食物不耐受（对特定食物强烈拒绝）；行为问题：多动、攻击性行为、自伤、睡眠障碍（入睡困难、夜醒）；体征：无特异性体征，可能有营养缺乏体征（缺铁性贫血貌、维生素D缺乏体征）；实验室：胃肠道症状评估GSRS量表；ASD行为评估GARS-2、ADOS、CARS2；粪钙卫蛋白（排除IBD）",
    epidemiology: "全球ASD患病率约1%（每100人1例），美国约1/36儿童（CDC 2023），中国约0.7%（约1000万ASD患者）；男女比例约4:1（男孩为主）；高危因素：遗传因素（同胞患病风险增加10-20倍）、高龄父母、早产（<35周）、孕期感染/用药、肠道菌群异常（ASD儿童肠道菌群多样性降低，厚壁菌/拟杆菌比例异常）；约40-70%ASD儿童存在胃肠道问题，显著高于正常发育儿童（20-25%）",
    diagnosticCriteria: "主要诊断依据：①DSM-5孤独症谱系障碍诊断标准（社会交往障碍+限制性/重复性行为/兴趣，持续影响社会功能）；②ADOS-2（孤独症诊断观察量表）或CARS2评分；③发育史（语言/社交里程碑倒退）；胃肠道评估：罗马IV功能性胃肠病标准（功能性便秘、腹泻、消化不良）；鉴别诊断：①全面发育迟缓（非社交障碍为主）；②语言障碍（无社交障碍）；③Rett综合征（女孩，退行性）；④儿童期精神分裂症（通常青少年期后发病）",
    patientCriteria: "适合FMT：符合DSM-5 ASD诊断；合并显著胃肠道症状（GSRS评分升高）；年龄3-17岁（主要研究人群）；传统行为/语言干预效果有限；不适合FMT：重度ASD伴严重自伤行为（需先行为管理）；免疫缺陷状态；活动性感染（胃肠道感染未控制）；严重食物过敏/特应性反应史；近期（3个月内）使用抗菌药物（可能影响FMT效果）；目前FMT用于ASD仍为研究性，不作为常规推荐",
    diseaseProgression: "ASD为神经发育障碍，不治疗：社交和语言功能持续受损，约30-40%ASD儿童成年后需要生活支持，极少数可独立生活；胃肠道问题若不干预，可加重行为问题（疼痛相关烦躁、失眠）；FMT治疗后：Kang 2017显示行为评分（GARS-2）改善47%，胃肠道症状（GSRS）下降59%，2年随访持续有效；但Kang研究无对照组，证据级别低，后续研究未能一致复制；目前认为FMT主要改善ASD伴胃肠道症状，而非核心ASD症状",
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
    clinicalFeatures: "主要症状：肥胖（腹型肥胖，腰围男性>90cm、女性>85cm），多饮多尿（血糖升高），头晕/头胀（高血压表现），乏力（代谢紊乱）；体征：中心性肥胖（腰臀比↑），黑棘皮征（皮肤皱褶处黑褐色天鹅绒样变，胰岛素抵抗体征），高血压（>130/85mmHg），脂肪肝体征（肝大）；实验室：空腹血糖≥5.6mmol/L或糖耐量异常或已确诊T2DM；TG≥1.7mmol/L；HDL<1.0mmol/L（男）或<1.3mmol/L（女）；血压≥130/85mmHg；满足≥3项即诊断代谢综合征；胰岛素敏感性评估：HOMA-IR（胰岛素抵抗指数）升高；尿酸升高（常伴高尿酸血症）",
    epidemiology: "全球代谢综合征患病率约25-30%（成人），中国约20-25%（约2.5亿人）；随年龄增加（60岁以上可达40-50%）；男性患病率略高于女性；高危人群：超重/肥胖（BMI>25）、久坐生活方式、高热量饮食（西式饮食）、一级亲属T2DM/心血管病家族史；中国人腹型肥胖标准低于西方（腰围切点男性90cm/女性85cm）；代谢综合征患者心血管疾病风险增加2倍，T2DM风险增加5倍",
    diagnosticCriteria: "主要诊断依据：①代谢综合征诊断（符合≥3项：腹型肥胖、高血糖、高TG、低HDL、高血压）；②腰围（中国人标准：男≥90cm/女≥85cm）+血糖/血脂/血压异常；③HOMA-IR评估胰岛素抵抗；鉴别诊断：①库欣综合征（满月脸、紫纹、毛发增多）；②甲状腺功能减退（甲减可类似代谢综合征表现）；③多囊卵巢综合征（PCOS，女性高雄激素+代谢异常）；④肢端肥大症（软组织肥厚、关节疼痛）",
    patientCriteria: "适合FMT：代谢综合征患者（满足诊断标准≥3项）；T2DM病程<10年且血糖控制欠佳（HbA1c 7-10%）；肥胖（BMI 28-40，无严重并发症）；不适合FMT：BMI>40的重度肥胖（减重手术优先）；已确诊心血管疾病（心梗/脑梗病史<6个月）；严重肝肾功能不全（eGFR<30）；已知FMT供体病原学阳性；炎症性肠病活动期；自身免疫性疾病急性期",
    diseaseProgression: "代谢综合征不治疗：约10-20%/年进展为T2DM，20-30%在10年内发生心血管事件（心梗、脑卒中），脂肪肝逐步进展为NASH/肝纤维化；T2DM患者微血管并发症（视网膜病变、肾病、神经病变）风险显著增加；FMT治疗后：Vrieze 2012 RCT显示供体FMT后12周胰岛素敏感性提升约70%，HbA1c改善，但效果在自体FMT中弱于供体FMT；Hartstra 2015长期随访显示代谢获益可持续；FMT不能替代生活方式干预（运动+饮食），仅作为代谢综合征综合管理的补充",
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
    clinicalFeatures: "抗菌药物使用后肠道菌群紊乱表现：腹泻（AAD，发生率5-25%）、腹胀、腹痛、排便习惯改变（便秘或腹泻）；高危信号：广谱抗菌药物使用史（氟喹诺酮、克林霉素、头孢菌素）后出现胃肠道症状；长期住院患者（>7天）肠道菌群多样性显著下降；免疫抑制患者菌群紊乱风险更高；Suez 2018研究显示抗菌药物后菌群恢复时间可达6个月，期间FMT可加速恢复",
    epidemiology: "住院患者抗菌药物使用率约30-50%（全球）；广谱抗菌药物使用后肠道菌群多样性下降可达80%，恢复时间3-6个月；抗菌药物相关腹泻（AAD）发生率5-25%，其中CDI占10-20%；高危人群：老年患者（>65岁）、长期住院、免疫抑制、既往CDI史、联合抗菌药物使用；中国抗菌药物使用强度（DDD）高于WHO建议水平，CDI发病率持续上升",
    diagnosticCriteria: "抗菌药物相关菌群紊乱诊断：①近期抗菌药物使用史（4-8周内）；②胃肠道症状（腹泻≥3次/天或大便不成形）；③排除其他原因（感染性肠炎、IBD）；④可选：粪便菌群检测（16S rRNA测序，显示多样性下降、特定菌门减少）；CDI诊断：符合CDI诊断标准（大便毒素阳性+临床症状）",
    patientCriteria: "适合FMT：抗菌药物疗程结束后高危人群（老年+住院+广谱抗菌药物）；抗菌药物后AAD预防（降低CDI风险）；不适合FMT：抗菌药物疗程中或结束后<24小时（抗生素残留可能破坏FMT）；活动性感染（血流感染、肺炎等）；严重免疫抑制（中性粒细胞<500/μL）；已知FMT供体病原学阳性；肠道黏膜损伤未愈（近期肠手术/放疗）",
    diseaseProgression: "抗菌药物后菌群不干预：菌群恢复需3-6个月，期间感染风险（CDI、AAD、侵袭性真菌感染）显著升高；老年住院患者CDI风险增加5-10倍；反复抗菌药物使用可导致慢性菌群失调和代谢异常；FMT后：Suez 2018研究显示FMT在抗菌药物结束后1天给药，可使肠道菌群在1周内恢复正常，显著快于自然恢复（3-6个月）；FMT重建的菌群可在体内稳定存在>3个月；长期菌群稳态恢复有助于减少后续抗菌药物暴露的感染风险",
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
    clinicalFeatures: "主要症状：腹泻（水样便为主，可为血性便，每天≥3次），腹痛（多为中下腹痉挛性疼痛），发热（37.5-39°C）；体征：腹部压痛（多为全腹或左下腹），肠鸣音活跃，严重者有腹胀、脱水体征；实验室：大便艰难梭菌毒素EIA阳性或PCR毒素基因阳性，白细胞升高（轻症10-15×10⁹/L，重症可>30×10⁹/L），肌酐升高（反映疾病严重程度）；影像：部分患者腹部CT可见结肠壁增厚、\"手风琴征\"（结肠皱襞增厚）、肠周脂肪间隙模糊",
    epidemiology: "初发型CDI年发病率约0.5-1%（住院患者可达1-5%），美国每年约45万例；高危人群：老年人（>65岁）、近期抗菌药物使用史、住院患者、免疫抑制者；中国抗菌药物使用量大，CDI发病率逐年上升，且年轻人群发病有增加趋势",
    diagnosticCriteria: "主要诊断依据：①大便检测阳性（GDH筛查+毒素EIA确证，或PCR法）；②临床症状（腹泻≥3次/天或大便不成形）；③排除其他腹泻原因；鉴别诊断：①抗菌药物相关非CDI腹泻；②病毒性肠炎（诺如病毒、轮状病毒）；③细菌性肠炎（沙门氏菌、弯曲杆菌）；④IBD发作；⑤食物过敏或不耐受",
    patientCriteria: "适合FMT：初发型CDI经标准万古霉素/非达霉素治疗≥72小时仍无效（持续腹泻或症状加重）；重症/暴发性CDI（白细胞>15×10⁹/L伴器官功能损害）；不适合FMT：轻度初发型CDI（一线抗生素有效者不首选FMT）；血流动力学不稳定；严重凝血障碍（INR>1.5，血小板<50×10⁹/L）；中毒性巨结肠或肠穿孔；免疫极度低下（需个体化评估）",
    diseaseProgression: "初发型CDI不治疗/不充分治疗：可能进展为暴发性结肠炎（高热、血便、腹胀），约5-10%转为rCDI；重症可并发中毒性巨结肠、肠穿孔、脓毒症；FMT治疗后：治愈率60-80%，部分患者需1-2次FMT；复发率约10-15%，高于rCDI（FMT定植菌群需时间稳定）",
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
    clinicalFeatures: "FMT为预防性干预，适用于接受广谱抗菌药物的高危人群尚无CDI表现；高危信号：老年患者（>65岁）、住院患者、既往CDI史、免疫抑制状态、严重基础疾病、长期住院（>7天）、质子泵抑制剂使用、化疗患者；无特异性临床特征，主要依据危险因素分层",
    epidemiology: "住院患者抗菌药物相关腹泻（AAD）发生率约5-25%，其中CDI占10-20%；高危人群（老年+住院+广谱抗生素）CDI发生率可达2-10%；美国每年约50万例CDI中约20-30%与预防性抗菌药物使用相关；中国住院患者抗菌药物使用强度高，CDI防控形势严峻",
    diagnosticCriteria: "FMT预防：无需CDI诊断，重点评估CDI风险分层；风险评估指标：①年龄>65岁；②既往CDI史；③住院时间≥7天；④免疫抑制（化疗、激素>10mg/d泼尼松等效）；⑤广谱抗菌药物（氟喹诺酮类、克林霉素、头孢菌素类）；⑥PPI使用；⑦严重基础病；高危人群≥3项即推荐FMT预防",
    patientCriteria: "适合FMT预防：年龄≥65岁+住院≥7天+使用高危抗生素（氟喹诺酮/克林霉素/头孢菌素）；既往CDI史需完成抗生素疗程后；免疫抑制者（低风险移植受者）；不适合FMT预防：免疫严重缺陷（中性粒细胞<500/μL、重度移植物抗宿主病）；活动性感染未控制；已知FMT供体病原学阳性；近期肠道手术史",
    diseaseProgression: "高危人群不预防：CDI发病率可达2-10%/疗程，尤其是老年住院患者首次感染后复发率高达20-30%，形成反复发作循环；FMT预防后：DEFINE研究显示CDI发病率降低约50-70%；预防效果与抗生素疗程结束后给药时机密切相关（建议抗生素结束后24-72h内）；长期保护效果尚需更多随访数据",
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
    clinicalFeatures: "主要症状：NAFLD/NASH大多无明显症状（隐匿起病），部分患者有右上腹隐痛或胀满感、乏力、疲劳感，通常在体检或因其他原因查肝功能时发现；体征：肥胖体型（BMI 25-35）、肝大（肋下可触及，无压痛）、皮肤黑棘皮征（胰岛素抵抗体征）、晚期出现肝硬化体征（黄疸、腹水、脾大、蜘蛛痣）；实验室：ALT/AST轻-中度升高（通常ALT>AST，ALT 40-100 U/L，如AST>ALT提示纤维化可能），GGT升高，血糖↑/HbA1c↑（伴糖尿病者），血脂异常（TG↑、HDL↓），FibroTest/APRI/FIB-4无创纤维化评估；影像：肝脏超声（首选筛查，脂肪肝特征性回声增强），FibroScan（CAP值测脂肪变、LSM值测纤维化），MRI-PDFF（精确脂肪定量）",
    epidemiology: "全球NAFLD患病率约25%（成人），是最常见慢性肝病；NASH患病率约1.5-6%；中国NAFLD患病率约15-20%（约2亿人口），呈快速增长趋势；高危人群：超重/肥胖（BMI>25）、2型糖尿病（40-50%合并NAFLD）、代谢综合征患者、高脂血症患者；NAFLD/NASH相关肝硬化预计2030年将成为肝移植首要指征；儿童肥胖增加使青少年NAFLD患病率达5-10%",
    diagnosticCriteria: "主要诊断依据：①代谢综合征诊断（符合以下≥3项：腹型肥胖、高血糖、高血压、高TG、低HDL）；②影像学脂肪肝（超声、CT或MRI）；③排除继发因素（大量饮酒>20g/d女性、>30g/d男性，药物如胺碘酮、甲氨蝶呤、他莫昔芬）；NASH诊断需肝活检（气球样变+小叶炎症+纤维化评分）；鉴别诊断：①酒精性肝病（饮酒史）；②慢性乙型/丙型肝炎（HBV/HCV血清学）；③自身免疫性肝炎（ANA、AMA阳性）；④血色病（铁蛋白、转铁蛋白饱和度）；⑤药物性肝损伤",
    patientCriteria: "适合FMT：经肝活检或MRI-PDFF确诊的NASH患者（中重度肝脏脂肪变）；纤维化F0-F2期（早中期纤维化）；代谢综合征控制不佳；不适合FMT：失代偿期肝硬化（黄疸、腹水、肝性脑病）；门静脉高压伴静脉曲张出血风险；严重心血管疾病；已知FMT供体病原学阳性；严重营养不良（BMI<18.5）；凝血功能严重障碍（INR>1.5）",
    diseaseProgression: "NAFLD不治疗：约20-30%从单纯脂肪变（NAFL）进展为NASH，其中15-20%进展为肝纤维化F3-F4，约1-4%/年从肝硬化进展为HCC；心血管疾病是NAFLD/NASH患者首位死因（50%），其次为肝病相关死亡（30%，含HCC）；FMT治疗后：现有小样本RCT显示MRI-PDFF降低20-30%，ALT和胰岛素敏感性改善，但停药后效果持续性有限；需配合减重（≥7%体重下降可逆转NASH）和代谢控制；长期预后改善取决于代谢综合征整体管理",
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
    clinicalFeatures: "主要症状：反复发作性腹痛（每周≥1天发作）伴急迫性腹泻，大便松散或水样（Bristol 6-7型），排便后腹痛通常缓解，24小时内排便≥3次；部分患者有腹胀、黏液便、排便不尽感；体征：无器质性体征，腹部触诊可有广泛压痛（肠壁敏感性增加），肠鸣音活跃；实验室：血常规正常（大便常规正常，无白细胞/红细胞），甲状腺功能正常，排除寄生虫感染（粪便虫卵和寄生虫检测阴性）；排除感染性腹泻和炎症性肠病；内镜和影像检查无异常",
    epidemiology: "IBS-D是IBS最常见亚型（约占IBS总数40%）；全球IBS-D患病率约4-5%（成人），女性患病率是男性1.5-2倍；中国IBS-D患病率约3-5%；发病高峰25-45岁；高危因素：肠感染后（感染后IBS，约10-30%急性肠炎患者发展为PI-IBS）、精神心理障碍（焦虑、抑郁、创伤后应激障碍）、肠道高敏感性、肠道菌群失调；IBS-D患者常合并纤维肌痛、慢性头痛、间质性膀胱炎等共病",
    diagnosticCriteria: "主要诊断依据：①Rome IV标准（近3个月反复腹痛伴排便后改善，发作频率≥1天/周，症状起始≥6个月，≥25%排便为松散/水样便）；②排除报警症状（便血、体重下降>5kg、夜间腹泻、进行性腹痛、50岁以上新发症状、结直肠癌家族史）；③排除感染/IBD/乳糜泻等器质性疾病；鉴别诊断：①显微镜下结肠炎（老年女性水样腹泻，需活检确诊）；②胆汁酸腹泻（SeHCAT扫描或试验性考来烯胺治疗有效）；③乳糜泻（tTG-IgA阳性）；④嗜酸粒细胞性胃肠炎；⑤甲状腺功能亢进",
    patientCriteria: "适合FMT：经充分检查排除器质性疾病的高度选择性IBS-D患者；Rome IV确诊IBS-D；保守治疗（低FODMAP饮食、止泻药、解痉药）3个月无效；心理共病稳定（焦虑/抑郁量表评分≤中度）；不适合FMT：有报警症状未完全评估；严重精神心理疾病（未稳定的抑郁症/焦虑症）；妊娠或哺乳期；免疫抑制状态（化疗/长期激素）；目前多项RCT证据不一致（Holvoet 2022阳性，Lahtinen 2023阴性），不支持常规FMT用于IBS-D",
    diseaseProgression: "IBS-D为慢性功能性肠病，不治疗：症状可持续存在并波动性加重，约30-50%患者症状可自行改善或加重，呈慢性复发性过程；IBS-D不增加死亡风险或癌变风险，但显著影响生活质量和工作效率；FMT治疗后：2022年Holvoet研究显示FMT组IBS-SSS评分改善，但2023年Lahtinen大型RCT（n=186）未达主要终点；总体证据不支持FMT常规治疗IBS-D；即使短期改善，6-12个月随访大多复发；安慰剂效应在IBS研究中高达30-50%，是解读FMT研究的重要背景",
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
    clinicalFeatures: "MDRO定植通常无临床症状，仅为肠道携带状态；常见定植部位：肠道（粪便中检出）、鼻咽部（MRSA）、皮肤（MRSA）、尿道（ESBL大肠杆菌）；高危人群定植率：长期住院患者（30-50%）、免疫缺陷患者（20-40%）、长期抗菌药物使用患者（40-60%）、血液透析患者（20-30%）；CRE定植：住院史+近期抗菌药物使用+免疫抑制，CRE粪便携带可持续数月",
    epidemiology: "全球MDRO定植率持续上升，ESBL肠杆菌定植率约10-40%（医院内），MRSA定植率约1-2%（社区）-20-30%（医院内）；CRE定植率近年快速上升（全球>50个国家已有CRE流行）；MDRO定植是后续侵袭性感染的重要预测因素（约30-50%定植患者会发生感染）；中国MDRO（CRE、MRSA、VRE）检出率居全球前列，临床需求迫切",
    diagnosticCriteria: "MDRO定植诊断：①粪便/直肠拭子培养或PCR检测阳性（ESBL、CRE、CRAB等）；②鼻拭子培养阳性（MRSA）；③尿培养阳性（ESBL大肠杆菌，无症状性菌尿）；定植≠感染：若无临床症状，仅需监测，不常规抗菌治疗；清除判定：FMT后连续2-3次（间隔≥1周）MDRO培养阴性",
    patientCriteria: "适合FMT：MDRO肠源性定植（粪便/直肠拭子阳性）；免疫缺陷患者（血液肿瘤、器官移植、长期激素）需优先清除；长期住院患者（计划进行侵入性操作/手术）；不适合FMT：活动性MDRO感染（血流感染、肺炎）需先抗菌治疗；严重免疫缺陷（中性粒细胞<500/μL、严重GVHD）；严重肠道疾病（活动性IBD、肠穿孔风险）；血流动力学不稳定；已知FMT供体MDRO阳性",
    diseaseProgression: "MDRO定植不干预：定植状态可持续数月（ESBL 2-6个月，CRE 6-12个月），期间侵袭性感染风险持续存在（30-50%发生感染）；CRE定植患者一旦发生血流感染，病死率高达40-60%；长期定植限制免疫抑制治疗（移植、化疗）的开展；FMT后：清除率37-80%（Lancet Infect Dis 2019 Bhat研究，n=20），CRE清除率约40-60%；清除效果与菌群多样性恢复程度正相关；部分患者可复发（10-20%），需再次FMT；FMT清除MDRO的理论风险包括转移耐药基因（通过可移动遗传元件），但现有研究未观察到",
    contraindications: "活动性感染\n严重免疫缺陷\n肠黏膜屏障严重受损",
    warnings: "⚠️ 为研究性应用；FMT清除MDRO的理论风险是转移耐药基因而非清除，需充分知情",
  },
  {
    id: "Oncology-FMT",
    name: "FMT联合肿瘤免疫治疗（实体瘤）",
    nameEn: "FMT as Adjunct to Cancer Immunotherapy (Solid Tumors)",
    category: "肿瘤与免疫",
    evidenceGrade: "Oxford 2a · GRADE B",
    gradeLabel: "B级",
    gradeColor: "bg-blue-100 text-blue-700",
    efficacy: "FMT联合ICI一线治疗显著提升实体瘤应答率：NSCLC（Nature Medicine FMT-LUMINate，ORR 80%，1年OS 100%，NCT04951583）；黑色素瘤（ORR 75%，CR 4例/20，1年OS 79%）；转移性肾癌（TACITO，中位PFS 24个月 vs 9个月，HR 0.50，P=0.035）。总体而言，FMT辅助ICI治疗ORR和DCR均显著优于单药ICI（BMC Cancer 2026 Meta分析n=2906）。",
    routes: "口服胶囊 / 结肠镜",
    summary: "肠道菌群与肿瘤免疫应答密切相关。FMT通过重建有益菌群，可显著增强免疫检查点抑制剂（ICI）疗效。目前已验证FMT+ICI一线联合治疗对NSCLC（PD-L1高表达）、黑色素瘤和转移性肾细胞癌疗效突出，ORR大幅提升，安全耐受性良好。Nature Medicine 2026年1月同期上线3项重大临床研究（PMC13099432）。",
    administrationRoute: "口服胶囊\n结肠镜\n鼻胃管",
    dosage: "FMT 30-50g/次 + 标准ICI剂量（每2-3周）",
    frequency: "ICI治疗周期同步，每2-4周FMT一次",
    protocolNote: "Phase 2研究方案：FMT先行（ICI前1周），后续每2个ICI周期补充FMT一次",
    sources: [
      // 2026-05-04 更新：M-DQA Generator+Evaluator 双轮 QA，Evaluator纠正三项研究均为一线初治
      // Generator: AI subagent | Evaluator: AI subagent | 来源：Nature Medicine 2026 DOI验证
      { type: 'NCT', label: 'NCT04951583 · FMT-LUMINate (Nature Medicine NSCLC + 黑色素瘤)', url: 'https://clinicaltrials.gov/ct2/show/NCT04951583' },
      { type: 'NCT', label: 'NCT04758507 · TACITO (Nature Medicine 转移性肾癌)', url: 'https://clinicaltrials.gov/ct2/show/NCT04758507' },
      { type: 'DOI', label: 'DOI: 10.1038/s41591-025-04186-5 · Nature Medicine 2026 FMT-LUMINate', url: 'https://pubmed.ncbi.nlm.nih.gov/PMC13099432/' },
      { type: 'DOI', label: 'DOI: 10.1038/s41591-025-04189-2 · Nature Medicine 2026 TACITO', url: 'https://pubmed.ncbi.nlm.nih.gov/41606121/' },
      { type: 'PMID', label: 'PMID 40484955 · BMC Cancer 2026 Meta分析 (n=2906)', url: 'https://pubmed.ncbi.nlm.nih.gov/40484955/' },
    ],
    keyRef: "Nature Medicine 2026 FMT-LUMINate（NSCLC ORR 80%，1年OS 100%；黑色素瘤 CR 4例）；TACITO（mRCC 中位PFS 24个月 vs 9个月，HR 0.50）；BMC Cancer 2026 Meta分析（n=2906）",
    clinicalFeatures: "主要症状：实体瘤患者接受ICI（PD-1/PD-L1/CTLA-4抑制剂）后可能发生免疫相关不良反应（irAE）：免疫性结肠炎（腹泻、血便、腹痛）、免疫性肝炎（黄疸、肝酶升高）、免疫性肺炎（咳嗽、呼吸困难）、免疫性皮疹（斑丘疹、瘙痒）；部分患者原发肿瘤症状（咳嗽、咯血、体重下降、疼痛）；体征：肿瘤患者体征多样，取决于肿瘤部位和分期；irAE体征：皮疹、黏膜溃疡、黄疸、呼吸音改变；实验室：肿瘤标志物（CEA、NSE、CYFRA21-1等）、肝肾功能（免疫性肝炎监测ALT/AST）、甲状腺功能（免疫性甲状腺炎监测TSH/FT4）；影像：CT/PET-CT评估肿瘤应答（RECIST 1.1标准）",
    epidemiology: "全球实体瘤新发病例每年约1900万（中国约450万）；ICI已成为多种实体瘤一线标准治疗（NSCLC、黑色素瘤、肾癌、膀胱癌等）；irAE发生率约20-40%（任意级别），3-4级irAE约10-15%；菌群失调与ICI疗效及irAE发生率密切相关：抗生素使用后（<2个月）接受ICI的患者生存期显著缩短（HR约1.5-2.0）；肠道菌群多样性高的患者ICI应答率提升2-3倍；中国肿瘤患者抗生素使用率高（>50%在ICI前90天内使用），FMT干预潜力大",
    diagnosticCriteria: "主要诊断依据：①组织病理学确诊实体瘤（肺癌、黑色素瘤、肾癌等）；②ICI治疗史（PD-1/PD-L1/CTLA-4抑制剂）；③ICI耐药/难治（影像学进展或原发耐药）或一线初治（联合FMT增强ICI）；④irAE诊断标准（CTCAE 5.0分级）；菌群检测可选：16S rRNA或宏基因组测序；鉴别诊断：①肿瘤进展（RECIST标准评估）；②感染性结肠炎（粪便病原学检测）；③其他药物性肝损伤；④放射性肺炎（放疗史）",
    patientCriteria: "适合FMT：ICI一线联合（FMT+ICI初治晚期NSCLC、黑色素瘤、肾癌）；ICI耐药/难治实体瘤；irAE患者（免疫性结肠炎/肝炎，激素效果不佳）；不适合FMT：活动性自身免疫病（自身免疫性肝炎、狼疮性肾炎等）；严重免疫缺陷（长期大剂量激素、CAR-T治疗后）；活动性感染（血流感染未控制）；肠道严重损伤（消化道穿孔、肠梗阻）；预期寿命<3个月；妊娠期",
    diseaseProgression: "晚期实体瘤ICI不治疗：预后差，中位OS通常仅3-6个月；ICI一线治疗有效率因瘤种而异（NSCLC单药ORR约20-35%，黑色素瘤约35-50%，肾癌约30-40%）；FMT联合ICI后：NSCLC ORR提升至80%（FMT-LUMINate），黑色素瘤ORR 75%+CR 4例，TACITO mRCC中位PFS从9个月延长至24个月（HR 0.50）；长期生存数据仍在积累中",
    contraindications: "活动性自身免疫病\n严重免疫缺陷\n肠道严重损伤\n妊娠",
    warnings: "⚠️ 肿瘤FMT须在临床试验框架内开展；供体筛查须排除肠道病原体及肿瘤相关感染风险；FMT与ICI联用的长期安全性数据仍有限；注：FMT-LUMINate黑色素瘤队列≥3级irAE发生率65%（13/20），联合治疗需充分评估获益风险比",
  },
  // ══════════════════════════════════════════════════════════════════
  // 新增适应证 16（2026-04-27，M-DQA Generator+Evaluator 双轮 QA）
  // Generator: medical subagent | Evaluator: self-review | PMID: 已验证
  // ══════════════════════════════════════════════════════════════════
  {
    id: "hepatic-encephalopathy",
    name: "肝性脑病",
    nameEn: "Hepatic Encephalopathy",
    category: "肝脏疾病",
    evidenceGrade: "Oxford 1a · GRADE B",
    gradeLabel: "B级",
    gradeColor: "bg-orange-100 text-orange-800",
    efficacy: "FMT显著降低HE复发率（THEMATIC 2025：安慰剂组40% vs FMT组9%，OR 0.15，P=0.035）；Bajaj 2017 RCT：FMT组SAE发生率20% vs SOC组80%（P=0.02），认知功能（EncephalApp/PHES）显著改善，住院率显著降低。",
    routes: "胶囊（口服）+ 结肠镜灌肠（直肠）",
    summary: "复发性肝性脑病（HE）是肝硬化患者再入院主因，与肠道菌群失调密切相关。THEMATIC 2025大型双盲RCT（n=60）证实FMT安全性良好，任意FMT组HE复发率（9%）显著低于安慰剂组（40%，OR 0.15）；Bajaj 2017奠基RCT（n=20）显示FMT组认知改善+住院减少。肠-肝-脑轴是核心机制。",
    administrationRoute: "胶囊（口服）+ 结肠镜灌肠（直肠）双途径；Bajaj 2017：抗生素预处理5天后单次FMT灌肠",
    dosage: "THEMATIC 2025：2粒FMT胶囊 + 1次灌肠；Bajaj 2017：单次灌肠（最优供体粪便等价物）",
    frequency: "THEMATIC 2025：基础治疗（乳果糖+利福昔明）上添加FMT，6个月随访；Bajaj 2017：抗生素预处理5天后单次灌肠FMT，5个月随访",
    protocolNote: "抗生素预处理后FMT（5天万古霉素+利福昔明）再进行FMT是Bajaj 2017方案核心；供体筛选须排除HBsAg/HCV/HIV/梅毒及ESBL阳性",
    sources: [
      { type: 'PMID', label: 'PMID 28586116 — Bajaj Hepatology 2017（奠基RCT，n=20，单次FMT灌肠，认知改善+住院减少）', url: 'https://pubmed.ncbi.nlm.nih.gov/28586116/' },
      { type: 'PMID', label: 'PMID 39800192 — Bajaj J Hepatol 2025（THEMATIC大型双盲RCT，n=60，6个月，HE复发率9% vs 40%）', url: 'https://pubmed.ncbi.nlm.nih.gov/39800192/' },
      { type: 'PMID', label: 'PMID 33840331 — Madsen Scand J Gastroenterol 2021（系统综述，8项研究39例，认知改善证据）', url: 'https://pubmed.ncbi.nlm.nih.gov/33840331/' },
      { type: 'PMID', label: 'PMID 35384391 — Bloom Hepatol Commun 2022（开放标签，n=10，多供体胶囊，供体效应分析）', url: 'https://pubmed.ncbi.nlm.nih.gov/35384391/' },
    ],
    keyRef: "PMID 39800192 — Bajaj J Hepatol 2025（THEMATIC大型双盲RCT，HE复发率显著降低）",
    clinicalFeatures: "主要症状：意识改变（从嗜睡到昏迷，呈波动性），认知障碍（注意力不集中、定向力障碍、计算力下降），睡眠障碍（白天嗜睡夜间清醒，倒转睡眠模式），行为异常（欣快、淡漠、易激惹）；体征：扑翼样震颤（asterixis，上肢伸展时出现不自主震颤），锥体束征（Babinski阳性），黄疸、肝掌、蜘蛛痣、腹水等慢性肝病体征；实验室：血氨升高（>40μmol/L，但与HE严重程度相关性有限），血常规示贫血/血小板减少，肝功能示胆红素升高、白蛋白下降，凝血障碍（INR升高），电解质紊乱（低钠、低钾）；神经心理测试：PHES（心理测试组合）、EncephalApp Stroop测试、临界闪烁频率（CFF）检测",
    epidemiology: "肝硬化患者中HE患病率约20-40%（显性HE 10-20%，轻微型HE 30-40%）；复发性HE（≥2次/年）约占肝硬化住院患者的10-15%；主要病因：乙型肝炎相关肝硬化（中国首位原因）、酒精性肝硬化（西方首位原因）、NAFLD/NASH相关肝硬化；轻微型HE（MHE）患病率高达30-50%，严重影响驾驶安全性（事故风险增加3倍）和生活质量；高危因素：消化道出血、感染、便秘、低钾/低钠、利尿剂过量、肾功能不全",
    diagnosticCriteria: "主要诊断依据：①West Haven分级（0-4级，评估精神状态）；②神经心理测试（MHE筛查：PHES、EncephalApp、Stroop test）；③血氨（辅助参考，不单独用于诊断）；鉴别诊断：①代谢性脑病（低血糖、尿毒症性脑病）；②药物中毒（镇静剂、麻醉药残留）；③脑血管意外（急性局灶性神经体征）；④颅内感染（脑膜炎/脑炎）；⑤酒精戒断性脑病（震颤性谵妄）",
    patientCriteria: "适合FMT：复发性HE（≥2次/年，尽管标准治疗：乳果糖+利福昔明）；轻微型HE（MHE，认知功能下降但无明显意识障碍）；不适合FMT：急性/暴发性HE（3-4级昏迷）；血流动力学不稳定；严重心血管疾病；已知FMT供体病原学阳性；严重凝血障碍（INR>2.5，血小板<50×10⁹/L）；肠道穿孔或活动性消化道出血；中毒性巨结肠或暴发性肝衰竭",
    diseaseProgression: "复发性HE不治疗：反复发作，每次发作均加重认知功能（不完全可逆），住院率极高（肝硬化再入院主要原因之一），5年生存率约20-30%；FMT治疗后：THEMATIC 2025 RCT显示HE复发率从40%降至9%（降低约78%），Bajaj 2017显示FMT组SAE显著减少；FMT改善肠道菌群（增加产短链脂肪酸菌），减少氨生成和肠道通透性；长期效果需更长随访，但现有证据显示FMT可作为HE标准治疗的有效补充",
    contraindications: "血流动力学不稳定 / 消化道穿孔 / 活动性消化道大出血 / 中性粒细胞<500/μL且预计持续减少 / FMT供体病原阳性",
    warnings: "⚠️ GI-GvHD患者免疫功能严重低下，FMT须在具备感染防控条件的移植中心开展；供体须排除多重耐药菌（MDRO）；FMT联合JAK抑制剂需谨慎评估感染风险",
  },
  // 说明：MASLD（2024年新术语）与 nafld（id: "nafld"）为不同条目
  // MASLD = 代谢功能障碍驱动的完整疾病谱（MAS→MASH→纤维化）
  // ══════════════════════════════════════════════════════════════════
  {
    id: "MASLD",
    name: "代谢相关脂肪性肝病（MASLD）",
    nameEn: "Metabolic Dysfunction-Associated Steatotic Liver Disease",
    category: "代谢性疾病",
    evidenceGrade: "Oxford 2b · GRADE C",
    gradeLabel: "C级",
    gradeColor: "bg-amber-100 text-amber-800",
    efficacy: "FMT可改善MASLD患者肝脏脂肪含量（PDFF降低约3.5%，ALT降低约6.81 U/L，AST降低约7.13 U/L，He 2026 Meta分析8项RCT）；Ni 2023 RCT（n=198）证实抵抗性淀粉通过肠道菌群介导使IHTC绝对降低9.08%，FMT在动物模型中验证了因果关系。",
    routes: "鼻十二指肠管（首选）/ 胶囊",
    summary: "MASLD（2024年由NAFLD更名）是代谢功能障碍驱动的肝脏脂肪变性统称，包括从单纯脂肪变性（MAS）到代谢相关脂肪性肝炎（MASH）及纤维化的完整疾病谱，诊断标准更强调代谢异常。FMT通过调节肠-肝轴改善肝脏脂肪变性和炎症，现有证据主要来自小型RCT和Meta分析，GRADE C级。",
    administrationRoute: "鼻十二指肠管输注（首选）或胶囊口服",
    dosage: "鼻十二指肠管：30-50g粪便等价物溶于300-500ml生理盐水；胶囊：15-30粒/日，分次服用",
    frequency: "强化诱导：每周1次×4-6周；部分研究加用每月1次维持治疗",
    protocolNote: "MASLD/NAFLD的FMT尚无标准方案；Ni 2023采用抵抗性淀粉膳食干预（每日40g，4个月）间接验证肠-肝轴；MASH（脂肪性肝炎）患者优先考虑鼻肠管途径",
    sources: [
      { type: 'PMID', label: 'PMID 37673036 — Ni Y Cell Metab 2023（抵抗性淀粉RCT，n=198，IHTC降低9.08%，FMT因果验证）', url: 'https://pubmed.ncbi.nlm.nih.gov/37673036/' },
      { type: 'PMID', label: 'PMID 41496048 — He C Medicine 2026（Meta分析8项RCT，ALT↓6.81, AST↓7.13, PDFF↓3.50）', url: 'https://pubmed.ncbi.nlm.nih.gov/41496048/' },
      { type: 'PMID', label: 'PMID 36363516 — Abenavoli L Medicina 2022（NAFLD/MASLD FMT文献综述，安全性良好）', url: 'https://pubmed.ncbi.nlm.nih.gov/36363516/' },
    ],
    keyRef: "PMID 37673036 — Ni Y Cell Metab 2023（抵抗性淀粉RCT，FMT因果验证）；PMID 41496048 — He C Medicine 2026 Meta分析",
    clinicalFeatures: "主要症状：MAS常无症状（仅体检发现肝酶轻度升高或超声示脂肪肝），部分患者有右上腹不适、乏力、食欲减退；MASH（脂肪性肝炎）：肝酶持续升高（ALT>AST为主），乏力加重；体征：肝大（肋下可触及，光滑无压痛），肥胖体型（BMI>25，腰围超标），黑棘皮征（胰岛素抵抗表现），蜘蛛痣（晚期肝硬化）；实验室：肝酶升高（ALT 40-200 U/L，AST/ALT<1提示单纯脂肪变，>1提示MASH），GGT升高；血脂异常（TG↑、HDL↓、LDL↑），空腹血糖↑/HbA1c↑（胰岛素抵抗），铁蛋白升高；影像：肝脏超声（敏感性70-80%，定性诊断脂肪肝），MRI-PDFF（定量肝脏脂肪含量，金标准），FibroScan/CAP（CAP值评估脂肪变程度，LSM评估纤维化）",
    epidemiology: "全球MASLD患病率约25-30%（成人），中国约20-25%（成人），超重/肥胖人群中高达60-70%；NASH患病率全球约1.5-6.5%；高危人群：超重/肥胖（BMI>25）、2型糖尿病（30-40%合并NASH）、代谢综合征（高血糖、高血脂、高血压、高尿酸）、重度肥胖减重手术后；儿童MASLD患病率约3-10%（与儿童肥胖流行相关）；MASLD已成为全球肝移植第三大指征（中国是第二大肝病，仅次于病毒性肝炎）",
    diagnosticCriteria: "主要诊断依据：①代谢异常（≥1项：BMI>25或腰围超标或T2DM或高血压/血脂异常）+肝脏脂肪变≥5%（影像/活检）；②排除酒精性肝病（女性<20g/d，男性<30g/d纯乙醇）、药物性肝炎、病毒性肝炎；MASH诊断需肝活检（肝细胞气球样变+小叶炎症±纤维化）；鉴别诊断：①酒精性脂肪肝（饮酒史≥20/30g/d）；②药物性肝损伤（糖皮质激素、甲氨蝶呤）；③慢性病毒性肝炎（B/C型）；④自身免疫性肝炎；⑤血色病/Wilson病",
    patientCriteria: "适合FMT：经肝活检或MRI-PDFF确诊的MASH/NAFLD患者；肝脏纤维化F1-F2期（尚无肝硬化）；代谢综合征控制欠佳（血糖/血脂未达标）；不适合FMT：失代偿期肝硬化（腹水、黄疸、肝性脑病）；严重心血管疾病（心功能≥3级）；已知FMT供体病原学阳性；严重凝血障碍（INR>2.0）；肠道狭窄或穿孔风险；BMI>40的重度肥胖（需先减重手术）",
    diseaseProgression: "MAS不治疗：约20-30%进展为MASH，其中15-25%在10-20年内进展为肝纤维化F3-F4（肝硬化），肝硬化后每年约1-4%发生肝细胞癌（HCC）；代谢综合征患者死亡风险增加约1.5-2倍，主要死因依次为心血管疾病（50%）、肝病（15%）、肝外恶性肿瘤；FMT治疗后：Meta分析显示FMT可降低肝脏脂肪含量（PDFF↓约3.5%）、ALT↓约7 U/L、AST↓约7 U/L，但效果持续时间尚不清楚；需配合饮食控制和代谢管理",
    contraindications: "失代偿期肝硬化\n严重心血管疾病或血流动力学不稳定\n已知FMT供体病原学阳性\n严重凝血障碍（INR>2.0）\n肠道狭窄或已知消化道穿孔风险",
    warnings: "⚠️ 现有研究样本量较小（n=10-59），长期安全性数据有限；不作为常规临床推荐，须充分知情同意",
  },

  // ══════════════════════════════════════════════════════════════════
  // 新增适应证（2026-05-04，Sprint 7 补录）
  // Generator: medical subagent | Evaluator: medical subagent（PMID纠正后）
  // 适应证：激素耐药胃肠道移植物抗宿主病（GI-GvHD）
  // PMID验证：28592766/32801142/33346444/37550190/37654670/39863610/42002228
  // ══════════════════════════════════════════════════════════════════
  {
    id: "gi-gvhd",
    name: "激素耐药胃肠道移植物抗宿主病（GI-GvHD）",
    nameEn: "Steroid-Refractory Gastrointestinal Graft-versus-Host Disease",
    category: "移植与免疫",
    evidenceGrade: "Oxford 2b · GRADE C",
    gradeLabel: "C级",
    gradeColor: "bg-purple-100 text-purple-700",
    efficacy: "FMT治疗激素耐药GI-GvHD完全缓解率（CR）约41-84%。Goloshchapov 2020（RCT，n=27）：FMT组84% vs 安慰剂组50%（90天CR，P=0.07）。武汉中南医院2026（n=25）：CR 84%。MaaT013 2期（n=57）：总应答率57%。Qiao 2022 Meta分析（n=242）：总CR 41.3%，ORR 66.5%。",
    routes: "鼻空肠管（首选）/ 口服胶囊 / 结肠镜 / 灌肠",
    summary: "激素耐药胃肠道移植物抗宿主病（GI-GvHD）是异基因造血干细胞移植（allo-HSCT）后最严重的并发症之一，累及下消化道时预后极差。FMT通过重建肠道微生态，已成为激素耐药GI-GvHD的有效挽救治疗手段，CR率41-84%。武汉中南医院2026年25例研究（DOI: 10.13201/j.issn.1004-2806.2026.05.011）为最新中国数据。",
    administrationRoute: "鼻空肠管（首选，重症）；口服胶囊（轻症/巩固）；重症可联合灌肠",
    dosage: "鼻空肠管：30-50g粪便等价物溶于300-500mL生理盐水；胶囊：15-30粒/日",
    frequency: "1-3次，间隔1-4周；多数患者1-2次即达缓解",
    protocolNote: "FMT通常在激素治疗失败后作为挽救治疗；部分研究采用抗生素预处理5天后FMT；建议优先选择下消化道症状为主（无血便）的患者",
    sources: [
      // 2026-05-04 新增：PMID均经PubMed验证（Generator+Evaluator双轮QA）
      { type: 'PMID', label: 'PMID 28592766 — Kakihana et al., Bone Marrow Transplant 2017（FMT for aGVHD，n=4，CR 75%）', url: 'https://pubmed.ncbi.nlm.nih.gov/28592766/' },
      { type: 'PMID', label: 'PMID 32801142 — van Lier et al., Sci Transl Med 2020（n=15，SR GI-aGVHD，CR 67%）', url: 'https://pubmed.ncbi.nlm.nih.gov/32801142/' },
      { type: 'PMID', label: 'PMID 33346444 — Goloshchapov et al., Blood Adv 2020（RCT，n=27，FMT组84% vs 安慰剂50%）', url: 'https://pubmed.ncbi.nlm.nih.gov/33346444/' },
      { type: 'PMID', label: 'PMID 37550190 — 19例SR GI-aGVHD临床研究，中华血液学杂志 2023', url: 'https://pubmed.ncbi.nlm.nih.gov/37550190/' },
      { type: 'PMID', label: 'PMID 37654670 — MaaT013 2期，EClinicalMedicine 2023（n=57，总应答率57%）', url: 'https://pubmed.ncbi.nlm.nih.gov/37654670/' },
      { type: 'PMID', label: 'PMID 39863610 — Nature Communications 2025（FMT预防allo-HSCT后严重aGVHD，随机双盲RCT）', url: 'https://pubmed.ncbi.nlm.nih.gov/39863610/' },
      { type: 'PMID', label: 'PMID 42002228 — 系统综述，Transplant Cell Ther 2026（allo-HSCT后FMT系统评价）', url: 'https://pubmed.ncbi.nlm.nih.gov/42002228/' },
      { type: 'DOI', label: 'DOI 10.13201/j.issn.1004-2806.2026.05.011 — 武汉中南医院，n=25，CR 84%', url: 'https://lcxy.whuhzzs.com/article/doi/10.13201/j.issn.1004-2806.2026.05.011' },
    ],
    keyRef: "PMID 33346444（Goloshchapov RCT 84% CR）；PMID 37550190（2023年19例）；DOI 10.13201/j.issn.1004-2806.2026.05.011（武汉中南医院 n=25，2026）",
    clinicalFeatures: "主要症状：腹泻（水样便≥3次/天），腹痛（脐周/左下腹痉挛性疼痛），恶心、呕吐；严重者消化道出血（血便）或肠梗阻；体征：发热（38-39°C），腹部压痛，腹胀；重症：消化道穿孔体征（板状腹、反跳痛）；实验室：粪便钙卫蛋白（FC）显著升高（提示肠道炎症），白细胞升高，血小板减少（骨髓抑制表现）；影像：腹部CT示结肠壁增厚、水肿",
    epidemiology: "急性GvHD在allo-HSCT后发生率约30-60%，其中下消化道受累约占50-80%；激素耐药是预后不良标志，约30-50%的III-IV级aGVHD患者对激素治疗无应答；激素耐药GI-GvHD患者1年生存率约30-49%，3年生存率<35%（Biavasco Bone Marrow Transplant 2022）",
    diagnosticCriteria: "主要依据：①allo-HSCT史（30天内）；②腹泻≥3次/天水样便伴腹痛；③粪便病原学阴性（排除感染）；④肠道活检：隐窝细胞凋亡≥3个/隐窝；⑤激素耐药定义：甲泼尼龙≥1mg/kg/d × 3-5天无应答；分级：I级<500mL/d；II级500-999mL/d；III级≥1000mL/d；IV级伴腹痛/出血/肠梗阻；鉴别诊断：艰难梭菌感染、CMV结肠炎、IBD急性发作、药物性腹泻",
    patientCriteria: "适合FMT：allo-HSCT后激素耐药GI-aGVHD（III-IV级）；孤立性下消化道受累、无血便；KPS≥60分；不适合FMT：血流动力学不稳定、多器官功能衰竭；消化道穿孔或活动性大出血；中性粒细胞<500/μL且预计短期无法恢复（相对禁忌）；严重凝血障碍（INR>2.0，血小板<20×10⁹/L）",
    diseaseProgression: "allo-HSCT后中位42天出现GI-GvHD→激素×3-5天无应答→FMT后1-4周评估疗效（腹泻量↓、腹痛缓解、FC下降提示应答）；应答者预后显著改善（Goloshchapov 2020：FMT组90天CR 84% vs 安慰剂50%）；无应答者后续可选JAK抑制剂（芦可替尼）或二次FMT",
    contraindications: "血流动力学不稳定 / 消化道穿孔 / 活动性消化道大出血 / 中性粒细胞<500/μL且预计持续减少 / FMT供体病原阳性",
    warnings: "⚠️ GI-GvHD患者免疫功能严重低下，FMT须在具备感染防控条件的移植中心开展；供体须排除多重耐药菌（MDRO）；FMT联合JAK抑制剂需谨慎评估感染风险",
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
      d.id.toLowerCase().includes(q) ||
      (d.clinicalFeatures || '').includes(q) ||
      (d.epidemiology || '').includes(q) ||
      (d.diagnosticCriteria || '').includes(q) ||
      (d.patientCriteria || '').includes(q) ||
      (d.diseaseProgression || '').includes(q)
  );
}
