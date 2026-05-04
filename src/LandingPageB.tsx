import { useState, useEffect, useRef, useCallback } from 'react';

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useCountUp(target: number, duration = 1800, start = true) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, start]);
  return count;
}

// ─── StatCard ────────────────────────────────────────────────────────────────

function StatCard({ value, label, sublabel, color = 'blue' }: {
  value: number; label: string; sublabel?: string; color?: string;
}) {
  const { ref, inView } = useInView();
  const count = useCountUp(value, 1800, inView);

  const colorMap: Record<string, { border: string; bg: string; text: string; bar: string }> = {
    blue:   { border: 'border-blue-500/40',    bg: 'bg-blue-500/10',    text: 'text-blue-400',    bar: 'bg-blue-500'    },
    purple: { border: 'border-purple-500/40',  bg: 'bg-purple-500/10',  text: 'text-purple-400',  bar: 'bg-purple-500'  },
    green:  { border: 'border-emerald-500/40', bg: 'bg-emerald-500/10', text: 'text-emerald-400', bar: 'bg-emerald-500' },
    amber:  { border: 'border-amber-500/40',    bg: 'bg-amber-500/10',   text: 'text-amber-400',   bar: 'bg-amber-500'   },
  };
  const c = colorMap[color] ?? colorMap.blue;

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-2xl border ${c.border} ${c.bg} p-6 backdrop-blur-sm transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className={`text-5xl font-black ${c.text} tabular-nums mb-1`}>{count}</div>
      <div className="text-white font-bold text-sm">{label}</div>
      {sublabel && <div className="text-gray-500 text-xs mt-0.5">{sublabel}</div>}
      <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full ${c.bar} rounded-full transition-all duration-1000`}
          style={{ width: inView ? `${60 + Math.random() * 40}%` : '0%' }}
        />
      </div>
    </div>
  );
}

// ─── TimelineItem ────────────────────────────────────────────────────────────

function TimelineItem({ disease, pmid, journal, year, oxford, grade, highlight }: {
  disease: string; pmid: string; journal: string; year: string;
  oxford: string; grade: string; highlight?: boolean;
}) {
  const { ref, inView } = useInView(0.3);
  const gradeColors: Record<string, string> = {
    A: 'bg-green-500',
    B: 'bg-blue-500',
    C: 'bg-amber-500',
    D: 'bg-red-500',
  };
  return (
    <div
      ref={ref}
      className={`flex-shrink-0 w-72 rounded-2xl border border-white/10 p-5 transition-all duration-700 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'} ${highlight ? 'bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-blue-500/30' : 'bg-white/5'}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-white font-black text-sm">{disease}</div>
        <div className={`w-6 h-6 rounded-full ${gradeColors[grade] || 'bg-gray-500'} flex items-center justify-center text-white text-xs font-bold`}>
          {grade}
        </div>
      </div>
      <div className="text-xs text-gray-500 mb-1">{journal} · {year}</div>
      <div className="text-xs text-gray-400 mb-3">Oxford {oxford} · PMID {pmid}</div>
      {highlight && <div className="text-xs text-blue-400">⭐ 核心证据</div>}
    </div>
  );
}

// ─── ForceGraph ──────────────────────────────────────────────────────────────

