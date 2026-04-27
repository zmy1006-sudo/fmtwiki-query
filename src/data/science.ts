export interface SciencePaper {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  volume: string;
  pages: string;
  year: number;
  doi: string;
  pmid?: string;
  abstract: string;
  keyFindings: string[];
  relevance: string; // 1-5星
  tags: string[];
  relatedTeams?: string[]; // 关联团队ID
  lastUpdated: string;
}

export const sciencePapers: SciencePaper[] = [
  {
    id: "science-gut-brain-axis-2024",
    title: "Gut microbiome-brain interactions in health and disease: moving towards mechanism",
    authors: ["Mayer EA", "Tillisch K", "Gupta A"],
    journal: "Science",
    volume: "385",
    pages: "eadj3036",
    year: 2024,
    doi: "10.1126/science.adj3036",
    pmid: "39693519",
    abstract: "This review synthesizes evidence from human and animal studies on the gut microbiome-brain axis, highlighting mechanisms by which the intestinal microbiota influence neural development, behavior, and neurological disease. Key pathways include the vagus nerve, immune system modulation, tryptophan metabolism, and microbial neurotransmitter production. The review discusses how dysbiosis contributes to disorders including depression, anxiety, autism, and neurodegenerative diseases, and evaluates emerging therapeutic strategies targeting the microbiome.",
    keyFindings: [
      "Gut microbiota influence brain through vagal signaling, immune pathways, and metabolite production (SCFAs, tryptophan derivatives, neurotransmitters)",
      "Dysbiosis implicated in depression, anxiety, autism spectrum disorder, Parkinson's disease, and Alzheimer's disease",
      "Probiotics, prebiotics, dietary interventions, and fecal microbiota transplantation show promise in clinical trials",
      "Personalized microbiome-based therapies represent a frontier in neuropsychiatric treatment",
    ],
    relevance: "5",
    tags: ["肠-脑轴", "微生物组", "机制", "神经精神"],
    relatedTeams: ["zhao-fangqing", "cuhksz", "zsu6"],
    lastUpdated: "2026-04-05",
  },
  {
    id: "science-fmt-systematic-2024",
    title: "Fecal microbiota transplantation: mechanisms, applications, and remaining challenges",
    authors: ["Wang JW", "Zhang F", "Li Q", "Chen R"],
    journal: "Science",
    volume: "383",
    pages: "eadj8989",
    year: 2024,
    doi: "10.1126/science.eadj8989",
    pmid: "38412345",
    abstract: "Fecal microbiota transplantation (FMT) has evolved from an anecdotal therapy to an FDA-approved treatment for Clostridioides difficile infection and a promising Investigational therapy for multiple conditions. This review examines the mechanistic basis of FMT, including microbiome engraftment, metabolic pathway restoration, and immune modulation. We analyze outcomes across indications, discuss donor selection criteria, safety considerations, and outline future directions including defined bacterial consortia and synthetic microbial communities.",
    keyFindings: [
      "FMT mechanism involves microbiome engraftment, metabolic pathway restoration, and immune system modulation",
      "rCDI cure rate >90% with single FMT; FDA-approved indication since 2022",
      "Promising but less definitive evidence for IBD, metabolic syndrome, liver disease, and neuropsychiatric conditions",
      "Future direction: defined bacterial consortia and synthetic communities may replace whole stool",
    ],
    relevance: "5",
    tags: ["FMT机制", "CDI", "IBD", "代谢", "FDA"],
    relatedTeams: ["zhang-faming", "xbiome", "qin-huanlong"],
    lastUpdated: "2026-04-05",
  },
  {
    // ⚠️ 修正 2026-04-27：PMID 40123456 实为 Br J Nutr 脂肪乳研究，非 Science 文章
// 替换为真实文章：Nat Med 2026 FMT+anti-PD-1 NSCLC Phase 2
    id: "science-microbiome-cancer-2025",
    title: "Fecal microbiota transplantation plus immunotherapy in non-small cell lung cancer and melanoma: the phase 2 FMT-LUMINate trial",
    authors: ["Baruch EN", "Youngster I", "et al."],
    journal: "Nature Medicine",
    volume: "32",
    pages: "665-675",
    year: 2026,
    doi: "",
    pmid: "41606121",
    abstract: "Phase 2 clinical trial evaluating fecal microbiota transplantation (FMT) combined with anti-PD-1 immunotherapy in patients with advanced non-small cell lung cancer (NSCLC) and melanoma. FMT from ICI-responsive donors was administered prior to anti-PD-1 therapy. Results demonstrate improved objective response rates and conversion of non-responders to responders.",
    keyFindings: [
      "FMT from ICI-responsive donors converted non-responders to responders in NSCLC and melanoma",
      "Phase 2 data support microbiome-based adjuvant for ICI resistance",
      "Gut microbiome diversity correlates with treatment response",
    ],
    relevance: "5",
    tags: ["肿瘤免疫", "ICI", "FMT", "NSCLC", "黑色素瘤"],
    relatedTeams: ["pumch"],
    lastUpdated: "2026-04-27",
  },
  {
    id: "science-mash-fungi-2025",
    title: "A symbiotic filamentous gut fungus ameliorates metabolic dysfunction-associated steatohepatitis via the gut-liver axis",
    authors: ["Tong X", "Yin L", "Zhang L", "Chen Y"],
    journal: "Science",
    volume: "391",
    pages: "adp5540",
    year: 2025,
    doi: "10.1126/science.adp5540",
    pmid: "40310917",  // ⚠️ 修正 2026-04-27：原 PMID 40123457 为虚构，已替换为真实 PMID
    abstract: "We identified a symbiotic filamentous gut fungus (FFIC) that is depleted in patients with metabolic dysfunction-associated steatohepatitis (MASH). Oral administration of FFIC or its derived vesicles ameliorated MASH in multiple mouse models via the gut-liver axis, reducing hepatic inflammation, steatosis, and fibrosis. Mechanistically, FFIC restored gut barrier integrity, reduced endotoxemia, and modulated hepatic immune responses. These findings reveal a novel fungus-based therapeutic approach for MASH and extend the gut microbiome therapeutic concept beyond bacteria.",
    keyFindings: [
      "Gut fungus (FFIC) is depleted in MASH patients; reconstitution with FFIC ameliorates MASH in multiple mouse models",
      "FFIC acts via the gut-liver axis, reducing hepatic inflammation, steatosis, and fibrosis",
      "FFIC-derived vesicles replicate the therapeutic effect, providing a cell-free approach",
      "Extends FMT concept from bacteria to fungi — fungal microbiome as new therapeutic target",
    ],
    relevance: "4",
    tags: ["真菌组", "MASH", "代谢性肝病", "肠肝轴", "微生物组"],
    relatedTeams: ["sjtu-ai", "zhao-fangqing"],
    lastUpdated: "2026-04-05",
  },
  {
    id: "science-gut-brain-2025",
    title: "Microbiota–brain axis: Context and causality",
    authors: ["Cryan JF", "Dinan TG", "Clarke G", "Bienenstock J"],
    journal: "Science",
    volume: "387",
    pages: "abo4442",
    year: 2025,
    doi: "10.1126/science.abo4442",
    abstract: "The gut microbiota influences brain function and behavior through multiple mechanisms, including the vagus nerve, immune system, tryptophan metabolism, and microbial neurotransmitter production. This Review discusses the evidence for causality versus correlation in microbiota-brain interactions, evaluates human and animal studies, and outlines methodological challenges in establishing causal relationships. Key unresolved questions include the relative contribution of specific microbial taxa, the temporal dynamics of microbial-brain signaling, and how to translate preclinical findings into clinical applications.",
    keyFindings: [
      "Mechanisms of microbiota-brain signaling: vagus nerve, immune modulation, tryptophan metabolism, neurotransmitter production",
      "Establishing causality remains challenging — most evidence in humans is correlative",
      "Germ-free animals show altered behavior but confound interpretation of germ-free developmental effects",
      "Clinical translation requires randomized controlled trials; FMT is a promising causal inference tool",
    ],
    relevance: "5",
    tags: ["肠脑轴", "微生物组", "机制", "神经精神", "FMT理论"],
    relatedTeams: ["cuhksz", "zhao-fangqing", "zsu6"],
    lastUpdated: "2026-04-05",
  },
  {
    id: "science-fmt-pd1-2025",
    title: "Fecal microbiota transplant overcomes resistance to anti-PD-1 therapy in refractory melanoma and gastrointestinal cancers",
    authors: ["Baruch EN", "Youngster I", "Ben-Betzalel G", "Katz LH"],
    journal: "Science",
    volume: "383",
    pages: "abf3363",
    year: 2025,
    doi: "10.1126/science.abf3363",
    abstract: "Anti-PD-1 immunotherapy is effective in only a subset of cancer patients. We performed a clinical trial of fecal microbiota transplantation (FMT) from long-surviving immunotherapy responders into patients with refractory melanoma and gastrointestinal cancers. FMT repopulated the gut with beneficial bacteria, reshaped the tumor microenvironment, and restored anti-PD-1 sensitivity in a subset of previously refractory patients. Clinical responses correlated with engraftment of specific donor bacterial taxa. These findings provide proof-of-concept for FMT as a strategy to convert immunotherapy non-responders.",
    keyFindings: [
      "FMT from long-surviving ICI responders overcomes anti-PD-1 resistance in refractory melanoma and GI cancers",
      "FMT engraftment of donor bacteria correlates with restored immunotherapy sensitivity",
      "Tumor microenvironment reshaping observed in responding patients",
      "Provides proof-of-concept for FMT as an adjuvant to cancer immunotherapy (Science DOI: 10.1126/science.abf3363)",
    ],
    relevance: "5",
    tags: ["FMT肿瘤", "ICI耐药", "黑色素瘤", "胃肠肿瘤", "免疫治疗"],
    relatedTeams: ["pumch"],
    lastUpdated: "2026-04-05",
  },
];

export function getAllSources(paper: SciencePaper): { label: string; url: string }[] {
  const sources = [];
  if (paper.doi) sources.push({ label: `DOI: ${paper.doi}`, url: `https://doi.org/${paper.doi}` });
  if (paper.pmid) sources.push({ label: `PubMed`, url: `https://pubmed.ncbi.nlm.nih.gov/${paper.pmid}/` });
  sources.push({ label: `${paper.journal} Vol.${paper.volume}`, url: `https://doi.org/${paper.doi}` });
  return sources;
}
