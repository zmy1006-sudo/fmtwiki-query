export type TeamCategory = '临床合作' | '算法研发' | '企业管线';
export type Region = '中国' | '美国' | '欧洲' | '亚太';

export interface ContactItem {
  type: string;
  value: string;
  url?: string;
}

// 药物管线条目
export interface PipelineItem {
  code: string;
  type: string;
  indication: string;
  stage: string;
  note: string;
}

// 企业扩展字段
export interface EnterpriseMeta {
  description?: string;
  companyStatus?: string;
  globalSites?: string[];
  pipeline?: PipelineItem[];
  collaborations?: string[];
  milestones?: { year: string; event: string }[];
  clinicalTrials?: number;
  established?: string;
  certifications?: string[];
}

export interface Team {
  id: string;
  name: string;
  nameShort: string;
  location: string;
  leader: string;
  title: string;
  category: TeamCategory;
  region: Region;
  directions: string[];
  latestResult: string;
  publications: { pmid: string; title: string; journal: string; year: number; url: string }[];
  contact: ContactItem[];
  website?: string;
  tags: string[];
  lastUpdated: string;
  // 企业扩展字段
  enterprise?: EnterpriseMeta;
}

export const teams: Team[] = [
  // ══════════════════════════════════════════════════════
  // 临床合作
  // ══════════════════════════════════════════════════════
  {
    id: "zhang-faming",
    name: "南京医科大学二附院 · 微生态医学科",
    nameShort: "南医大二附院",
    location: "南京 · 中国",
    leader: "张发明",
    title: "副院长 / 微生态医学科主任",
    category: "临床合作",
    region: "中国",
    directions: ["AI精准供体匹配", "洗涤菌群移植（WMT）", "疗效预测", "AI智能质控系统"],
    latestResult: "EDS肠型AI匹配模型：IBD疗效从57.1%提升至93.3%；内镜穿孔\"0\"转外科标准",
    publications: [
      { pmid: "38617453", title: "Washed microbiota transplantation for Crohn's disease: A metagenomic, metatranscriptomic, and metabolomic-based study", journal: "World J Gastroenterol", year: 2024, url: "https://pubmed.ncbi.nlm.nih.gov/38617453/" },
    ],
    contact: [
      { type: "电话", value: "18951762846（张老师）", url: "tel:18951762846" },
      { type: "电话", value: "025-58509990", url: "tel:025-58509990" },
      { type: "邮箱", value: "fzhang@njmu.edu.cn", url: "mailto:fzhang@njmu.edu.cn" },
      { type: "邮箱", value: "neepan@163.com", url: "mailto:neepan@163.com" },
    ],
    website: "https://www.njmu.edu.cn/2024/1028/c34a219277/page.htm",
    tags: ["临床", "AI匹配", "WMT", "IBD", "权威"],
    lastUpdated: "2026-04-27",
    // [更新 2026-04-27] enterprise 字段补充
    enterprise: {
      description:
        "南京医科大学第二附属医院微生态医学科是中国FMT/WMT领域的学术与技术高地。张发明教授团队全球首创洗涤菌群移植（WMT）技术体系，主持制定洗涤菌群移植南京共识（Nanjing Consensus, Chin Med J 2020, PMID:32701590），为全国FMT标准化提供方法学依据。团队以AI肠型匹配驱动精准供体筛选，结合多组学AI模型开展菌群定植预测研究；参与国家卫健委FMT质量管理规范起草，深度影响中国FMT临床应用规范化进程。",
      clinicalTrials: 12,
      established: "2012",
      certifications: [
        "国家微生态诊疗基地",
        "FMT质量认证示范中心",
        "南京共识（WMT）技术发源地",
      ],
      collaborations: [
        "美国FDA（FMT监管政策咨询）",
        "FMTBank（国际WMT数据共享）",
        "西达赛奈医学中心（国际多中心）",
        "热心肠研究院（学术传播合作）",
      ],
      milestones: [
        { year: "2012", event: "FMT临床项目启动（胃肠内科）" },
        { year: "2017", event: "成立微生态医学科；WMT技术体系建立" },
        { year: "2020", event: "洗涤菌群移植南京共识发表（PMID:32701590）" },
        { year: "2021", event: "AI肠型（EDS）匹配模型建立" },
        { year: "2022", event: "参与国家FMT临床应用管理专家共识制定（PMID:36117364）" },
        { year: "2024", event: "WMT for Crohn's disease多组学研究发表（World J Gastroenterol）" },
      ],
    },
  },
  {
    id: "qin-huanlong",
    name: "苏州市立医院 · 肠道微生态中心",
    nameShort: "苏州市立医院",
    location: "苏州 · 中国",
    leader: "秦环龙 / 陈启仪",
    title: "秦环龙（教授）/ 陈启仪（肠道微生态中心主任）",
    category: "临床合作",
    region: "中国",
    directions: ["AI供受体配型（FMT-DRM）", "菌株级SGB匹配", "SNV级精准配型"],
    latestResult: "2025年Cell子刊发表AI精准配型算法；牵头FMT治疗IBD专家共识（2025）",
    publications: [],
    contact: [
      { type: "邮箱", value: "qinhuanlong@tongji.edu.cn", url: "mailto:qinhuanlong@tongji.edu.cn" },
      { type: "邮箱", value: "qien2011@163.com", url: "mailto:qien2011@163.com" },
      { type: "电话", value: "021-66307036", url: "tel:021-66307036" },
    ],
    website: "https://www.szmcc.net/",
    tags: ["临床", "AI配型", "IBD共识", "精准医学"],
    lastUpdated: "2026-04-27",
    // [更新 2026-04-27] enterprise 字段扩充
    enterprise: {
      description:
        "苏州市立医院（南京医科大学附属苏州医院）肠道微生态中心是中国FMT标准化与精准配型的核心基地之一，由秦环龙教授（上海市第十人民医院/同济大学）与陈启仪主任联合主导。中心建立了完整的FMT标准化操作流程（SOP），覆盖供体筛选→粪便采集→机器洗涤制备→质量控制→临床输注→随访评估全链路，每个环节均有量化质控指标；配备自动化洗涤制备系统，实现批次间稳定性控制。中心聚焦FMT-DRM（Donor-Recipient Matching）精准配型研究，利用物种基因组分箱（SGB）和SNV级分析实现菌株级匹配；同时牵头中国FMT治疗IBD专家共识（2025版，PMID:40123393）的制定，推动中国FMT精准医学临床落地。",
      clinicalTrials: 8,
      established: "2019",
      certifications: [
        "苏州市肠道微生态诊疗中心",
        "FMT标准化操作示范单位",
      ],
      globalSites: [
        "苏州市立医院（主中心）",
        "同济大学附属上海十院（合作研究）",
        "香港中文大学（深圳）MagIC（AI配型联合研究）",
      ],
      collaborations: [
        "同济大学附属上海十院（联合FMT临床研究）",
        "香港中文大学（深圳）MagIC（MOZAIC+FMT-DRM联合配型）",
        "锐翌基因研究院（宏基因组测序与分析合作）",
        "全国35家三甲医院（2025 IBD FMT共识参与单位）",
      ],
      milestones: [
        { year: "2019", event: "肠道微生态中心成立；FMT SOP体系建立" },
        { year: "2022", event: "参与制定国家FMT临床应用管理专家共识（PMID:36117364）" },
        { year: "2024", event: "Cell Host Microbe发表FMT-DRM研究成果（PMID:38367621）；SGB菌株级配型算法建立" },
        { year: "2025", event: "牵头制定中国FMT治疗IBD专家共识（PMID:40123393）；FMT-DRM v2.0精准配型体系完成" },
      ],
    },
  },
  {
    id: "cuhksz",
    name: "香港中文大学（深圳）· 医学院",
    nameShort: "港中深",
    location: "深圳 · 中国",
    leader: "黄秀娟（Siew C. Ng）",
    title: "教授 / 消化疾病中心主任",
    category: "临床合作",
    region: "亚太",
    directions: ["MOZAIC AI配型算法", "FMT治疗CDI/IBD", "肠-脑轴AI模型"],
    latestResult: "AI配型使CDI治愈率>90%；多中心FMT+AI临床验证完成",
    publications: [],
    contact: [
      { type: "邮箱", value: "siewng@cuhk.edu.cn", url: "mailto:siewng@cuhk.edu.cn" },
    ],
    website: "https://www.cuhk.edu.cn/en/schools-academics/school-of-medicine-and-health-science",
    tags: ["临床", "AI配型", "CDI", "肠-脑轴", "亚太"],
    lastUpdated: "2026-04-27",
    // [更新 2026-04-27] enterprise 字段补充
    enterprise: {
      description:
        "香港中文大学（深圳）Microbiota I-Center（MagIC）是亚洲首个专注于精准微生物治疗（Precision Microbiota Therapy）的转化医学平台，由Siew C. Ng教授（Professor of Medicine, InnoHK计划资助）创立并领导。MagIC全球首创MOZAIC™（Microbiota-Oriented Standardized Automated Intelligent Calculation）AI供体-受体配型系统，基于多 kingdom（细菌+真菌+古菌+病毒）宏基因组分析，通过800+组FMT临床数据和2000+组宏基因组样本训练，使CDI治愈率提升至90%以上（vs传统FMT 70-80%）。2024年，MagIC参与发表的Cell Host Microbe论文（PMID:38367621）从亚种水平揭示供体-受体微生物互作对FMT疗效的影响机制，为FMT-DRM配型提供理论支撑。MagIC已与G-NiiB GenieBiome合作将MOZAIC™技术转化为商业产品（精准FMT胶囊）。",
      clinicalTrials: 6,
      established: "2017",
      certifications: [
        "InnoHK计划资助机构（香港特区政府创新平台）",
        "香港唯一FMT服务提供方（全港公立医院）",
      ],
      globalSites: [
        "香港中文大学（深圳）（MagIC总部）",
        "香港中文大学（深圳）附属医院（FMT临床服务）",
        "粤港澳大湾区医院网络（精准FMT合作）",
        "InnoHK国际合作平台（全球研究伙伴）",
      ],
      collaborations: [
        "G-NiiB GenieBiome（MOZAIC™商业化转化）",
        "苏州市立医院/同济大学（MOZAIC+FMT-DRM联合配型研究）",
        "香港大学（肠道菌群与脑-肠轴合作）",
        "Nature Portfolio（学术出版合作）",
      ],
      milestones: [
        { year: "2017", event: "MagIC成立；Siew Ng教授创建亚洲首个FMT研究中心" },
        { year: "2019", event: "启动亚洲最大IBD菌群数据库（n=5000+）建设" },
        { year: "2020", event: "MOZAIC™ AI配型系统正式发布；CDI治愈率>90%" },
        { year: "2021", event: "MOZAIC™+FMT胶囊研发启动（与G-NiiB合作）" },
        { year: "2022", event: "多kingdom微生物组分析体系完善" },
        { year: "2024", event: "Cell Host Microbe发表亚种水平FMT机制研究（PMID:38367621）" },
        { year: "2025", event: "MOZAIC™技术进入大湾区临床推广阶段" },
      ],
    },
  },
  {
    id: "pumch",
    name: "北京协和医院 · 消化内科",
    nameShort: "协和医院",
    location: "北京 · 中国",
    leader: "钱家鸣 / 李景南团队",
    title: "科室主任 / 团队",
    category: "临床合作",
    region: "中国",
    directions: ["FMT在IBD/CDI/肿瘤免疫中AI疗效预测", "不良反应AI评估"],
    latestResult: "AI疗效预测模型应用于IBD患者FMT应答评估",
    publications: [],
    contact: [
      { type: "电话", value: "010-69155564（消化科）", url: "tel:010-69155564" },
      { type: "邮箱", value: "pumch_xh@163.com", url: "mailto:pumch_xh@163.com" },
    ],
    website: "https://www.pumch.cn/",
    tags: ["临床", "IBD", "肿瘤免疫", "AI预测"],
    lastUpdated: "2026-04-27",
    // [更新 2026-04-27] enterprise 字段补充
    enterprise: {
      description:
        "北京协和医院是中国FMT临床应用与规范化建设的标杆单位。消化内科钱家鸣/李景南团队自2015年开展FMT临床项目，覆盖IBD、复发性CDI、肿瘤免疫相关肠道并发症等适应证，积累超过500例FMT治疗经验。协和建立了标准化FMT临床路径，涵盖供体筛选（含强制性传染病筛查+肠道病原检测）、患者适应证评估、制备质控及输注后随访全流程；参与制定国家FMT临床应用管理专家共识（2022版，PMID:36117364）及FMT治疗IBD专家共识（2025版，PMID:40123393）。团队还开发了基于机器学习的FMT疗效预测模型，用于IBD患者应答概率评估及不良反应早期预警，并积极探索FMT与PD-1/PD-L1抑制剂联用的肿瘤免疫辅助治疗方案。",
      clinicalTrials: 5,
      established: "2015",
      certifications: [
        "国家FMT临床应用管理规范示范单位",
        "FMT临床路径标准化单位",
      ],
      collaborations: [
        "中国工程院（樊代明院士微生态医学学术网络）",
        "中华医学会肠外肠内营养学分会（FMT共识参与单位）",
        "全国35家三甲医院（2025 IBD FMT共识参与单位）",
      ],
      milestones: [
        { year: "2015", event: "FMT临床项目正式启动" },
        { year: "2022", event: "参与制定FMT临床应用管理专家共识（PMID:36117364）" },
        { year: "2023", event: "AI疗效预测模型建立并应用于IBD FMT患者" },
        { year: "2025", event: "参与制定FMT治疗IBD专家共识（PMID:40123393）；FMT+PD-1联用研究启动" },
      ],
    },
  },
  {
    id: "zsu6",
    name: "中山大学附属第六医院 · 微生态中心",
    nameShort: "中山六院",
    location: "广州 · 中国",
    leader: "张宏博 / 陈白虹团队",
    title: "主任 / 团队负责人",
    category: "临床合作",
    region: "中国",
    directions: ["FMT+AI在自闭症/抑郁症/帕金森病中疗效预测"],
    latestResult: "帕金森病FMT疗效AI预测模型建立；自闭症FMT多中心研究启动",
    publications: [],
    contact: [
      { type: "电话", value: "020-38778086", url: "tel:020-38778086" },
      { type: "邮箱", value: "gzsixh@mail.sysu.edu.cn", url: "mailto:gzsixh@mail.sysu.edu.cn" },
    ],
    website: "https://www.sysu6h.com.cn/",
    tags: ["临床", "神经精神", "帕金森", "自闭症", "AI预测"],
    lastUpdated: "2026-04-27",
    // [更新 2026-04-27] enterprise 字段补充
    enterprise: {
      description:
        "中山大学附属第六医院是中国神经精神类疾病FMT临床转化的核心基地之一，在自闭症谱系障碍（ASD）、帕金森病（PD）和抑郁症的FMT治疗方面处于国内领先地位。团队建立了肠道菌群-脑-肠轴AI预测模型，结合多组学数据（宏基因组+代谢组）预测FMT对神经精神症状的改善效果；还牵头建立了广东省微生态专科联盟，覆盖十余家联盟医院，推动神经精神FMT规范化诊疗与临床研究。参与制定FMT治疗IBD专家共识（2025版，PMID:40123393）。",
      clinicalTrials: 4,
      established: "2016",
      certifications: [
        "广东省微生态诊疗中心",
        "微生态专科联盟（广东省）牵头单位",
      ],
      globalSites: [
        "中山大学附属第六医院（主中心）",
        "广东省微生态专科联盟医院网络（十余家联盟单位）",
      ],
      collaborations: [
        "广东省微生态专科联盟各成员医院",
        "中山大学附属第一医院（神经内科学合作）",
        "华南理工大学（AI算法联合开发）",
        "全国35家三甲医院（2025 IBD FMT共识参与单位）",
      ],
      milestones: [
        { year: "2016", event: "FMT临床项目启动（消化系统疾病）" },
        { year: "2019", event: "神经精神类FMT临床转化项目启动（ASD/PD/抑郁症）" },
        { year: "2021", event: "帕金森病FMT疗效AI预测模型建立" },
        { year: "2023", event: "自闭症FMT多中心临床研究启动" },
        { year: "2025", event: "参与制定FMT治疗IBD专家共识（PMID:40123393）；广东省微生态专科联盟扩展至15家医院" },
      ],
    },
  },
  {
    id: "bjyy-fmt",
    name: "首都医科大学附属北京友谊医院",
    nameShort: "北京友谊",
    location: "北京 · 中国",
    leader: "张澍田 / 李鹏",
    title: "主任医师",
    category: "临床合作",
    region: "中国",
    directions: ["FMT标准化", "消化道肿瘤与菌群", "小肠细菌过生长（SIBO）"],
    latestResult: "发表FMT标准化操作流程专家建议；参与制定国家FMT质量管理规范",
    publications: [],
    contact: [
      { type: "电话", value: "010-63138420", url: "tel:010-63138420" },
    ],
    website: "https://www.bfh.com.cn/",
    tags: ["标准化", "质量规范", "临床"],
    lastUpdated: "2026-04-27",
    // [更新 2026-04-27] enterprise 字段补充
    enterprise: {
      description:
        "首都医科大学附属北京友谊医院是国家FMT标准化与质量控制体系建设的核心参与单位之一，由张澍田/李鹏教授团队主导。医院较早开展FMT标准化操作流程（SOP）研究，发表FMT标准化操作流程专家建议；深度参与制定国家FMT临床应用管理专家共识（2022版，PMID:36117364）及其配套的供体筛选与管理规范；同时参与国家卫健委FMT质量管理规范的制定工作。友谊医院消化内科在FMT+消化道肿瘤（肠道菌群与肿瘤免疫）、小肠细菌过生长（SIBO）等方向开展特色临床研究，积累超过300例FMT病例数据。",
      clinicalTrials: 3,
      established: "2015",
      certifications: [
        "国家FMT质量管理规范参与制定单位",
        "FMT标准化操作示范中心",
      ],
      collaborations: [
        "国家卫健委医政医管局（FMT质量管理规范制定）",
        "中华医学会肠外肠内营养学分会（共识参与）",
        "首都医科大学各附属医院（FMT临床合作网络）",
      ],
      milestones: [
        { year: "2015", event: "FMT临床项目正式启动" },
        { year: "2020", event: "发表FMT标准化操作流程专家建议" },
        { year: "2022", event: "参与制定FMT临床应用管理专家共识（PMID:36117364）" },
        { year: "2023", event: "参与FMT质量管理规范（国家卫健委）制定" },
        { year: "2025", event: "FMT+消化道肿瘤肠道菌群研究发表" },
      ],
    },
  },
  {
    id: "shanghai-10th",
    name: "上海市第十人民医院（同济大学附属）",
    nameShort: "上海十院",
    location: "上海 · 中国",
    leader: "徐文志 / 朱鹏",
    title: "主任医师 / 副主任医师",
    category: "临床合作",
    region: "中国",
    directions: ["FMT治疗CDI", "IBD肠道微生态", "肠道菌群与代谢疾病", "FMT-DRM供体-受体配型"],
    latestResult: "2024年Cell Host Microbe发表FMT-DRM里程碑研究；完成FMT治疗CDI前瞻性队列研究（n=120），治愈率92%",
    publications: [],
    contact: [
      { type: "电话", value: "021-66306688", url: "tel:021-66306688" },
    ],
    tags: ["CDI", "IBD", "临床", "FMT-DRM", "Cell Host Microbe"],
    lastUpdated: "2026-04-27",
    // [更新 2026-04-27] enterprise 字段补充（关联PMID:38367621）
    enterprise: {
      description:
        "上海市第十人民医院（同济大学医学院）是秦环龙/许谦/李宁教授团队FMT临床研究的核心基地，也是中国FMT精准医学的先行者。团队建立了完整FMT标准化操作流程（SOP），覆盖自动化洗涤制备系统、精准供体筛选和多组学疗效评估；在自闭症谱系障碍（ASD）儿童FMT领域完成重要临床研究，发表于Cell Host Microbe 2024（PMID:38367621），首次从亚种（subspecies）水平揭示供体-受体微生物互作对FMT植入和临床结局的影响，建立FMT-DRM亚种级配型方法；与苏州市立医院、香港中文大学（深圳）MagIC等机构共同构建FMT精准配型联合研究网络；参与制定FMT治疗IBD专家共识（2025版，PMID:40123393）。",
      clinicalTrials: 10,
      established: "2017",
      certifications: [
        "同济大学医学院微生态研究基地",
        "FMT标准化制备示范单位",
      ],
      collaborations: [
        "苏州市立医院（秦环龙教授联合团队，FMT-DRM合作）",
        "香港中文大学（深圳）MagIC（MOZAIC+FMT-DRM联合配型研究）",
        "锐翌基因研究院（宏基因组与多组学测序合作）",
        "全国35家三甲医院（2025 IBD FMT共识参与单位）",
      ],
      milestones: [
        { year: "2017", event: "FMT临床项目正式启动" },
        { year: "2020", event: "FMT标准化操作流程（SOP）体系建立" },
        { year: "2022", event: "参与制定FMT临床应用管理专家共识（PMID:36117364）" },
        { year: "2023", event: "CDI前瞻性队列研究完成（n=120，治愈率92%）" },
        { year: "2024", event: "Cell Host Microbe发表FMT-DRM里程碑研究（PMID:38367621）；ASD FMT亚种级配型方法建立" },
        { year: "2025", event: "参与制定FMT治疗IBD专家共识（PMID:40123393）；FMT-DRM v2.0精准配型体系建立" },
      ],
    },
  },
  {
    id: "wuhan-union",
    name: "华中科技大学同济医学院附属协和医院",
    nameShort: "武汉协和",
    location: "武汉 · 中国",
    leader: "朱良如 / 侯晓华",
    title: "主任医师",
    category: "临床合作",
    region: "中国",
    directions: ["功能性胃肠病FMT", "肠易激综合征", "肠道菌群与脑-肠轴"],
    latestResult: "完成FMT治疗IBS-D双盲RCT（n=64），结果发表于JGH 2023",
    publications: [],
    contact: [
      { type: "电话", value: "027-85726114", url: "tel:027-85726114" },
    ],
    tags: ["IBS-D", "功能性胃肠病", "临床"],
    lastUpdated: "2026-04-27",
  },
  {
    id: "gzymc-1st",
    name: "广州医科大学附属第一医院",
    nameShort: "广医大一附院",
    location: "广州 · 中国",
    leader: "周永健",
    title: "主任医师",
    category: "临床合作",
    region: "中国",
    directions: ["FMT治疗肝病", "NAFLD/NASH肠道机制", "酒精性肝病"],
    latestResult: "完成FMT治疗酒精性肝病合并肠道菌群失调临床研究（n=60），发表于Liver Int 2022",
    publications: [],
    contact: [
      { type: "电话", value: "020-83062114", url: "tel:020-83062114" },
    ],
    tags: ["肝病", "NAFLD", "酒精性肝病", "临床"],
    lastUpdated: "2026-04-27",
  },
  {
    id: "nfm-pearlriver",
    name: "南方医科大学珠江医院",
    nameShort: "珠江医院",
    location: "广州 · 中国",
    leader: "王新颖",
    title: "主任医师",
    category: "临床合作",
    region: "中国",
    directions: ["FMT与脓毒症", "肠道屏障功能", "危重症肠源性感染"],
    latestResult: "完成FMT辅助治疗脓毒症伴肠道菌群失调RCT（n=80），结果发表于Critical Care Medicine 2023",
    publications: [],
    contact: [
      { type: "电话", value: "020-61643114", url: "tel:020-61643114" },
    ],
    tags: ["脓毒症", "危重症", "ICU", "临床"],
    lastUpdated: "2026-04-27",
  },
  {
    id: "zju-1st",
    name: "浙江大学医学院附属第一医院",
    nameShort: "浙大一附院",
    location: "杭州 · 中国",
    leader: "沈哲 / 厉有名",
    title: "主任医师",
    category: "临床合作",
    region: "中国",
    directions: ["FMT与肝脏疾病", "肠道菌群与酒精戒断", "代谢相关性肝病"],
    latestResult: "完成FMT治疗酒精使用障碍（AUD）合并肠道菌群失调研究（n=45），发表于Hepatology 2022",
    publications: [],
    contact: [
      { type: "电话", value: "0571-87236114", url: "tel:0571-87236114" },
    ],
    tags: ["肝病", "酒精戒断", "代谢", "临床"],
    lastUpdated: "2026-04-27",
  },
  {
    id: "scu-westchina",
    name: "四川大学华西医院",
    nameShort: "华西医院",
    location: "成都 · 中国",
    leader: "张玉顺 / 吴浩",
    title: "主任医师",
    category: "临床合作",
    region: "中国",
    directions: ["FMT与免疫疾病", "自身免疫性肝病", "肠道菌群与移植免疫"],
    latestResult: "完成FMT调节自身免疫性肝炎患者肠道菌群可行性研究（n=30），发表于J Translational Med 2023",
    publications: [],
    contact: [
      { type: "电话", value: "028-85422114", url: "tel:028-85422114" },
    ],
    tags: ["免疫疾病", "自身免疫性肝病", "临床"],
    lastUpdated: "2026-04-27",
  },
  {
    id: "hku-smm",
    name: "香港大学李嘉诚医学院",
    nameShort: "港大医学院",
    location: "香港 · 中国",
    leader: "黄秀娟（Professor Siew Ng）",
    title: "Professor of Medicine",
    category: "临床合作",
    region: "亚太",
    directions: ["FMT精准配型", "炎症性肠病", "肠道菌群大数据"],
    latestResult: "建立亚洲最大IBD菌群数据库（n=5000+）；MOZAIC配型研究（Cell 2021）",
    publications: [],
    contact: [
      { type: "Email", value: "siewng@hku.hk", url: "mailto:siewng@hku.hk" },
    ],
    website: "https://www.med.hku.hk/",
    tags: ["IBD", "AI配型", "大数据", "临床"],
    lastUpdated: "2026-04-27",
  },

  // ══════════════════════════════════════════════════════
  // 算法研发
  // ══════════════════════════════════════════════════════
  {
    id: "zhao-fangqing",
    name: "中国科学院动物研究所",
    nameShort: "中科院动物所",
    location: "北京 · 中国",
    leader: "赵方庆",
    title: "研究员 / 博导",
    category: "算法研发",
    region: "中国",
    directions: ["AI菌群大数据", "FMT供-受体互作", "定植预测", "多组学AI模型"],
    latestResult: "随机森林FMT匹配模型 AUROC=0.801；C2R定植评估；GUT AI微生物组综述",
    publications: [],
    contact: [
      { type: "邮箱", value: "zhaofq@ioz.ac.cn", url: "mailto:zhaofq@ioz.ac.cn" },
    ],
    website: "https://www.ioz.cas.cn/",
    tags: ["算法", "AI模型", "定植预测", "多组学"],
    lastUpdated: "2026-04-27",
  },
  {
    id: "sjtu-ai",
    name: "上海交通大学 · 微生物代谢国家重点实验室",
    nameShort: "上交微生物国重",
    location: "上海 · 中国",
    leader: "邓子新院士团队",
    title: "院士 / 实验室团队",
    category: "算法研发",
    region: "中国",
    directions: ["AI菌群结构解析", "FMT机制", "代谢组-微生物组联合建模"],
    latestResult: "代谢组-微生物组联合建模应用于FMT疗效预测；发表多篇高水平微生物组论文",
    publications: [],
    contact: [
      { type: "邮箱", value: "mml@stu.edu.cn", url: "mailto:mml@stu.edu.cn" },
    ],
    website: "https://sklcj.sjtu.edu.cn/",
    tags: ["算法", "机制研究", "院士", "代谢组学"],
    lastUpdated: "2026-04-27",
  },
  {
    id: "tsinghua-ai",
    name: "清华大学 · 交叉信息研究院/生命学院",
    nameShort: "清华",
    location: "北京 · 中国",
    leader: "江瑞 / 张奇伟团队",
    title: "教授 / 研究团队",
    category: "算法研发",
    region: "中国",
    directions: ["AI菌群大数据", "单细胞+FMT", "移植后生态重构预测"],
    latestResult: "单细胞+FMT联合分析框架发布；生态重构预测准确率显著提升",
    publications: [],
    contact: [
      { type: "邮箱", value: "jiangrui@tsinghua.edu.cn", url: "mailto:jiangrui@tsinghua.edu.cn" },
    ],
    website: "https://iiis.tsinghua.edu.cn/",
    tags: ["算法", "单细胞", "生态重构", "清华"],
    lastUpdated: "2026-04-27",
    // [更新 2026-04-27] enterprise 字段补充
    enterprise: {
      description:
        "清华大学交叉信息研究院与生命学院联合团队（江瑞/张奇伟）在AI驱动微生物组学研究领域处于国际前沿。团队研究涵盖三大方向：①AI菌群大数据建模（深度学习驱动的微生物组功能预测）；②单细胞组学与FMT联合分析框架（scRNA-seq + 宏基因组整合分析）；③FMT后肠道生态重构预测（利用生态网络模型预测菌群恢复轨迹）。团队发表多篇高水平AI+微生物组综述论文，其中Transformer/GNN/扩散模型在肠道微生物组分析综述发表于Bioengineering 2026（PMID:41749685），系统梳理了微生物组语言模型、药物-微生物互作GNN预测等前沿方向，为FMT精准配型提供计算工具支撑。",
      established: "2018",
      certifications: [
        "清华大学交叉信息研究院（国家人工智能创新平台）",
        "清华大学麦戈文脑研究院（神经科学+微生物组交叉）",
      ],
      collaborations: [
        "南京医科大学第二附属医院（AI匹配算法临床验证合作）",
        "苏州市立医院/同济大学（多组学FMT数据分析）",
        "北京生命科学研究所（NIBS单细胞技术合作）",
        "国家超算无锡中心（微生物组大数据计算）",
      ],
      milestones: [
        { year: "2018", event: "AI微生物组研究方向启动" },
        { year: "2020", event: "微生物组语言模型（microbial LM）研究启动" },
        { year: "2022", event: "单细胞+FMT联合分析框架发布" },
        { year: "2024", event: "GUT AI微生物组大型综述发表" },
        { year: "2026", event: "Transformer/GNN/扩散模型微生物组综述发表（PMID:41749685）；FMT生态重构预测模型上线" },
      ],
    },
  },

  // ══════════════════════════════════════════════════════
  // 企业管线（扩展版，含完整管线、合作、里程碑）
  // ══════════════════════════════════════════════════════

  // ── 1. 深圳未知君（XBIOME）─────────────────────────
  {
    id: "xbiome",
    name: "深圳未知君生物科技（XBIOME）",
    nameShort: "未知君",
    location: "深圳 · 中国",
    leader: "谭验",
    title: "创始人 / CEO",
    category: "企业管线",
    region: "中国",
    directions: [
      "AI微生物组精准药物发现",
      "活体生物药（LBP）研发",
      "基因工程微生物药物",
      "FMT肠菌移植制剂",
      "微生物衍生小分子药物",
      "肿瘤免疫联合治疗（PD-1联用）",
    ],
    latestResult: "XBI-302获FDA批准进入aGvHD临床二期（2023-12）；LBP01获NMPA批准进入国内临床二期（2023-11）；全球首批FMT药物进入FDA临床的中国企业",
    publications: [],
    contact: [
      { type: "电话", value: "0755-86530994", url: "tel:0755-86530994" },
      { type: "邮箱", value: "contact@xbiome.com", url: "mailto:contact@xbiome.com" },
    ],
    website: "https://www.xbiome.com",
    tags: ["企业", "FDA临床II期", "AI驱动", "First-in-class", "LBP+FMT双轨", "国际合作"],
    lastUpdated: "2026-04-27",
    // [更新 2026-04-27] enterprise 字段补充（globalSites已完善）
    enterprise: {
      description: "未知君成立于2017年，是中国AI微生物组研究和产业转化平台的领导者。核心团队来自辉瑞、诺华、施贵宝等国际一流药企，拥有超过20年FDA药物评审经验。全球首批FMT药物进入FDA临床的中国企业。",
      companyStatus: "B轮系列融资（近1亿美元，2021）",
      globalSites: ["深圳（总部+实验生产中心）", "波士顿（生物科技及计算科学中心）", "北京（临床开发中心）", "东莞（实验动物中心）", "苏州（药物研发及生产）"],
      pipeline: [
        { code: "XBI-302", type: "FMT药物", indication: "急性移植物抗宿主病（aGvHD）", stage: "FDA 临床II期", note: "2023-12 FDA批准EOP1进入临床II期" },
        { code: "LBP02", type: "配方菌（LBP）", indication: "溃疡性结肠炎（UC）", stage: "FDA 临床Ib期", note: "即将在美国开启Ib期临床" },
        { code: "LBP03", type: "配方菌（LBP）", indication: "实体瘤（PD-1联用）", stage: "FDA 临床I期", note: "2022-08获FDA IND批件" },
        { code: "LBP01", type: "基因工程微生物", indication: "糖尿病足溃疡", stage: "NMPA 临床II期", note: "2023-11获国家药监局批准" },
        { code: "MDM01/02", type: "微生物衍生分子", indication: "实体瘤", stage: "临床前", note: "肿瘤免疫辅助治疗" },
        { code: "XF-01", type: "消费产品", indication: "骨质疏松", stage: "验证中", note: "" },
        { code: "XF-02", type: "消费产品", indication: "抗抑郁", stage: "验证中", note: "" },
      ],
      collaborations: [
        "第三军医大学大坪医院（自闭症临床试验）",
        "中科院深圳先进技术研究院（BT-IT联合实验室）",
        "南方医科大学南方医院（aGvHD临床研究）",
        "三生制药（肾病FMT药物开发）",
        "华润生物（广泛疾病领域联合研发）",
        "北京大学肿瘤医院（肿瘤免疫治疗研究）",
        "美赞臣中国（精准营养、功能益生菌）",
        "万益蓝WonderLab（益生菌科研）",
        "Aurealis Therapeutics（基因工程菌大中华区License-in）",
      ],
      milestones: [
        { year: "2017", event: "公司成立" },
        { year: "2018-08", event: "A轮（高榕、晨兴，真格基金）" },
        { year: "2019-11", event: "B轮（君联、高榕等，超千万美元）" },
        { year: "2020-11", event: "B+轮（春华资本等）" },
        { year: "2021-06", event: "亚洲首个FMT药物获FDA IND临床许可" },
        { year: "2021-12", event: "B轮系列，近1亿美元" },
        { year: "2022-08", event: "LBP03肿瘤管线获FDA IND批件" },
        { year: "2023-11", event: "LBP01糖尿病足获NMPA临床II期批准" },
        { year: "2023-12", event: "XBI-302 aGvHD获FDA批准进入临床II期" },
        { year: "2024-07", event: "参与撰写肠菌移植国家级专家共识" },
      ],
    },
  },

  // ── 2. 北京富玛特（FMTMAT）───────────────────────
  {
    id: "fmtmat",
    name: "北京富玛特生物科技（FMTMAT）",
    nameShort: "富玛特",
    location: "北京 · 中国",
    leader: "樊代明院士",
    title: "学术带头人 / 创始顾问",
    category: "企业管线",
    region: "中国",
    directions: [
      "FMT标准化制剂",
      "AI供受体精准配型",
      "微胶囊制剂技术",
      "FMT全流程智能质控",
      "菌群库建设与规范化",
    ],
    latestResult: "FMT标准化平台已在中国多个中心投入使用；AI质控系统覆盖菌群分离→制备→质控全流程；参与中国FMT专家共识制定",
    publications: [],
    contact: [
      { type: "电话", value: "400-886-9957", url: "tel:400-886-9957" },
      { type: "邮箱", value: "contact@fmtmat.com", url: "mailto:contact@fmtmat.com" },
    ],
    website: "https://www.fmtmat.com",
    tags: ["企业", "标准化", "院士", "微胶囊", "AI质控", "中国FMT"],
    lastUpdated: "2026-04-27",
    // [更新 2026-04-27] enterprise 字段已完整
    enterprise: {
      description: "富玛特是中国较早从事肠道微生态研究和FMT产业化的企业之一，依托樊代明院士（中国工程院副院长，消化病学权威）在微生态医学领域的学术积累，致力于FMT标准化制剂、AI质控和精准配型三大方向的产业化。",
      companyStatus: "临床阶段（IIT为主），FMT制剂已在中国多家医院使用",
      globalSites: ["北京（总部/临床开发）"],
      pipeline: [
        { code: "FMT标准化制剂", type: "FMT", indication: "复发性CDI/IBD/多种适应证", stage: "临床使用", note: "已在中国多家三甲医院开展IIT临床研究" },
        { code: "AI配型系统", type: "AI工具", indication: "供体-受体精准匹配", stage: "已部署", note: "基于肠道菌群特征AI匹配" },
        { code: "微胶囊制剂", type: "FMT新型制剂", indication: "口服FMT", stage: "研发中", note: "提高FMT制剂稳定性和患者依从性" },
      ],
      collaborations: [
        "中国工程院（樊代明院士团队）——学术支撑",
        "中国肠病学会（CAR-China）——临床研究合作",
        "国内多家三甲医院消化科——IIT临床研究",
        "中国消化病学分会 ——标准化工作参与",
      ],
      milestones: [
        { year: "2017前", event: "FMT标准化研究启动" },
        { year: "2018-2020", event: "FMT标准化制剂产品上市" },
        { year: "2021", event: "AI质控系统研发完成并投入使用" },
        { year: "2022", event: "微胶囊制剂进入研发管线" },
        { year: "2023-2024", event: "参与中国FMT专家共识制定" },
      ],
    },
  },

  // ── 3. Seres Therapeutics（美国）───────────────────
  {
    id: "seres",
    name: "Seres Therapeutics",
    nameShort: "Seres",
    location: "剑桥 · 美国（NASDAQ: MCRB）",
    leader: "Richard N. Kender",
    title: "执行主席 / 临时CEO（2026-03）",
    category: "企业管线",
    region: "美国",
    directions: [
      "微生物组活体生物药（LBP）",
      "炎症与免疫疾病",
      "肿瘤免疫（与BMS合作）",
      "艰难梭菌感染（rCDI）",
      "微生物-药物相互作用研究",
    ],
    latestResult: "2026-02 宣布优先推进炎症与免疫疾病管线；与BMS开展肿瘤免疫合作；Richard Kender任临时CEO（2026-03）",
    publications: [],
    contact: [
      { type: "官网", value: "serestherapeutics.com", url: "https://www.serestherapeutics.com" },
      { type: "投资者关系", value: "ir.serestherapeutics.com", url: "https://ir.serestherapeutics.com" },
    ],
    website: "https://www.serestherapeutics.com",
    tags: ["美国上市", "NASDAQ:MCRB", "LBP", "BMS合作", "临床后期", "炎症免疫"],
    lastUpdated: "2026-04-27",
    enterprise: {
      description: "Seres Therapeutics成立于2010年，总部位于美国马萨诸塞州剑桥，2015年NASDAQ上市（NASDAQ: MCRB）。是全球微生物组疗法领域最知名的上市公司之一，核心技术基于健康人类微生物组的系统分析来设计精准细菌联合疗法。",
      companyStatus: "NASDAQ上市（MCRB），2025年全年财务数据已公布",
      globalSites: ["马萨诸塞州剑桥（总部）", "全球多中心临床试验"],
      pipeline: [
        { code: "SER-287", type: "LBP", indication: "溃疡性结肠炎（UC）", stage: "Phase 2b完成", note: "2021年Phase 2未达主要终点，公司调整优先顺序" },
        { code: "SER-401", type: "LBP", indication: "肿瘤免疫（NSCLC等）", stage: "Phase 1b/2", note: "与BMS Opdivo联用，已进入临床" },
        { code: "SER-109", type: "LBP", indication: "复发性艰难梭菌（rCDI）", stage: "Phase 3完成/BLA", note: "已完成3期临床，已提交BLA申请" },
        { code: "微生物组平台", type: "平台", indication: "多种适应证", stage: "临床前", note: "公司核心微生物组数据库驱动发现平台" },
      ],
      collaborations: [
        "百时美施贵宝（BMS）——肿瘤免疫临床合作",
        "Nestlé Health Science —— 全球商业化合作（特定产品）",
        "Harvard Medical School —— 基础研究合作",
      ],
      milestones: [
        { year: "2015", event: "NASDAQ上市（MCRB）" },
        { year: "2016", event: "与Nestlé Health Science建立全球商业化合作" },
        { year: "2021", event: "SER-109 Phase 3完成并提交BLA" },
        { year: "2021", event: "SER-287 UC Phase 2未达主要终点" },
        { year: "2022", event: "Pivot to inflammatory & immune diseases" },
        { year: "2024", event: "宣布肿瘤免疫管线优先推进" },
        { year: "2026-02", event: "优先推进炎症与免疫疾病管线" },
        { year: "2026-03", event: "Richard Kender任执行主席兼临时CEO" },
      ],
    },
  },

  // ── 4. Vedanta Biosciences（美国）────────────────
  {
    id: "vedanta",
    name: "Vedanta Biosciences",
    nameShort: "Vedanta",
    location: "剑桥 · 美国（PureTech旗下，NASDAQ: PRTC）",
    leader: "Bharatt M. Chowdry",
    title: "CEO",
    category: "企业管线",
    region: "美国",
    directions: [
      "定义明确的细菌联合疗法（Defined Bacterial Consortia）",
      "艰难梭菌感染（rCDI）",
      "溃疡性结肠炎（UC）",
      "食物过敏（VE202）",
      "炎症与免疫疾病",
    ],
    latestResult: "VE303 rCDI Phase 3（RESTORATiVE303）全球200+中心招募中（2025）；VE202 UC Phase 2未达主要终点（2025-08）；裁员约20%应对管线调整",
    publications: [],
    contact: [
      { type: "官网", value: "vedantabio.com", url: "https://www.vedantabio.com" },
    ],
    website: "https://www.vedantabio.com",
    tags: ["PureTech旗下", "定义细菌联合疗法", "rCDI Phase 3", "UC Phase 2失败", "全球化临床"],
    lastUpdated: "2026-04-27",
    enterprise: {
      description: "Vedanta Biosciences总部位于美国马萨诸塞州剑桥，是PureTech Health（NSDQ: PRTC）旗下临床阶段公司。核心技术在于利用理性设计的确定性细菌联合配方（defined consortia），而非不确定性粪便移植。公司创始团队包括多位MIT/哈佛顶级科学家。",
      companyStatus: "PureTech旗下（NASDAQ: PRTC上市），2025年裁员20%应对管线调整",
      globalSites: ["马萨诸塞州剑桥（总部）", "全球200+临床研究中心"],
      pipeline: [
        { code: "VE303", type: "定义细菌联合（8株）", indication: "复发性艰难梭菌（rCDI）", stage: "Phase 3（RESTORATiVE303，全球200+中心）", note: "注册性III期，2025年积极推进" },
        { code: "VE202", type: "定义细菌联合", indication: "溃疡性结肠炎（UC）", stage: "Phase 2未达主要终点（COLLECTiVE202，2025-08）", note: "未达主要终点，但耐受性良好" },
        { code: "VE400", type: "定义细菌联合", indication: "化疗后肠道恢复", stage: "Phase 1", note: "支持肿瘤患者肠道健康" },
        { code: "VE800", type: "定义细菌联合", indication: "肿瘤免疫（PD-1联用）", stage: "Phase 1/2", note: "与KEYTRUDA联用概念验证" },
        { code: "平台技术", type: "平台", indication: "多种LBP适应证", stage: "临床前", note: "rational design细菌配方发现平台" },
      ],
      collaborations: [
        "PureTech Health（NSDQ: PRTC）—— 母公司与主要股东",
        "MSD（默沙东）—— VE800 + KEYTRUDA临床合作",
        "全球顶级医学中心 —— RESTORATiVE303全球III期（200+研究中心）",
        "Nature Medicine发表VE303 Phase 2研究（2025-01）",
      ],
      milestones: [
        { year: "2010s", event: "由MIT/哈佛科学家创立" },
        { year: "2019", event: "与武田制药签署重大合作协议" },
        { year: "2019", event: "VE303 Phase 1/2积极结果发表于Nature Medicine" },
        { year: "2022", event: "启动RESTORATiVE303全球Phase 3（200+中心）" },
        { year: "2025-01", event: "VE303额外Phase 2结果发表于Nature子刊" },
        { year: "2025-08", event: "VE202 UC Phase 2未达主要终点，裁员~20%" },
        { year: "2025-09", event: "VE303 Phase 3持续推进" },
      ],
    },
  },

  // ── 5. Finch Therapeutics（美国，已退市）──────────
  {
    id: "finch",
    name: "Finch Therapeutics",
    nameShort: "Finch",
    location: "波士顿 · 美国（NASDAQ已退市，2024-10）",
    leader: "Mark J. Smith",
    title: "CEO",
    category: "企业管线",
    region: "美国",
    directions: [
      "微生物组完整群落移植（Full-Spectrum Microbiota）",
      "复发性艰难梭菌（rCDI）",
      "自闭症（ASD）肠道-脑轴",
      "炎症性肠病（IBD）",
      "IP资产组合与授权",
    ],
    latestResult: "2024-10 宣布从NASDAQ退市；2023-01 停止CP101 rCDI Phase 3；目前聚焦IP资产管理与对外授权",
    publications: [],
    contact: [
      { type: "官网", value: "finchtherapeutics.com", url: "https://www.finchtherapeutics.com" },
    ],
    website: "https://www.finchtherapeutics.com",
    tags: ["NASDAQ已退市", "完整群落移植", "ASD肠-脑轴", "IP授权", "rCDI"],
    lastUpdated: "2026-04-27",
    enterprise: {
      description: "Finch Therapeutics成立于2010年，总部位于美国波士顿，2021年NASDAQ上市（NASDAQ: FNCH）。是微生物组领域早期先驱之一，以完整群落微生物组移植（FMT）技术闻名。2024年因临床试验挫折退市，现聚焦IP资产管理。",
      companyStatus: "NASDAQ退市（2024-10退市注销），CFO已于2025-01辞职",
      globalSites: ["马萨诸塞州波士顿（总部）"],
      pipeline: [
        { code: "CP101", type: "完整群落FMT", indication: "复发性艰难梭菌（rCDI）", stage: "Phase 3终止（2023-01）", note: "因III期试验结果不符合预期停止，2024-10退市" },
        { code: "CP101-ASD", type: "完整群落FMT", indication: "自闭症谱系障碍（ASD）", stage: "Phase 2", note: "肠道-脑轴研究，独特适应证方向" },
        { code: "FIN-524", type: "LBP", indication: "溃疡性结肠炎（UC）", stage: "Phase 2", note: "与武田制药合作开发" },
        { code: "IP组合", type: "知识产权", indication: "广泛微生物组适应证", stage: "授权中", note: "持有大量微生物组专利，正在对外授权" },
      ],
      collaborations: [
        "武田制药（Takeda）——FIN-524 UC合作开发",
        "顶尖学术医学中心 —— ASD FMT临床研究",
        "Seerave Foundation —— 微生物组与肿瘤免疫研究",
      ],
      milestones: [
        { year: "2011", event: "成立，核心FMT技术研发" },
        { year: "2017", event: "完成多项FMT rCDI关键临床研究" },
        { year: "2021", event: "NASDAQ上市（FNCH）" },
        { year: "2023-01", event: "停止CP101 rCDI Phase 3试验" },
        { year: "2024-10", event: "NASDAQ退市并完成SEC注销" },
        { year: "2025-01", event: "CFO辞职，聚焦IP资产授权" },
      ],
    },
  },

  // ── 6. Second Genome（美国）────────────────────
  {
    id: "secondgenome",
    name: "Second Genome",
    nameShort: "Second Genome",
    location: "南旧金山 · 美国",
    leader: "Peter J. DiLaura",
    title: "CEO",
    category: "企业管线",
    region: "美国",
    directions: [
      "微生物组来源的小分子药物",
      "炎症性肠病（IBD/UC/CD）",
      "代谢性疾病（NASH/肥胖）",
      "肿瘤免疫",
      "微生物组-药物相互作用",
    ],
    latestResult: "SGM-374（CB-286）NASH Phase 2积极进展；微生物组生物标志物平台与多家药企合作；2024年完成B轮融资",
    publications: [],
    contact: [
      { type: "官网", value: "secondgenome.com", url: "https://www.secondgenome.com" },
      { type: "邮箱", value: "info@secondgenome.com", url: "mailto:info@secondgenome.com" },
    ],
    website: "https://www.secondgenome.com",
    tags: ["微生物小分子", "NASH", "IBD", "生物标志物", "药企合作"],
    lastUpdated: "2026-04-27",
    enterprise: {
      description: "Second Genome总部位于美国加州南旧金山，专注于从微生物组中发现和开发小分子药物。与传统LBP不同，其核心技术基于微生物组数据的药物发现（data-driven approach），利用微生物组来源的生物活性分子开发新药，并拥有经过临床验证的微生物组生物标志物发现平台。",
      companyStatus: "B轮私募融资（2024），未上市",
      globalSites: ["加州南旧金山（总部）"],
      pipeline: [
        { code: "SGM-374 (CB-286)", type: "微生物小分子", indication: "非酒精性脂肪性肝炎（NASH）", stage: "Phase 2", note: "2024年完成Phase 2积极数据" },
        { code: "SGM-540", type: "微生物小分子", indication: "炎症性肠病（IBD）", stage: "Phase 1", note: "IBD概念验证中" },
        { code: "微生物组标志物平台", type: "诊断/生物标志物", indication: "多种适应证", stage: "商业化", note: "与辉瑞等药企合作，已商业化" },
        { code: "PG-2", type: "微生物小分子", indication: "代谢性疾病", stage: "临床前", note: "代谢综合征适应证" },
      ],
      collaborations: [
        "辉瑞（Pfizer）——微生物组生物标志物合作",
        "武田制药（Takeda）——IBD药物发现合作",
        "Mayo Clinic —— 临床研究合作",
      ],
      milestones: [
        { year: "2010s", event: "微生物组药物发现平台建立" },
        { year: "2019", event: "与武田制药达成IBD药物发现战略合作" },
        { year: "2021", event: "PG-2进入临床前开发" },
        { year: "2024", event: "SGM-374 Phase 2积极数据；完成B轮融资" },
        { year: "2025", event: "推进NASH Phase 2b；扩展IBD管线" },
      ],
    },
  },
];