interface GraphNode {
  id: string;
  label: string;
  type: 'team' | 'disease' | 'ai';
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

function ForceGraph({ width = 700, height = 420 }: { width?: number; height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<GraphNode[]>([]);
  const hoveredRef = useRef<string | null>(null);
  const animFrameRef = useRef<number>(0);

  const initNodes = useCallback((): GraphNode[] => {
    const cx = width / 2, cy = height / 2;
    const nodes: GraphNode[] = [];

    nodes.push({ id: 'fmtwiki', label: 'FMTWiki', type: 'disease', x: cx, y: cy, vx: 0, vy: 0, radius: 28, color: '#ffffff' });

    const teams = [
      { id: 'zhang',   label: '南医大二附院',    color: '#60a5fa' },
      { id: 'zhao',    label: '中科院动物所',    color: '#a78bfa' },
      { id: 'qin',     label: '苏州市立医院',    color: '#34d399' },
      { id: 'xbiome',  label: '深圳未知君',      color: '#fbbf24' },
      { id: 'pumch',   label: '北京协和医院',   color: '#f87171' },
      { id: 'zsu6',    label: '中山六院',        color: '#22d3ee' },
      { id: 'sjtu',    label: '上交微生物国重', color: '#c084fc' },
      { id: 'cuhksz',    label: '港中深',          color: '#fb923c' },
      { id: 'sh-renji',  label: '上海仁济医院',     color: '#f472b6' },
      { id: 'sh-zs',     label: '上海中山医院',     color: '#fb923c' },
      { id: 'pla-301',   label: '北京301医院',      color: '#a78bfa' },
      { id: 'xijing',    label: '西京医院',         color: '#34d399' },
      { id: 'westchina', label: '华西医院',         color: '#60a5fa' },
      { id: 'zs-1st',    label: '中山大一附院',     color: '#facc15' },
      { id: 'xjtufmt',   label: '西安交大一附院',   color: '#22d3ee' },
    ];
    teams.forEach((t, i) => {
      const angle = (i / teams.length) * Math.PI * 2;
      const r = 155;
      nodes.push({ id: t.id, label: t.label, type: 'team', x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r, vx: 0, vy: 0, radius: 14, color: t.color });
    });

    const diseases = [
      { id: 'rcdi', label: '复发性 CDI',  color: '#4ade80' },
      { id: 'uc',   label: '溃疡性结肠炎', color: '#60a5fa' },
      { id: 'cd',   label: '克罗恩病',     color: '#f472b6' },
      { id: 'asd',  label: '自闭症',       color: '#facc15' },
      { id: 'mdro', label: '耐药菌感染',   color: '#e879f9' },
    ];
    diseases.forEach((d, i) => {
      const angle = (i / diseases.length) * Math.PI * 2 + 0.3;
      const r = 85;
      nodes.push({ id: d.id, label: d.label, type: 'disease', x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r, vx: 0, vy: 0, radius: 11, color: d.color });
    });

    return nodes;
  }, [width, height]);

  const edges: [string, string][] = [
    ['fmtwiki', 'zhang'],  ['fmtwiki', 'rcdi'],  ['fmtwiki', 'uc'],
    ['zhang',   'rcdi'],   ['zhang',   'cd'],
    ['qin',     'uc'],     ['qin',     'cd'],
    ['pumch',   'uc'],     ['pumch',   'rcdi'],
    ['zsu6',    'cd'],     ['zsu6',    'rcdi'],
    ['sjtu',    'rcdi'],
    ['xbiome',  'rcdi'],
    ['cuhksz',  'asd'],
    ['zhao',    'mdro'],
    ['fmtwiki', 'mdro'],  ['fmtwiki', 'asd'],   ['fmtwiki', 'cd'],
  ];

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    nodesRef.current = initNodes();

    const getMousePos = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseMove = (e: MouseEvent) => {
      const pos = getMousePos(e);
      hoveredRef.current = null;
      for (const node of nodesRef.current) {
        const dx = pos.x - node.x, dy = pos.y - node.y;
        if (Math.sqrt(dx * dx + dy * dy) < node.radius + 5) {
          hoveredRef.current = node.id;
          canvas.style.cursor = 'pointer';
          break;
        }
      }
      if (!hoveredRef.current) canvas.style.cursor = 'default';
    };
    const onClick = (e: MouseEvent) => {
      const pos = getMousePos(e);
      for (const node of nodesRef.current) {
        const dx = pos.x - node.x, dy = pos.y - node.y;
        if (Math.sqrt(dx * dx + dy * dy) < node.radius + 5) {
          node.vx += (Math.random() - 0.5) * 8;
          node.vy += (Math.random() - 0.5) * 8;
        }
      }
    };
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('click', onClick);

    const ALPHA = 0.08, REPULSION = 3000, CENTER = 0.015, DAMPING = 0.88;
    const tick = () => {
      const nodes = nodesRef.current;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          let dx = b.x - a.x, dy = b.y - a.y, dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = REPULSION / (dist * dist);
          const fx = (dx / dist) * force, fy = (dy / dist) * force;
          a.vx -= fx * ALPHA; a.vy -= fy * ALPHA;
          b.vx += fx * ALPHA; b.vy += fy * ALPHA;
        }
      }

      const cx = width / 2, cy = height / 2;
      for (const node of nodes) {
        if (node.id === 'fmtwiki') continue;
        node.vx += (cx - node.x) * CENTER * ALPHA;
        node.vy += (cy - node.y) * CENTER * ALPHA;
      }

      for (const node of nodes) {
        node.vx *= DAMPING; node.vy *= DAMPING;
        node.x += node.vx; node.y += node.vy;
        node.x = Math.max(node.radius, Math.min(width  - node.radius, node.x));
        node.y = Math.max(node.radius, Math.min(height - node.radius, node.y));
      }

      ctx.clearRect(0, 0, width, height);

      for (const [a, b] of edges) {
        const na = nodes.find(n => n.id === a)!;
        const nb = nodes.find(n => n.id === b)!;
        const isHovered = hoveredRef.current === a || hoveredRef.current === b;
        ctx.strokeStyle = isHovered ? 'rgba(148,163,184,0.6)' : 'rgba(148,163,184,0.15)';
        ctx.lineWidth = isHovered ? 1.5 : 0.5;
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.stroke();
      }

      for (const node of nodes) {
        const isHovered = hoveredRef.current === node.id;
        const r = isHovered ? node.radius * 1.3 : node.radius;

        if (node.id !== 'fmtwiki') {
          const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 2.5);
          glow.addColorStop(0, node.color + '40');
          glow.addColorStop(1, 'transparent');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(node.x, node.y, r * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = node.id === 'fmtwiki'
          ? '#ffffff'
          : (node.type === 'team' ? node.color + 'cc' : node.color + '99');
        ctx.fill();

        if (isHovered || node.id === 'fmtwiki') {
          ctx.font = `${node.id === 'fmtwiki' ? 'bold 11px' : '10px'} sans-serif`;
          ctx.fillStyle = '#e2e8f0';
          ctx.textAlign = 'center';
          ctx.fillText(node.label, node.x, node.y + r + 14);
        }
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('click', onClick);
    };
  }, [initNodes, width, height]);

