import { useEffect, useRef, useState } from 'react';

interface Props {
  onEnterDoctor: () => void;
  onEnterPatient: () => void;
}

// ─────────────────────────────────────────────────────────────────
// ParticleCanvas — 宇宙粒子背景 (Effect A 同款)
// ─────────────────────────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let animId: number;

    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    const N = 110, CONNECT = 130;
    type P = { x: number; y: number; vx: number; vy: number; r: number; color: string; op: number };
    const ps: P[] = Array.from({ length: N }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.55,
      vy: (Math.random() - 0.5) * 0.55,
      r: Math.random() * 2 + 1,
      color: ['#3B82F6', '#8B5CF6', '#00D1FF', '#A855F7', '#06B6D4'][Math.floor(Math.random() * 5)],
      op: Math.random() * 0.45 + 0.12,
    }));

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = ps[i].x - ps[j].x, dy = ps[i].y - ps[j].y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECT) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100,180,255,${(1 - d / CONNECT) * 0.18})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(ps[i].x, ps[i].y);
            ctx.lineTo(ps[j].x, ps[j].y);
            ctx.stroke();
          }
        }
      }
      for (const p of ps) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.op;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-10" />;
}

// ─────────────────────────────────────────────────────────────────
// CounterCard — 数字动画计数器 (Effect A 同款结构)
// ─────────────────────────────────────────────────────────────────
function CounterCard({ value, label, suffix = '', color = 'blue' }: {
  value: number; label: string; suffix?: string; color?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const dur = 1600, s = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - s) / dur, 1);
      const ease = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setCount(Math.floor(ease * value));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value, inView]);

  const map: Record<string, string> = {
    blue: 'from-blue-400 to-cyan-400', purple: 'from-purple-400 to-pink-400',
    green: 'from-emerald-400 to-teal-400', amber: 'from-amber-400 to-orange-400',
    rose: 'from-rose-400 to-red-400', cyan: 'from-cyan-400 to-blue-400',
  };

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className={`text-5xl font-black bg-gradient-to-r ${map[color ?? 'blue']} bg-clip-text text-transparent tabular-nums`}>
        {count}{suffix}
      </div>
      <div className="text-sm text-gray-400 mt-1 text-center">{label}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// GlassCard — 玻璃态功能卡片 (Effect A 同款)