export const teamCategories: { label: string; value: TeamCategory | '全部' }[] = [
  { label: '全部', value: '全部' },
  { label: '临床合作', value: '临床合作' },
  { label: '算法研发', value: '算法研发' },
  { label: '企业管线', value: '企业管线' },


  // 华北
  { id: "pla-301-hospital", name: "解放军总医院（北京301医院）· 消化内科", nameShort: "北京301医院", location: "北京 · 中国", leader: "杨云生 / 杨光", title: "消化内科医学部学术委员会主任 / 儿科主任", category: "临床合作", region: "中国", directions: ["FMT治疗自闭症（ASD）", "炎症性肠病", "口服FMT随机双盲RCT"], latestResult: "2015年完成世界首例自闭症儿童FMT；2024年103例ASD儿童口服FMT随机双盲RCT发表于Clinical and Translational Medicine", publications: [{ pmid: "39187939", title: "Effect of oral faecal microbiota transplantation intervention for children with autism spectrum disorder: A randomised, double-blind, placebo-controlled trial", journal: "Clinical and Translational Medicine", year: 2024, url: "https://pubmed.ncbi.nlm.nih.gov/39187939/" }], contact: [{ type: "电话", value: "010-66887329", url: "tel:010-66887329" }], website: "https://www.301hospital.cn/", tags: ["公立三甲", "临床FMT", "ASD", "世界首例"], lastUpdated: "2026-05-04" },
  { id: "xijing-hospital", name: "第四军医大学西京医院 · 消化病医院", nameShort: "西京医院", location: "西安 · 陕西 · 中国", leader: "吴开春", title: "西京消化病医院副院长 / 中华医学会消化病学分会副主任委员", category: "临床合作", region: "中国", directions: ["炎症性肠病（IBD）", "MedBiome中国内科病粪菌库"], latestResult: "2018年6月联合中科院微生物所发起建立中国内科病粪菌库（MedBiome），覆盖消化病、血液病、实体肿瘤等多病种援助；樊代明院士领衔", publications: [], contact: [{ type: "电话", value: "029-84771114", url: "tel:029-84771114" }], website: "https://www.fmmu.edu.cn/", tags: ["公立三甲", "临床FMT", "IBD", "MedBiome", "樊代明院士"], lastUpdated: "2026-05-04" },
  { id: "shanxi-people-hospital", name: "山西省人民医院 · 消化科", nameShort: "山西省人民医院", location: "太原 · 山西 · 中国", leader: "汪嵘 / 郭晓峰", title: "消化科主任 / IBD亚专科学术带头人", category: "临床合作", region: "中国", directions: ["炎症性肠病（IBD）多学科精准菌群移植", "MDT综合诊疗"], latestResult: "2025年7月IBD-MDT中心及精准菌群移植中心正式揭牌成立；整合22个学科", publications: [], contact: [{ type: "电话", value: "0351-4960068", url: "tel:0351-4960068" }], website: "https://www.sxsy.com.cn/", tags: ["公立三甲", "临床FMT", "IBD-MDT", "22个学科"], lastUpdated: "2026-05-04" },
  // 华东
  { id: "shanghai-renji", name: "上海交通大学医学院附属仁济医院 · 消化科", nameShort: "上海仁济医院", location: "上海 · 中国", leader: "房静远", title: "中国科学院院士 / 消化科教授", category: "临床合作", region: "中国", directions: ["肠道微生态与胃肠癌防控", "FMT用于irAEs管理", "脑肠轴"], latestResult: "2025年房静远院士团队在Nature Reviews Clinical Oncology（IF=81.1）发表irAEs综述", publications: [{ pmid: "37602831", title: "Faecalibacterium prausnitzii abrogates intestinal toxicity and promotes tumor immunity", journal: "Cancer Research", year: 2023, url: "https://pubmed.ncbi.nlm.nih.gov/37602831/" }], contact: [{ type: "电话", value: "021-58752345", url: "tel:021-58752345" }], website: "https://www.renji.com/", tags: ["公立三甲", "临床FMT", "院士", "肿瘤免疫irAE"], lastUpdated: "2026-05-04" },
  { id: "qilu-hospital", name: "山东大学齐鲁医院 · 消化内科", nameShort: "齐鲁医院", location: "济南 · 山东 · 中国", leader: "李延青", title: "泰山学者攀登计划专家", category: "临床合作", region: "中国", directions: ["IBD亚专科", "复发性伪膜性肠炎FMT", "肠菌移植标准化"], latestResult: "2025年7月主办肠菌移植技术标准化交流会；11月完成首例FMT治疗复发性伪膜性肠炎", publications: [], contact: [{ type: "电话", value: "0531-82169114", url: "tel:0531-82169114" }], website: "https://www.qiluhospital.com.cn/", tags: ["公立三甲", "临床FMT", "IBD", "伪膜性肠炎"], lastUpdated: "2026-05-04" },
  { id: "zhejiang-1st-hospital", name: "浙江大学医学院附属第一医院 · 精神卫生科", nameShort: "浙大一附院", location: "杭州 · 浙江 · 中国", leader: "胡少华", title: "精神卫生科主任 / 浙江大学求是特聘教授", category: "临床合作", region: "中国", directions: ["脑肠轴机制", "FMT与双相障碍/抑郁症"], latestResult: "2022年在Molecular Psychiatry发表双相障碍脑肠轴多组学研究成果；2025年在BMC Medicine发表肠道菌群调节神经可塑性研究", publications: [{ pmid: "35854253", title: "Multi-omics analyses of serum metabolome, gut microbiome and brain network in bipolar disorder", journal: "Molecular Psychiatry", year: 2022, url: "https://pubmed.ncbi.nlm.nih.gov/35854253/" }], contact: [{ type: "电话", value: "0571-87235000", url: "tel:0571-87235000" }], website: "https://www.zy91.com/", tags: ["公立三甲", "临床FMT", "精神疾病", "脑肠轴", "胡少华"], lastUpdated: "2026-05-04" },
  // 华南+西南
  { id: "zhangshan-1st", name: "中山大学附属第一医院 · 消化内科", nameShort: "中山大一附院", location: "广州 · 广东 · 中国", leader: "左涛 / 曾志荣", title: "胃肠病学研究所副所长 / 消化内科主任", category: "临床合作", region: "中国", directions: ["IBD微生态机制", "噬菌体组移植（FPT）治疗IBD", "FMT病毒组/真菌组研究"], latestResult: "左涛团队在Lancet子刊发表FMT病毒组/真菌组综述；2026年FMT治疗帕金森病II期成果发表于Signal Transduction and Targeted Therapy（IF=53）", publications: [{ pmid: "41826284", title: "Gut microbiota modulation via repeated donor fecal transplantation improves motor and gastrointestinal symptoms in drug-naive Parkinson's disease: a randomized phase 2 trial", journal: "Signal Transduction and Targeted Therapy", year: 2026, url: "https://pubmed.ncbi.nlm.nih.gov/41826284/" }], contact: [{ type: "电话", value: "020-87755777", url: "tel:020-87755777" }], website: "https://www.gzsums.net/", tags: ["公立三甲", "临床FMT", "IBD", "噬菌体组", "Lancet子刊", "帕金森"], lastUpdated: "2026-05-04" },
  { id: "chinese-westchina", name: "四川大学华西医院 · 消化内科", nameShort: "华西医院", location: "成都 · 四川 · 中国", leader: "刘苓 / 徐佳军", title: "消化内科教授 / 心理卫生中心副教授", category: "临床合作", region: "中国", directions: ["FMT治疗儿童孤独症（ASD）", "IBD", "多学科协作"], latestResult: "2023年11月完成西南地区首例内镜下精准菌群移植治疗孤独症儿童（刘苓+徐佳军团队）；2018年建成四川省首个标准化FMT中心", publications: [], contact: [{ type: "电话", value: "028-85422114", url: "tel:028-85422114" }], website: "https://www.cd120.com/", tags: ["公立三甲", "临床FMT", "ASD孤独症", "西南首例", "MDT", "刘苓"], lastUpdated: "2026-05-04" },
  { id: "guangdong-yiyao-1st", name: "广东药科大学附属第一医院 · 消化内科", nameShort: "广东药科大学附一院", location: "广州 · 广东 · 中国", leader: "何兴祥", title: "消化内科主任", category: "临床合作", region: "中国", directions: ["洗涤菌群移植（WMT）", "肠道微生态临床应用"], latestResult: "WMT中心2016年成立；截至2025年3月累计完成WMT超11647例次；2024年WMT治疗MAFLD论文发表于Gut Microbes", publications: [{ pmid: "39646122", title: "Washed microbiota transplantation promotes homing of group 3 innate lymphoid cells to the liver", journal: "Gut Microbes", year: 2024, url: "https://pubmed.ncbi.nlm.nih.gov/39646122/" }], contact: [{ type: "电话", value: "020-61326100", url: "tel:020-61326100" }], website: "https://www.gzmmu.edu.cn/", tags: ["公立三甲", "临床FMT", "WMT", "大规模FMT", "何兴祥"], lastUpdated: "2026-05-04" },
  { id: "southern-med-university-shenzhen", name: "南方医科大学深圳医院 · 整合微生态诊疗中心", nameShort: "南医大深圳医院", location: "深圳 · 广东 · 中国", leader: "陈烨", title: "珠江学者 / 整合微生态诊疗中心主任", category: "临床合作", region: "中国", directions: ["整合微生态诊疗", "FMT标准化操作"], latestResult: "FMT累计超过1000例；陈烨（珠江学者）是深圳地区肠道微生态与FMT临床应用的重要专家", publications: [], contact: [{ type: "电话", value: "0755-23360000", url: "tel:0755-23360000" }], tags: ["公立三甲", "临床FMT", "深圳", "陈烨", "珠江学者"], lastUpdated: "2026-05-04" },
  // 企业
  { id: "maintainbiotech", name: "美益添生物医药（武汉）有限公司", nameShort: "美益添", location: "武汉 · 湖北 · 中国", leader: "待确认", title: "CEO", category: "企业管线", region: "中国", directions: ["精准初幼菌群移植（yFMT）", "菌液/胶囊制剂", "AI精准配型"], latestResult: "2026年2月全国唯一微生态临床指南参编委员；唯一以肠菌移植命名的国家级工程研究中心；临床1.5万+例有效率90%+", publications: [], contact: [{ type: "电话", value: "400-666-9032", url: "tel:400-666-9032" }, { type: "网址", value: "https://www.maintainbiotech.cn/", url: "https://www.maintainbiotech.cn/" }], website: "https://www.maintainbiotech.cn/", tags: ["企业", "yFMT", "制剂", "AI配型", "美益添"], lastUpdated: "2026-05-04" },
  { id: "xbiome", name: "深圳未知君生物科技（XBIOME）", nameShort: "未知君", location: "深圳 · 中国", leader: "谭验", title: "创始人 / CEO", category: "企业管线", region: "中国", directions: ["AI微生物组精准药物发现", "活体生物药（LBP）研发", "FMT肠菌移植制剂", "AI供受体配型"], latestResult: "亚洲首家获FDA IND临床批件的FMT企业；中国首个获NMPA基因工程菌新药临床批件；XBI-302于2021年获FDA IND（aGvHD）", publications: [], contact: [{ type: "电话", value: "0755-86530994", url: "tel:0755-86530994" }, { type: "网址", value: "https://www.xbiome.com", url: "https://www.xbiome.com" }], website: "https://www.xbiome.com", tags: ["企业", "FDA临床", "AI驱动", "LBP", "XBIOME"], lastUpdated: "2026-05-04" },
  { id: "chenggem", name: "承葛医药（承葛生物）", nameShort: "承葛医药", location: "福建 · 中国", leader: "待确认", title: "CEO", category: "企业管线", region: "中国", directions: ["精准菌群移植（PMT）", "FMT", "活体生物药（LBP）", "菌群基因检测"], latestResult: "自建9座标准化菌群库；2025年获金阖资本过亿元战略融资；累计融资过2亿元；临床应用超26万例", publications: [], contact: [{ type: "网址", value: "https://www.chenggem.com/", url: "https://www.chenggem.com/" }], website: "https://www.chenggem.com/", tags: ["企业", "FMT制剂", "LBP", "菌群库", "承葛"], lastUpdated: "2026-05-04" },
  { id: "rayee", name: "锐翌生物（锐翌基因）", nameShort: "锐翌基因", location: "上海 · 中国", leader: "秦楠", title: "创始人 / CEO", category: "企业管线", region: "中国", directions: ["肠道菌群移植", "精准菌群移植", "肠道微生物检测", "AI精准配型"], latestResult: "国内同行业唯一获上海市科技进步一等奖；AI配型精准度90%；拥有18种疾病特征数据库；获230+专利", publications: [], contact: [{ type: "网址", value: "https://www.rayee.com/", url: "https://www.rayee.com/" }], website: "https://www.rayee.com/", tags: ["企业", "高新技术企业", "AI配型", "上海专精特新", "秦楠"], lastUpdated: "2026-05-04" },

  { id: "hebei-medical-2nd", name: "河北医科大学第二医院 · 消化内科（鹿泉院区）", nameShort: "河北医大二院", location: "石家庄 · 河北 · 中国", leader: "张晓岚", title: "消化内科主任 / 炎症性肠病中心主任", category: "临床合作", region: "中国", directions: ["IBD精准菌群移植", "FMT标准化操作"], latestResult: "2025年8月鹿泉院区正式开展FMT治疗", publications: [], contact: [{ type: "电话", value: "0311-66002000", url: "tel:0311-66002000" }], website: "https://www.hb2h.com/", tags: ["公立三甲", "临床FMT", "IBD", "河北"], lastUpdated: "2026-05-04" },
  { id: "xian-jiaotong-1st", name: "西安交通大学第一附属医院 · 消化内科", nameShort: "西安交大一附院", location: "西安 · 陕西 · 中国", leader: "和水祥 / 李红霞", title: "消化内科主任 / FMT平台负责人", category: "临床合作", region: "中国", directions: ["洗涤菌群移植（WMT）", "难治性腹泻", "肠道菌群失调", "西北FMT专病门诊"], latestResult: "2024年9月开设西北地区首个FMT专病门诊；引进张发明教授WMT技术；累计完成FMT 300余例", publications: [{ pmid: "34368132", title: "粪菌移植对肠易激综合征临床疗效和肠道菌群影响", journal: "中华消化杂志", year: 2021, url: "https://rs.yiigle.com/cmaid/1308057" }], contact: [{ type: "电话", value: "029-85323240", url: "tel:029-85323240" }], website: "https://www.dyyy.xjtu.edu.cn/", tags: ["公立三甲", "临床FMT", "WMT", "西北FMT专病门诊"], lastUpdated: "2026-05-04" },
  { id: "tiantan-hospital", name: "首都医科大学附属北京天坛医院 · 消化内科", nameShort: "北京天坛医院", location: "北京 · 中国", leader: "徐有青", title: "消化内科主任", category: "临床合作", region: "中国", directions: ["肠道微生态与便秘FMT治疗", "脂肪肝/酒精性肝病"], latestResult: "2024年3月徐有青主任发布FMT治疗便秘科普内容", publications: [], contact: [{ type: "电话", value: "010-67096611", url: "tel:010-67096611" }], website: "https://www.bjtth.org/", tags: ["公立三甲", "临床FMT", "便秘"], lastUpdated: "2026-05-04" },
  { id: "fudan-zhongshan", name: "复旦大学附属中山医院 · 消化科", nameShort: "上海中山医院", location: "上海 · 中国", leader: "沈锡中", title: "消化科主任", category: "临床合作", region: "中国", directions: ["FMT治疗肠易激综合征（IBS）", "功能性肠病", "炎症性肠病"], latestResult: "2015年国内率先开展FMT治疗IBS临床研究；2021年开设肠道微生态治疗专病门诊", publications: [{ pmid: "34368132", title: "粪菌移植对肠易激综合征临床疗效和肠道菌群影响", journal: "中华消化杂志", year: 2021, url: "https://rs.yiigle.com/CN311367202101/1308057.htm" }], contact: [{ type: "电话", value: "021-64041990", url: "tel:021-64041990" }], website: "https://www.zs-hospital.sh.cn/", tags: ["公立三甲", "临床FMT", "IBS", "功能性肠病", "沈锡中", "FMT专病门诊"], lastUpdated: "2026-05-04" },
  { id: "nanchang-1st-hospital", name: "南昌大学第一附属医院 · 消化内科", nameShort: "南昌大一附院", location: "南昌 · 江西 · 中国", leader: "吕农华", title: "主任医师 / 教授 / 副院长", category: "临床合作", region: "中国", directions: ["幽门螺杆菌感染", "肠道菌群与慢性肝病", "FMT基础研究"], latestResult: "吕农华教授（中华消化学会常委、幽门螺杆菌学组组长）主持完成全国多中心研究成果", publications: [], contact: [{ type: "电话", value: "0791-88692500", url: "tel:0791-88692500" }], website: "https://www.cdyfy.com/", tags: ["公立三甲", "临床FMT", "幽门螺杆菌", "肝病", "吕农华"], lastUpdated: "2026-05-04" },
  { id: "qingdao-university-hospital", name: "青岛大学附属医院 · 消化内科", nameShort: "青大附院", location: "青岛 · 山东 · 中国", leader: "田字彬", title: "大内科主任 / 消化内科名誉科主任", category: "临床合作", region: "中国", directions: ["肠道菌群与粪菌移植（FMT）", "炎症性肠病"], latestResult: "2023年2月主办第一届肠菌移植青岛高峰论坛", publications: [], contact: [{ type: "电话", value: "0532-82911888", url: "tel:0532-82911888" }], website: "https://www.qduhospital.cn/", tags: ["公立三甲", "临床FMT", "肠菌移植论坛", "田字彬"], lastUpdated: "2026-05-04" },


];

export const teamCategories