  return (
    <div className="relative">
      <div className="absolute top-3 left-3 z-10 bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs text-gray-400">
        🎯 点击节点产生冲击波 · 悬浮查看标签
      </div>
      <canvas ref={canvasRef} width={width} height={height} className="w-full rounded-2xl" />
    </div>
  );
}

// ─── AIMatrixCard ────────────────────────────────────────────────────────────

function AIMatrixCard({ emoji, title, tag, desc, score }: {
  emoji: string; title: string; tag: string; desc: string; score?: string;
}) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="perspective-1000 cursor-pointer h-36" onClick={() => setFlipped(!flipped)}>
      <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}>
        {/* 正面 */}
        <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-between backface-hidden">
          <div className="flex items-start justify-between">
            <span className="text-2xl">{emoji}</span>
            <span className="text-xs px-2 py-0.5 bg-white/10 rounded-full text-gray-400">{tag}</span>
          </div>
          <div>
            <div className="text-white font-bold text-sm mb-0.5">{title}</div>
            <div className="text-xs text-gray-500">点击翻转查看详情 →</div>
          </div>
        </div>
        {/* 反面 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-purple-900/80 border border-blue-500/30 rounded-xl p-4 flex flex-col justify-center backface-hidden rotate-y-180">
          <div className="text-white font-bold text-sm mb-2">{title}</div>
          <div className="text-xs text-gray-300 leading-relaxed">{desc}</div>
          {score && <div className="text-xs text-blue-300 mt-2 font-mono">{score}</div>}
        </div>
      </div>
    </div>
  );
}

// ─── Section Components ─────────────────────────────────────────────────────

function HeroDashboard() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard value={14} label="FMT 适应证"    sublabel="循证分级覆盖"   color="blue"   />
      <StatCard value={21} label="研究团队"       sublabel="覆盖全国+港澳"  color="purple" />
      <StatCard value={11} label="AI×FMT 应用"   sublabel="配型·预测·肠型" color="green"  />
      <StatCard value={35} label="患者科普文章"   sublabel="通俗易懂"      color="amber"  />
    </div>
  );
}

function EvidenceSection() {
  const items = [
    { disease: '复发性 CDI',  pmid: '23323867', journal: 'NEJM',                year: '2013', oxford: '1b', grade: 'A', highlight: true },
    { disease: '溃疡性结肠炎', pmid: '28214091', journal: 'Lancet',               year: '2017', oxford: '1b', grade: 'B', highlight: true },
    { disease: '克罗恩病',     pmid: '32014035', journal: 'Microbiome',            year: '2020', oxford: '2b', grade: 'C' },
    { disease: '自闭症 ASD',  pmid: '28122648', journal: 'Microbiome',            year: '2017', oxford: '4',  grade: 'C' },
    { disease: '耐药菌 MDRO', pmid: '30986562', journal: 'Clin Microbiol Infect', year: '2019', oxford: '1a', grade: 'B' },
    { disease: 'NAFLD 脂肪肝',pmid: '32618656', journal: 'Am J Gastroenterol',    year: '2020', oxford: '2b', grade: 'C' },
    { disease: '帕金森病',     pmid: '27912077', journal: 'Cell',                  year: '2016', oxford: '5',  grade: 'C' },
    { disease: '便秘',         pmid: '31994479', journal: 'JGH',                   year: '2020', oxford: '2b', grade: 'C' },
  ];
  return (
    <div className="overflow-x-auto pb-4 -mx-4 px-4">
      <div className="flex gap-4 w-max">
        {items.map((item, i) => (
          <div key={i} style={{ animationDelay: `${i * 80}ms` }}>
            <TimelineItem {...item} />
          </div>
        ))}
      </div>
    </div>
  );
}

function AISection() {
  const apps = [
    { emoji: '🧬', title: 'MOZAIC 配型',   tag: 'AI 配型',    desc: '供体-受体肠道菌群匹配，FMT-CDI治疗成功率>90%，预测精准度领先全球同类工具',     score: 'CDI 准确率 >90%' },
    { emoji: '📊', title: 'C2R 定植预测',  tag: 'AI 预测',    desc: '预测 FMT 后肠道菌群定植效果，AUROC=0.801，辅助个体化剂量决策',                   score: 'AUROC = 0.801'  },
    { emoji: '🔬', title: 'EDS 肠型分类',  tag: '肠型分析',   desc: 'Enterotype Distribution Score，IBD 肠型分型准确率从57.1%提升至93.3%',           score: '93.3% 准确率'   },
    { emoji: '💊', title: 'Seres SER-287', tag: '临床管线',   desc: 'Seres Therapeutics 主导的微生物组疗法，已进入 III 期临床试验'                        },
    { emoji: '🏥', title: 'OpenBiome 银行',tag: '标准菌群库', desc: '全球最大粪菌库，为FDA批准的多项临床试验提供标准化菌群制剂'                          },
    { emoji: '🤖', title: 'FMT-DRM 决策',  tag: 'AI 决策',    desc: 'Cell 2025最新研究，基于深度强化学习的 FMT 个体化给药决策系统',                   score: 'Cell 2025'       },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {apps.map((app, i) => <AIMatrixCard key={i} {...app} />)}
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export function LandingPageB({ onEnterDoctor, onEnterPatient, onEnterLandingC }: {
  onEnterDoctor: () => void; onEnterPatient: () => void; onEnterLandingC: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#050d1a] text-white overflow-x-hidden">

      {/* 背景装饰 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5  rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      {/* ── Section 0: Hero Dashboard ── */}
      <section className="relative z-10 px-4 pt-20 pb-12">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm text-blue-400 mb-6">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            Effect B · 数据驱动 · 交互可视
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
            <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              FMTWiki 知识库
            </span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
            首个肠菌移植垂直领域知识库<br />
            21个研究团队 · 19个AI应用 · 14个适应证 · 循证分级全覆盖
          </p>
          <HeroDashboard />
        </div>
      </section>

      {/* ── Section 1: Evidence Timeline ── */}
      <section className="relative z-10 px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <div className="text-xs text-blue-400 font-mono uppercase tracking-widest mb-1">Evidence Timeline</div>
            <h2 className="text-2xl font-black text-white">循证分级 · 有据可查</h2>
            <p className="text-gray-500 text-xs mt-1">PMID 直连 PubMed · GRADE 可信度评级</p>
          </div>
          <EvidenceSection />
        </div>
      </section>

      {/* ── Section 2: Team Network Graph ── */}
      <section className="relative z-10 px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <div className="text-xs text-purple-400 font-mono uppercase tracking-widest mb-1">Knowledge Graph</div>
            <h2 className="text-2xl font-black text-white">研究团队 · 关系网络</h2>
            <p className="text-gray-500 text-xs mt-1">力学模拟 · 悬浮查看 · 点击产生冲击波</p>
          </div>
          <div className="bg-white/3 border border-white/10 rounded-2xl p-4">
            <ForceGraph width={700} height={420} />
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-white"    /><span>中心节点</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-400" /><span>研究团队</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-green-400"/><span>适应证</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-yellow-400"/><span>AI应用</span></div>
          </div>
        </div>
      </section>

      {/* ── Section 3: AI Matrix ── */}
      <section className="relative z-10 px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <div className="text-xs text-emerald-400 font-mono uppercase tracking-widest mb-1">AI Applications</div>
            <h2 className="text-2xl font-black text-white">AI × FMT 应用矩阵</h2>
            <p className="text-gray-500 text-xs mt-1">点击卡片翻转 · 查看技术详情</p>
          </div>
          <AISection />
        </div>
      </section>

      {/* ── Section 4: Patient Portal ── */}
      <section className="relative z-10 px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-white">患者科普 · 通俗易懂</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { emoji: '🦠', title: 'FMT 前世今生', desc: '什么是肠菌移植？历史、原理、安全性' },
              { emoji: '💰', title: '费用与医保',   desc: '全国主要城市费用参考，医保政策'      },
              { emoji: '🏥', title: '就诊地图',     desc: '全国10家FMT主要医院一键导航'           },
            ].map((item, i) => (
              <div key={i} className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer">
                <div className="text-3xl mb-3">{item.emoji}</div>
                <div className="text-white font-bold text-sm mb-1">{item.title}</div>
                <div className="text-gray-400 text-xs">{item.desc}</div>
                <div className="text-xs text-blue-400 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">点击进入 →</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5: CTA ── */}
      <section className="relative z-10 px-4 pb-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-white/10 rounded-3xl p-10">
            <h2 className="text-2xl font-black text-white mb-3">开始探索 FMT 知识库</h2>
            <p className="text-gray-400 text-sm mb-8">由 Minimax Agent AI 驱动 · M-DQA 双代理质量审查</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onEnterDoctor}
                className="px-7 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-sm transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
              >
                👨‍⚕️ 进入医生端
              </button>
              <button
                onClick={onEnterPatient}
                className="px-7 py-4 bg-white/10 border border-white/20 hover:bg-white/20 text-white rounded-2xl font-bold text-sm transition-all hover:scale-105 backdrop-blur-md"
              >
                👤 进入患者端
              </button>
              <button
                onClick={onEnterLandingC}
                className="px-7 py-4 bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600/30 text-emerald-400 rounded-2xl font-bold text-sm transition-all hover:scale-105"
              >
                🧬 Effect C
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