// ─────────────────────────────────────────────────────────────────
function GlassCard({ emoji, title, desc, tags, delay = 0, accent = 'blue' }: {
  emoji: string; title: string; desc: string; tags: string[]; delay?: number; accent?: string;
}) {
  const accentMap: Record<string, string> = {
    blue: 'hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]',
    cyan: 'hover:shadow-[0_0_40px_rgba(6,182,212,0.15)]',
    violet: 'hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]',
    green: 'hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]',
    amber: 'hover:shadow-[0_0_40px_rgba(245,158,11,0.15)]',
    red: 'hover:shadow-[0_0_40px_rgba(244,63,94,0.15)]',
  };
  const glowMap: Record<string, string> = {
    blue: 'from-blue-500/20 to-purple-500/20',
    cyan: 'from-cyan-500/20 to-blue-500/20',
    violet: 'from-violet-500/20 to-purple-500/20',
    green: 'from-emerald-500/20 to-teal-500/20',
    amber: 'from-amber-500/20 to-orange-500/20',
    red: 'from-rose-500/20 to-red-500/20',
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl p-5 border border-white/10 bg-white/5 backdrop-blur-md
                 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] ${accentMap[accent]}
                 animate-slide-up`}
      style={{ animationDelay: `${delay}ms`, opacity: 0 }}
    >
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${glowMap[accent]} rounded-bl-full`} />
      <div className="text-3xl mb-3">{emoji}</div>
      <h3 className="text-white font-bold text-base mb-1">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-3">{desc}</p>
      <div className="flex flex-wrap gap-1.5">
        {tags.map(tag => (
          <span key={tag} className="px-2 py-0.5 bg-white/10 rounded-full text-xs text-gray-300">{tag}</span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// EvidenceBar — 证据等级可视化 (Effect D 升级版)
// ─────────────────────────────────────────────────────────────────
function EvidenceBar() {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const items = [
    { ox: '1b', grade: 'A', label: '复发性CDI', sub: 'van Nood NEJM 2013', color: 'bg-emerald-500', w: 98 },
    { ox: '1b', grade: 'B', label: '溃疡性结肠炎UC', sub: 'Lancet 2017', color: 'bg-blue-500', w: 88 },
    { ox: '2b', grade: 'C', label: '克罗恩病CD', sub: 'Microbiome 2020', color: 'bg-amber-500', w: 72 },
    { ox: '4', grade: 'C', label: '自闭症ASD', sub: 'Microbiome 2017', color: 'bg-orange-500', w: 52 },
    { ox: '5', grade: 'D', label: '帕金森(临床前)', sub: 'Cell 2016', color: 'bg-red-500/70', w: 30 },
  ];

  return (
    <div ref={ref} className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500 font-mono">Oxford · GRADE</span>
        <span className="text-xs text-emerald-400/70">PMID 100% 可溯源</span>
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: `${i * 120}ms`, opacity: 0 }}>
          <div className="w-16 text-right text-xs font-mono text-gray-500 shrink-0">{item.ox} · G{item.grade}</div>
          <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${item.color} transition-all duration-1000`}
              style={{ width: inView ? `${item.w}%` : '0%', transitionDelay: `${i * 150 + 300}ms` }}
            />
          </div>
          <div className="w-36 shrink-0">
            <div className="text-xs text-gray-300">{item.label}</div>
            <div className="text-[10px] text-gray-600">{item.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// GradeGrid — GRADE 四宫格 (Effect D 新增)
// ─────────────────────────────────────────────────────────────────
function GradeGrid() {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const grades = [
    { g: 'A', l: '高', d: '非常确信真实效应接近估计值', c: 'border-emerald-400/30', bg: 'bg-emerald-400/10', t: 'text-emerald-400' },
    { g: 'B', l: '中', d: '对效应估计有中等信心', c: 'border-blue-400/30', bg: 'bg-blue-400/10', t: 'text-blue-400' },
    { g: 'C', l: '低', d: '对效应估计信心有限', c: 'border-amber-400/30', bg: 'bg-amber-400/10', t: 'text-amber-400' },
    { g: 'D', l: '极低', d: '真实效应可能截然不同', c: 'border-white/10', bg: 'bg-white/5', t: 'text-white/40' },
  ];

  return (
    <div ref={ref} className="grid grid-cols-2 gap-3">
      {grades.map((g, i) => (
        <div key={g.g}
          className={`rounded-xl border ${g.c} ${g.bg} p-4 transition-all duration-500 animate-slide-up ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          style={{ animationDelay: `${i * 100 + 600}ms`, opacity: 0 }}
        >
          <div className="flex items-baseline gap-1.5 mb-1.5">
            <span className={`text-3xl font-black ${g.t}`}>{g.g}</span>
            <span className={`text-sm font-bold ${g.t}`}>{g.l}</span>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed">{g.d}</p>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// PortalCard — 全宽双门户卡片 (Effect D 新增)
// ─────────────────────────────────────────────────────────────────
function PortalCard({ icon, title, role, desc, items, cta, bgGrad, borderColor, btnStyle, delay, onEnter }: {
  icon: string; title: string; role: string; desc: string; items: { icon: string; title: string; desc: string }[];
  cta: string; bgGrad: string; borderColor: string; btnStyle: string; delay: number; onEnter: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref}
      className={`relative overflow-hidden rounded-3xl border ${borderColor} transition-all duration-700 animate-slide-up ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ animationDelay: `${delay}ms`, opacity: 0 }}
    >
      <div className={`absolute inset-0 ${bgGrad}`} />
      <div className="relative z-10 p-8 md:p-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left column */}
          <div className="md:w-64 shrink-0">
            <div className="flex items-center gap-3 mb-5">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${borderColor.replace('border-', 'bg-').replace('/20', '/15')}`}>{icon}</div>
              <div>
                <div className={`text-xs font-bold tracking-[0.15em] uppercase ${borderColor.includes('cyan') ? 'text-cyan-400/70' : 'text-emerald-400/70'}`}>{role}</div>
                <div className="text-white font-black text-2xl">{title}</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">{desc}</p>
            <button onClick={onEnter}
              className={`w-full rounded-xl py-3 font-bold text-sm transition-all duration-300 hover:-translate-y-0.5 text-center ${btnStyle}`}
            >
              {cta}
            </button>
          </div>
          {/* Right: feature grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {items.map(f => (
              <div key={f.title} className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/4 p-4">
                <span className="text-xl shrink-0">{f.icon}</span>
                <div>
                  <div className="text-white/80 text-sm font-semibold mb-0.5">{f.title}</div>
                  <div className="text-white/30 text-xs leading-relaxed">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────
export default function LandingPageE({ onEnterDoctor, onEnterPatient }: Props) {
  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ background: '#050d1a' }}>

      {/* Particle background */}
      <ParticleCanvas />

      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-[#050d1a]/60 to-[#050d1a] pointer-events-none -z-5" />

      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/8 px-5 py-2 mb-10 backdrop-blur-sm animate-slide-up" style={{ animationDelay: '50ms', opacity: 0 }}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-blue-300 text-xs font-bold tracking-[0.2em] uppercase">循证 · 精准 · 持续进化</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight animate-slide-up" style={{ animationDelay: '120ms', opacity: 0 }}>
          <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            肠菌移植
          </span>
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            循证医学平台
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-400 text-base mb-4 max-w-xl leading-relaxed animate-slide-up" style={{ animationDelay: '200ms', opacity: 0 }}>
          面向临床医生的 FMT 垂直领域知识平台<br />
          循证优先 · 来源100%可溯源 · 整合 FMTWiki 知识库与 DeepFMT 诊疗系统
        </p>

        {/* Philosophy Quote */}
        <p className="text-blue-300/60 text-xs italic mb-10 max-w-lg animate-slide-up" style={{ animationDelay: '260ms', opacity: 0 }}>
          以菌为药，重建微生态平衡；循证为基，守护肠道健康。<br />
          FMT 不仅是技术的革新，更是医学回归自然的哲学实践。
        </p>

        {/* Counters */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 mb-14 w-full max-w-3xl animate-slide-up" style={{ animationDelay: '280ms', opacity: 0 }}>
          <CounterCard value={15} label="适应证" color="blue" />
          <CounterCard value={22} label="研究团队" color="purple" />
          <CounterCard value={10} label="AI应用" color="green" />
          <CounterCard value={98} label="核心文献" color="cyan" />
          <CounterCard value={37} label="患者科普" color="amber" />
          <CounterCard value={100} label="可溯源率%" suffix="%" color="rose" />
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '400ms', opacity: 0 }}>
          <button onClick={onEnterDoctor}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-base
                       transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(37,99,235,0.5)]
                       flex items-center gap-2">
            <span>👨‍⚕️</span> 进入医生端 <span>→</span>
          </button>
          <button onClick={onEnterPatient}
            className="px-8 py-4 bg-white/10 border border-white/20 hover:bg-white/20 text-white rounded-2xl font-bold text-base
                       transition-all hover:scale-105 backdrop-blur-md flex items-center gap-2">
            <span>👤</span> 进入患者端 <span>→</span>
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          EVIDENCE SECTION
      ═══════════════════════════════════════════ */}
      <div className="relative z-10 px-4 py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/5 px-4 py-1.5 mb-4">
              <span className="text-blue-400/70 text-xs font-bold tracking-[0.2em] uppercase">Evidence System</span>
            </div>
            <h2 className="text-3xl font-black text-white mb-2">双标签循证分级</h2>
            <p className="text-gray-400 text-sm">Oxford 研究设计分级 × GRADE 质量信心评级，所有结论可溯源至原始文献</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Oxford side */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">📋</span>
                <div>
                  <div className="text-blue-300 font-bold text-sm">Oxford 证据分级</div>
                  <div className="text-gray-500 text-xs">研究设计可靠程度</div>
                </div>
              </div>
              <EvidenceBar />
            </div>

            {/* GRADE side */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">🎯</span>
                <div>
                  <div className="text-violet-300 font-bold text-sm">GRADE 质量信心</div>
                  <div className="text-gray-500 text-xs">对真实效应估计的确信程度</div>
                </div>
              </div>
              <GradeGrid />
              <div className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4">
                <p className="text-cyan-300/90 text-xs font-bold mb-1">🔗 PMID 100% 可溯源</p>
                <p className="text-gray-400 text-xs">每个证据等级对应真实 PubMed 文献，可点击直接跳转验证</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          CAPABILITY CARDS
      ═══════════════════════════════════════════ */}
      <div className="relative z-10 px-4 pb-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white mb-2">不只是知识库</h2>
            <p className="text-gray-400 text-sm">从文献检索到临床决策支持的全链路工具集</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <GlassCard emoji="🧬" title="精准适应证查询" desc="14种FMT适应证，含剂量、疗程、给药途径、禁忌证，附完整临床方案与循证依据。" tags={['rCDI', 'UC', 'CD', 'ASD', 'IBS', '+9']} delay={0} accent="blue" />
            <GlassCard emoji="🔬" title="循证文献追踪" desc="PubMed + Science 期刊自动追踪，支持每周/每日定时推送最新研究进展。" tags={['PubMed', 'Science', '定时任务']} delay={80} accent="violet" />
            <GlassCard emoji="🤖" title="AI 临床问答" desc="基于 GLM 大模型，输入患者症状与指标，返回循证建议与分级来源。" tags={['RAG', 'GLM API', '来源溯源']} delay={160} accent="cyan" />
            <GlassCard emoji="⚕️" title="临床决策树" desc="15节点 FMT 临床决策树，覆盖适应证评估→方案选择→知情同意→随访管理全流程。" tags={['流程可视化', 'PMID溯源']} delay={240} accent="green" />
            <GlassCard emoji="👥" title="研究团队地图" desc="国内21个核心FMT研究团队，含机构信息、研究方向、主要研究者与联系方式。" tags={['21机构', '研究方向', 'PI信息']} delay={320} accent="amber" />
            <GlassCard emoji="📰" title="患者科普中心" desc="35篇通俗科普文，覆盖适应证、治疗流程、医保政策、知情同意、日常管理。" tags={['通俗语言', '医保政策', '知情同意']} delay={400} accent="rose" />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          DUAL PORTAL CARDS
      ═══════════════════════════════════════════ */}
      <div className="relative z-10 px-4 pb-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/5 px-4 py-1.5 mb-4">
              <span className="text-amber-400/70 text-xs font-bold tracking-[0.2em] uppercase">Dual Entry</span>
            </div>
            <h2 className="text-3xl font-black text-white mb-2">选择你的入口</h2>
            <p className="text-gray-400 text-sm">为临床工作者与患者分别优化的信息架构</p>
          </div>

          <div className="flex flex-col gap-6">
            <PortalCard
              icon="👨‍⚕️" title="医生端" role="Clinical Portal"
              desc="面向消化科、儿科、感染科医生，提供循证适应证查询、临床方案参考与文献追踪。"
              items={[
                { icon: '🧬', title: '14种FMT适应证', desc: '含完整临床方案（剂量/疗程/给药途径/禁忌证）' },
                { icon: '📋', title: '双标签循证分级', desc: 'Oxford + GRADE 双标签，可点击PMID溯源' },
                { icon: '🔬', title: 'PubMed文献追踪', desc: '每周六09:00自动推送最新FMT临床研究' },
                { icon: '🤖', title: 'AI临床问答', desc: '基于GLM大模型，输入症状→循证建议' },
                { icon: '⚕️', title: '临床决策树', desc: '15节点，覆盖适应证评估→随访管理' },
                { icon: '🔭', title: 'Science期刊追踪', desc: '每日08:00推送高影响力FMT研究' },
              ]}
              cta="👨‍⚕️ 进入医生端 →"
              bgGrad="bg-gradient-to-br from-blue-600/10 via-transparent to-violet-600/8"
              borderColor="border-blue-400/20"
              btnStyle="bg-blue-600 hover:bg-blue-500 text-white"
              delay={0} onEnter={onEnterDoctor}
            />
            <PortalCard
              icon="👤" title="患者端" role="Patient Portal"
              desc="面向患者及家属，提供通俗易懂的 FMT 科普与就医指引，扫除信息不对称障碍。"
              items={[
                { icon: '📚', title: '35篇患者科普', desc: '通俗语言解读FMT适应证与治疗流程' },
                { icon: '🏥', title: '全国医院地图', desc: '收录10家正规FMT医疗机构与导航' },
                { icon: '💊', title: '治疗流程指南', desc: '从初诊到移植到随访的完整指引' },
                { icon: '💰', title: '医保政策查询', desc: '各地FMT医保报销政策与申请流程' },
                { icon: '📝', title: '知情同意指引', desc: 'FMT治疗知情同意要点说明' },
                { icon: '🩺', title: '日常管理建议', desc: '移植后饮食、用药与生活注意事项' },
              ]}
              cta="👤 进入患者端 →"
              bgGrad="bg-gradient-to-br from-emerald-600/10 via-transparent to-teal-600/8"
              borderColor="border-emerald-400/20"
              btnStyle="bg-white/10 border border-white/20 hover:bg-white/20 text-white"
              delay={150} onEnter={onEnterPatient}
            />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          FOOTER CTA
      ═══════════════════════════════════════════ */}
      <div className="relative z-10 px-4 pb-24 text-center">
        <div className="max-w-2xl mx-auto bg-gradient-to-r from-blue-600/15 to-violet-600/15 rounded-3xl border border-white/10 p-10 backdrop-blur-md">
          <h2 className="text-2xl font-black text-white mb-3">准备好探索了吗？</h2>
          <p className="text-gray-400 text-sm mb-6">FMTWiki 由 Minimax Agent AI 驱动，持续追踪全球 FMT 最新进展</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-5">
            <button onClick={onEnterDoctor}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all hover:scale-105">
              👨‍⚕️ 医生端入口
            </button>
            <button onClick={onEnterPatient}
              className="px-6 py-3 bg-white/10 border border-white/20 hover:bg-white/20 text-white rounded-xl font-bold transition-all hover:scale-105">
              👤 患者端入口
            </button>
          </div>
          <p className="text-xs text-gray-600">M-DQA 双代理质量审查 · 来源必链 · 循证优先</p>
        </div>
      </div>

    </div>
  );
}
