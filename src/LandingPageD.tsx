import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  onEnterDoctor: () => void;
  onEnterPatient: () => void;
}

// ─── MicroscopeBackground ─────────────────────────────────────────────────────

function MicroscopeView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let id: number;

    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    const organisms: Array<{
      x: number; y: number; vx: number; vy: number;
      r: number; rot: number; rotSpeed: number;
      color: string; type: 'circle' | 'bacillus' | 'rod';
      opacity: number;
    }> = Array.from({ length: 45 }, () => {
      const types = ['circle', 'bacillus', 'rod'] as const;
      const type = types[Math.floor(Math.random() * 3)];
      const palettes = [
        { fill: 'rgba(0,180,160,', stroke: '#00B4A0' },
        { fill: 'rgba(80,60,200,', stroke: '#5040C8' },
        { fill: 'rgba(20,140,120,', stroke: '#148C78' },
        { fill: 'rgba(100,40,180,', stroke: '#6428B4' },
      ];
      const p = palettes[Math.floor(Math.random() * palettes.length)];
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: type === 'circle' ? Math.random() * 28 + 10 : type === 'bacillus' ? Math.random() * 18 + 8 : Math.random() * 14 + 6,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.003,
        color: p.fill,
        type,
        opacity: Math.random() * 0.12 + 0.04,
      };
    });

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark field background
      const bgGrad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.7);
      bgGrad.addColorStop(0, '#060d18');
      bgGrad.addColorStop(1, '#020810');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Microscope circular viewport
      const cx = canvas.width / 2, cy = canvas.height / 2;
      const vpR = Math.min(canvas.width, canvas.height) * 0.46;
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, vpR, 0, Math.PI * 2);
      ctx.clip();

      // Viewport interior glow
      const vpGrad = ctx.createRadialGradient(cx, cy, vpR * 0.3, cx, cy, vpR);
      vpGrad.addColorStop(0, 'rgba(0,80,70,0.0)');
      vpGrad.addColorStop(1, 'rgba(0,40,35,0.35)');
      ctx.fillStyle = vpGrad;
      ctx.fill();

      // Grid lines (microscope reticle)
      ctx.strokeStyle = 'rgba(0,180,160,0.05)';
      ctx.lineWidth = 0.5;
      for (let i = -canvas.width; i < canvas.width; i += 40) {
        ctx.beginPath(); ctx.moveTo(cx + i, 0); ctx.lineTo(cx + i, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, cy + i); ctx.lineTo(canvas.width, cy + i); ctx.stroke();
      }

      // Organisms
      for (const o of organisms) {
        o.x += o.vx; o.y += o.vy; o.rot += o.rotSpeed;
        if (o.x < -60) o.x = canvas.width + 60;
        if (o.x > canvas.width + 60) o.x = -60;
        if (o.y < -60) o.y = canvas.height + 60;
        if (o.y > canvas.height + 60) o.y = -60;

        ctx.save();
        ctx.translate(o.x, o.y);
        ctx.rotate(o.rot);

        if (o.type === 'circle') {
          // Cell body
          const g = ctx.createRadialGradient(-o.r * 0.3, -o.r * 0.3, 0, 0, 0, o.r);
          g.addColorStop(0, o.color + '0.5)');
          g.addColorStop(0.7, o.color + String(o.opacity * 1.5));
          g.addColorStop(1, o.color + String(o.opacity * 0.4) + ')');
          ctx.beginPath(); ctx.arc(0, 0, o.r, 0, Math.PI * 2);
          ctx.fillStyle = g; ctx.fill();
          ctx.strokeStyle = o.color + '0.6)'; ctx.lineWidth = 0.8; ctx.stroke();
          // Nucleus
          ctx.beginPath(); ctx.arc(o.r * 0.25, -o.r * 0.15, o.r * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = o.color + '0.25)'; ctx.fill();
        } else if (o.type === 'bacillus') {
          // Rod bacteria
          ctx.beginPath(); ctx.ellipse(0, 0, o.r * 2.2, o.r * 0.8, 0, 0, Math.PI * 2);
          ctx.fillStyle = o.color + String(o.opacity * 1.2) + ')'; ctx.fill();
          ctx.strokeStyle = o.color + '0.5)'; ctx.lineWidth = 0.6; ctx.stroke();
          // Flagella dots
          for (let f = 0; f < 4; f++) {
            const fx = -o.r * 2 + f * o.r * 1.2;
            ctx.beginPath(); ctx.arc(fx, o.r * 0.9, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = o.color + '0.4)'; ctx.fill();
            ctx.beginPath(); ctx.arc(fx, -o.r * 0.9, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          // Small rods
          ctx.beginPath(); ctx.ellipse(0, 0, o.r * 1.8, o.r * 0.6, 0, 0, Math.PI * 2);
          ctx.fillStyle = o.color + String(o.opacity * 1.5) + ')'; ctx.fill();
        }
        ctx.restore();
      }

      ctx.restore(); // end clip

      // Viewport ring — outer
      ctx.beginPath(); ctx.arc(cx, cy, vpR, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,180,160,0.2)'; ctx.lineWidth = 1; ctx.stroke();
      // Viewport ring — inner glow
      ctx.beginPath(); ctx.arc(cx, cy, vpR - 4, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,220,200,0.08)'; ctx.lineWidth = 8; ctx.stroke();
      // Cross-hair
      ctx.strokeStyle = 'rgba(0,180,160,0.12)'; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(cx - vpR, cy); ctx.lineTo(cx + vpR, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy - vpR); ctx.lineTo(cx, cy + vpR); ctx.stroke();

      // Corner reticle marks
      const markLen = 18, markOff = 8;
      [[cx - vpR, cy - vpR, 1, 1], [cx + vpR, cy - vpR, -1, 1], [cx - vpR, cy + vpR, 1, -1], [cx + vpR, cy + vpR, -1, -1]].forEach(([x, y, dx, dy]) => {
        ctx.strokeStyle = 'rgba(0,220,200,0.5)'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(x + dx * markOff, y); ctx.lineTo(x + dx * (markOff + markLen), y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x, y + dy * markOff); ctx.lineTo(x, y + dy * (markOff + markLen)); ctx.stroke();
      });

      // Outer vignette
      const vig = ctx.createRadialGradient(cx, cy, vpR * 0.8, cx, cy, Math.max(canvas.width, canvas.height) * 0.8);
      vig.addColorStop(0, 'transparent');
      vig.addColorStop(1, 'rgba(0,0,0,0.7)');
      ctx.fillStyle = vig; ctx.fillRect(0, 0, canvas.width, canvas.height);

      id = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

// ─── AnimatedBar (for evidence section) ───────────────────────────────────────

function AnimBar({ pct, color, delay, active }: { pct: number; color: string; delay: number; active: boolean }) {
  return (
    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-1000"
        style={{
          width: active ? `${pct}%` : '0%',
          background: color,
          transitionDelay: `${delay}ms`,
        }}
      />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function LandingPageD({ onEnterDoctor, onEnterPatient }: Props) {
  const [scrollY, setScrollY] = useState(0);
  const [active, setActive] = useState<'hero' | 'evidence' | 'capabilities' | 'portals' | 'footer'>('hero');
  const [countersDone, setCountersDone] = useState(false);
  const [evInView, setEvInView] = useState(false);
  const [capInView, setCapInView] = useState(false);
  const [portInView, setPortInView] = useState(false);
  const [footerInView, setFooterInView] = useState(false);

  // Count-up for stats
  const [counts, setCounts] = useState({ ind: 0, teams: 0, ai: 0, edu: 0, pct: 0 });
  const statsRef = useRef<HTMLDivElement>(null);
  const evRef = useRef<HTMLDivElement>(null);
  const capRef = useRef<HTMLDivElement>(null);
  const portRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const on = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const id = (e.target as HTMLElement).dataset.observe;
        if (id === 'stats') { setActive('evidence'); if (!countersDone) { setCountersDone(true); animateCounts(); } }
        if (id === 'ev') { setActive('capabilities'); setEvInView(true); }
        if (id === 'cap') { setActive('portals'); setCapInView(true); }
        if (id === 'port') { setActive('footer'); setPortInView(true); }
        if (id === 'footer') setFooterInView(true);
      });
    }, { threshold: 0.15 });
    [statsRef, evRef, capRef, portRef, footerRef].forEach(r => { if (r.current) obs.observe(r.current); });
    return () => obs.disconnect();
  }, [countersDone]);

  function animateCounts() {
    const targets = { ind: 14, teams: 42, ai: 19, edu: 35, pct: 100 };
    const dur = 1400, s = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - s) / dur, 1);
      const ease = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setCounts({
        ind: Math.floor(ease * targets.ind),
        teams: Math.floor(ease * targets.teams),
        ai: Math.floor(ease * targets.ai),
        edu: Math.floor(ease * targets.edu),
        pct: Math.floor(ease * targets.pct),
      });
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const heroOpacity = Math.max(0, 1 - scrollY / 600);
  const heroTranslate = scrollY * 0.2;

  return (
    <div className="relative overflow-x-hidden" style={{ background: '#020810', minHeight: '500vh' }}>

      {/* ── Microscope BG ── */}
      <div className="fixed inset-0 z-0"><MicroscopeView /></div>

      {/* ── HUD Header Bar ── */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 transition-all duration-300"
        style={{ background: scrollY > 50 ? 'rgba(2,8,16,0.85)' : 'transparent', backdropFilter: scrollY > 50 ? 'blur(16px)' : 'none', borderBottom: scrollY > 50 ? '1px solid rgba(0,180,160,0.12)' : 'none' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full border border-cyan-400/40 flex items-center justify-center" style={{ background: 'rgba(0,180,160,0.1)' }}>
            <span className="text-cyan-400 text-xs font-black">F</span>
          </div>
          <span className="text-white/70 text-sm font-semibold tracking-widest">FMTWiki</span>
          <span className="text-cyan-400/40 text-xs ml-2 tracking-widest">v2.0</span>
        </div>
        <div className="flex items-center gap-1.5">
          {['证据同步', '循证分级', '实时更新'].map(tag => (
            <span key={tag} className="text-[10px] rounded-full border border-cyan-400/20 bg-cyan-400/8 px-2.5 py-1 text-cyan-400/70 font-medium tracking-wide">{tag}</span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          HERO SECTION (100vh)
      ══════════════════════════════════════════════ */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">

        {/* Microscope viewport frame center label */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-500"
          style={{ opacity: heroOpacity, transform: `translateY(${heroTranslate}px)` }}
        >
          {/* Top badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/6 px-5 py-2 mb-10 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-300 text-xs font-bold tracking-[0.25em] uppercase">Microscope Mode · Active</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>

          {/* Main title */}
          <h1
            className="font-black tracking-tight leading-none mb-2 select-none"
            style={{
              fontSize: 'clamp(3.5rem, 11vw, 7rem)',
              background: 'linear-gradient(135deg, #00E5CC 0%, #00D4C8 35%, #7C3AED 70%, #A78BFA 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 40px rgba(0,229,204,0.25))',
            }}
          >
            FMTWiki
          </h1>

          {/* Subtitle with microscope reticle style */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-cyan-400/50" />
            <p className="text-white/35 text-sm font-light tracking-[0.5em] uppercase">肠菌移植 · 专业知识库</p>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-cyan-400/50" />
          </div>

          {/* Mission line */}
          <p className="text-white/40 text-sm leading-relaxed max-w-2xl mx-auto mb-4">
            将 FMT 领域的全球循证知识，转化为临床决策与患者教育的精准工具
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-6 mb-12 flex-wrap justify-center">
            {[
              { n: counts.ind, l: '适应证', c: '#00E5CC' },
              { n: counts.teams, l: '研究团队', c: '#7C3AED' },
              { n: counts.ai, l: 'AI应用', c: '#10B981' },
              { n: counts.edu, l: '患者科普', c: '#F59E0B' },
              { n: counts.pct, l: '% 溯源', c: '#EF4444', suffix: '%' },
            ].map(item => (
              <div key={item.l} className="flex items-center gap-2">
                <span className="text-2xl font-black" style={{ color: item.c }}>{item.n}{item.suffix || ''}</span>
                <span className="text-white/30 text-xs tracking-widest uppercase">{item.l}</span>
                <div className="w-px h-4 bg-white/10" />
              </div>
            ))}
          </div>

          {/* CTA row */}
          <div className="flex items-center gap-5 flex-wrap justify-center mb-12">
            <button onClick={onEnterDoctor}
              className="relative rounded-xl px-10 py-4 font-bold text-base text-slate-900 transition-all duration-300 hover:-translate-y-1 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #00E5CC, #00B4A0)', boxShadow: '0 0 60px rgba(0,229,204,0.4), 0 8px 32px rgba(0,0,0,0.5)' }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>👨‍⚕️</span>
                <span>进入医生端</span>
                <span style={{ fontSize: '0.7em', opacity: 0.6 }}>→</span>
              </span>
            </button>
            <button onClick={onEnterPatient}
              className="rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm px-10 py-4 text-white/70 font-bold text-base hover:bg-white/10 hover:text-white hover:-translate-y-1 transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                <span>👤</span>
                <span>进入患者端</span>
              </span>
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50" style={{ opacity: heroOpacity * 0.5 }}>
          <div className="w-px h-12 bg-gradient-to-b from-cyan-400/60 to-transparent" />
          <span className="text-cyan-400/60 text-[10px] tracking-[0.2em] uppercase">Scroll to Explore</span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          EVIDENCE SYSTEM (dark strip)
      ══════════════════════════════════════════════ */}
      <div ref={statsRef} data-observe="stats" />

      <section className="relative z-10 py-24 px-6" style={{ background: 'rgba(2,8,16,0.92)', backdropFilter: 'blur(8px)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-[10px] tracking-[0.4em] uppercase text-cyan-400/50 mb-4 border border-cyan-400/20 rounded-full px-4 py-1.5">Evidence Grading System</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">双标签循证分级</h2>
            <p className="text-white/35 text-sm max-w-xl mx-auto">每个结论同时标注 Oxford 研究设计等级 与 GRADE 质量信心等级，PMID 100% 可点击溯源</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Oxford */}
            <div className="rounded-2xl border border-blue-400/15 bg-blue-400/4 p-8 backdrop-blur-md">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-blue-400/15 flex items-center justify-center text-2xl">📋</div>
                <div>
                  <div className="text-blue-300 font-bold text-base">Oxford 证据分级</div>
                  <div className="text-white/30 text-xs">研究设计可靠程度</div>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { g: '1a', l: 'RCT 系统综述', c: '#10B981', p: 100 },
                  { g: '1b', l: '单项 RCT（van Nood NEJM 2013）', c: '#22D3EE', p: 88 },
                  { g: '2b', l: '队列研究 / Pilot RCT', c: '#6366F1', p: 72 },
                  { g: '3b', l: '病例对照研究', c: '#FBBF24', p: 58 },
                  { g: '4',  l: '病例系列 / 开放试验', c: '#F97316', p: 42 },
                  { g: '5',  l: '机制研究 / 专家意见', c: 'rgba(255,255,255,0.25)', p: 22 },
                ].map((r, i) => (
                  <div key={r.g} className="flex items-center gap-4">
                    <span className="text-white/30 text-xs font-mono w-7 text-right shrink-0">{r.g}</span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-white/55 text-xs">{r.l}</span>
                        <span className="text-white/25 text-[10px] font-mono">{r.p}%</span>
                      </div>
                      <AnimBar pct={r.p} color={r.c} delay={i * 80} active={countersDone} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* GRADE */}
            <div className="rounded-2xl border border-violet-400/15 bg-violet-400/4 p-8 backdrop-blur-md">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-violet-400/15 flex items-center justify-center text-2xl">🎯</div>
                <div>
                  <div className="text-violet-300 font-bold text-base">GRADE 质量信心</div>
                  <div className="text-white/30 text-xs">对真实效应估计的确信程度</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { g: 'A', l: '高', d: '非常确信真实效应接近估计值', c: 'border-emerald-400/30', bg: 'bg-emerald-400/10', t: 'text-emerald-300' },
                  { g: 'B', l: '中', d: '对效应估计有中等信心', c: 'border-blue-400/30', bg: 'bg-blue-400/10', t: 'text-blue-300' },
                  { g: 'C', l: '低', d: '对效应估计信心有限', c: 'border-amber-400/30', bg: 'bg-amber-400/10', t: 'text-amber-300' },
                  { g: 'D', l: '极低', d: '真实效应可能截然不同', c: 'border-white/10', bg: 'bg-white/5', t: 'text-white/40' },
                ].map((g, i) => (
                  <div key={g.g} className={`rounded-xl border ${g.c} ${g.bg} p-4 transition-all duration-500 ${countersDone ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} style={{ transitionDelay: `${i * 120 + 400}ms` }}>
                    <div className="flex items-baseline gap-1.5 mb-1.5">
                      <span className={`text-3xl font-black ${g.t}`}>{g.g}</span>
                      <span className={`text-sm font-bold ${g.t}`}>{g.l}</span>
                    </div>
                    <p className="text-white/35 text-xs leading-relaxed">{g.d}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/6 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-cyan-400 text-sm">🔗</span>
                  <span className="text-cyan-300/90 text-sm font-bold">PMID 100% 可溯源</span>
                </div>
                <p className="text-white/30 text-xs leading-relaxed">每个证据等级对应真实 PubMed 文献，用户点击标签可直接跳转至原始研究页面进行验证</p>
                <div className="mt-3 flex gap-2 flex-wrap">
                  {['复发性CDI', '溃疡性结肠炎', '克罗恩病', 'ASD', 'IBS'].map(t => (
                    <span key={t} className="text-[10px] rounded-full border border-cyan-400/20 bg-cyan-400/8 text-cyan-400/70 px-2 py-0.5">{t}</span>
                  ))}
                  <span className="text-[10px] text-cyan-400/40">+{14 - 5} 更多</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CAPABILITIES STRIP
      ══════════════════════════════════════════════ */}
      <div ref={evRef} data-observe="ev" />
      <section ref={capRef} data-observe="cap" className="relative z-10 py-24 px-6" style={{ background: 'rgba(0,5,10,0.9)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-[10px] tracking-[0.4em] uppercase text-violet-400/50 mb-4 border border-violet-400/20 rounded-full px-4 py-1.5">Core Capabilities</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">不只是知识库</h2>
            <p className="text-white/35 text-sm">从文献检索到临床决策支持的全链路工具集</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: '🧬', title: '精准适应证查询', desc: '14种FMT适应证，含剂量、疗程、给药途径、禁忌证，附完整临床方案与循证依据。', tags: ['rCDI', 'UC', 'CD', 'ASD', 'IBS', '+9'], c: 'border-cyan-400/20 hover:border-cyan-400/50', ib: 'bg-cyan-400/12', tc: 'text-cyan-400' },
              { icon: '🔬', title: '循证文献追踪', desc: 'PubMed + Science 期刊自动追踪，支持每周/每日定时推送最新研究进展。', tags: ['PubMed', 'Science', '定时任务'], c: 'border-violet-400/20 hover:border-violet-400/50', ib: 'bg-violet-400/12', tc: 'text-violet-400' },
              { icon: '🤖', title: 'AI 临床问答', desc: '基于 GLM 大模型，输入患者症状与指标，返回循证建议与分级来源。', tags: ['RAG', 'GLM API', '来源溯源'], c: 'border-emerald-400/20 hover:border-emerald-400/50', ib: 'bg-emerald-400/12', tc: 'text-emerald-400' },
              { icon: '⚕️', title: '临床决策树', desc: '15节点 FMT 临床决策树，覆盖适应证评估→方案选择→知情同意→随访管理全流程。', tags: ['流程可视化', 'PMID溯源'], c: 'border-cyan-400/20 hover:border-cyan-400/50', ib: 'bg-cyan-400/12', tc: 'text-cyan-400' },
              { icon: '👥', title: '研究团队地图', desc: '国内21个核心FMT研究团队，含机构信息、研究方向、主要研究者与联系方式。', tags: ['21机构', '研究方向', 'PI信息'], c: 'border-violet-400/20 hover:border-violet-400/50', ib: 'bg-violet-400/12', tc: 'text-violet-400' },
              { icon: '📰', title: '患者科普中心', desc: '35篇通俗科普文，覆盖适应证、治疗流程、医保政策、知情同意、日常管理。', tags: ['通俗语言', '医保政策', '知情同意'], c: 'border-emerald-400/20 hover:border-emerald-400/50', ib: 'bg-emerald-400/12', tc: 'text-emerald-400' },
            ].map((card, i) => (
              <div key={card.title}
                className={`group rounded-2xl border ${card.c} bg-black/30 p-7 backdrop-blur-md transition-all duration-500 hover:-translate-y-1.5 hover:bg-black/50 ${countersDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 80 + 200}ms` }}
              >
                <div className={`inline-flex items-center justify-center rounded-xl w-13 h-13 ${card.ib} mb-5`}>
                  <span className="text-3xl">{card.icon}</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-3">{card.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-5">{card.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {card.tags.map(t => (
                    <span key={t} className="text-[10px] rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-white/35 font-medium">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          DUAL PORTAL — Full Width Hero Cards
      ══════════════════════════════════════════════ */}
      <section ref={portRef} data-observe="port" className="relative z-10 py-20 px-6" style={{ background: 'rgba(2,8,16,0.92)', backdropFilter: 'blur(8px)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-[10px] tracking-[0.4em] uppercase text-amber-400/50 mb-4 border border-amber-400/20 rounded-full px-4 py-1.5">Dual Entry Architecture</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">选择你的入口</h2>
            <p className="text-white/35 text-sm">为临床工作者与患者分别优化的信息架构</p>
          </div>

          {/* Doctor Portal */}
          <div className={`relative rounded-3xl overflow-hidden mb-6 transition-all duration-700 ${countersDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: '300ms' }}>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,180,160,0.08) 0%, rgba(0,80,120,0.12) 100%)' }} />
            <div className="absolute inset-0 border border-cyan-400/20 rounded-3xl" />
            <div className="relative z-10 p-10 md:p-12">
              <div className="flex flex-col md:flex-row gap-10">
                <div className="md:w-72 shrink-0">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ background: 'rgba(0,229,204,0.15)', border: '1px solid rgba(0,229,204,0.3)' }}>👨‍⚕️</div>
                    <div>
                      <div className="text-cyan-400/70 text-xs font-bold tracking-[0.2em] uppercase mb-1">Clinical Portal</div>
                      <h3 className="text-white font-black text-3xl">医生端</h3>
                    </div>
                  </div>
                  <p className="text-white/40 text-sm leading-relaxed mb-6">面向消化科、儿科、感染科医生，提供循证适应证查询、临床方案参考与文献追踪。</p>
                  <button onClick={onEnterDoctor}
                    className="w-full rounded-xl py-3.5 font-bold text-sm text-slate-900 transition-all duration-300 hover:-translate-y-0.5 text-center"
                    style={{ background: 'linear-gradient(135deg, #00E5CC, #00B4A0)', boxShadow: '0 0 40px rgba(0,229,204,0.3)' }}
                  >👨‍⚕️ 进入医生端 →</button>
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: '🧬', title: '14种FMT适应证', desc: '含完整临床方案（剂量/疗程/给药途径/禁忌证）' },
                    { icon: '📋', title: '双标签循证分级', desc: 'Oxford + GRADE 双标签，可点击PMID溯源' },
                    { icon: '🔬', title: 'PubMed文献追踪', desc: '每周六09:00自动推送最新FMT临床研究' },
                    { icon: '🤖', title: 'AI临床问答', desc: '基于GLM大模型，输入症状→循证建议' },
                    { icon: '⚕️', title: '临床决策树', desc: '15节点，覆盖适应证评估→随访管理' },
                    { icon: '🔭', title: 'Science期刊追踪', desc: '每日08:00推送高影响力FMT研究' },
                  ].map(f => (
                    <div key={f.title} className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/4 p-4">
                      <span className="text-xl shrink-0 mt-0.5">{f.icon}</span>
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

          {/* Patient Portal */}
          <div className={`relative rounded-3xl overflow-hidden transition-all duration-700 ${countersDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: '450ms' }}>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(0,80,80,0.10) 100%)' }} />
            <div className="absolute inset-0 border border-emerald-400/20 rounded-3xl" />
            <div className="relative z-10 p-10 md:p-12">
              <div className="flex flex-col md:flex-row gap-10">
                <div className="md:w-72 shrink-0">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>👤</div>
                    <div>
                      <div className="text-emerald-400/70 text-xs font-bold tracking-[0.2em] uppercase mb-1">Patient Portal</div>
                      <h3 className="text-white font-black text-3xl">患者端</h3>
                    </div>
                  </div>
                  <p className="text-white/40 text-sm leading-relaxed mb-6">面向患者及家属，提供通俗易懂的 FMT 科普与就医指引，扫除信息不对称障碍。</p>
                  <button onClick={onEnterPatient}
                    className="w-full rounded-xl py-3.5 font-bold text-sm text-white/80 border border-white/20 bg-white/5 hover:bg-white/10 hover:text-white transition-all duration-300 hover:-translate-y-0.5 text-center"
                  >👤 进入患者端 →</button>
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: '📚', title: '35篇患者科普', desc: '通俗语言解读FMT适应证与治疗流程' },
                    { icon: '🏥', title: '全国医院地图', desc: '收录10家正规FMT医疗机构与导航' },
                    { icon: '💊', title: '治疗流程指南', desc: '从初诊到移植到随访的完整指引' },
                    { icon: '💰', title: '医保政策查询', desc: '各地FMT医保报销政策与申请流程' },
                    { icon: '📝', title: '知情同意指引', desc: 'FMT治疗知情同意要点说明' },
                    { icon: '🩺', title: '日常管理建议', desc: '移植后饮食、用药与生活注意事项' },
                  ].map(f => (
                    <div key={f.title} className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/4 p-4">
                      <span className="text-xl shrink-0 mt-0.5">{f.icon}</span>
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
        </div>
      </section>

      {/* Footer */}
      <div ref={footerRef} data-observe="footer" />
      <section ref={footerRef} data-observe="footer" className="relative z-10 py-24 px-6 text-center" style={{ background: 'rgba(0,5,10,0.9)' }}>
        <div className={`max-w-2xl mx-auto transition-all duration-700 ${footerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-5 py-2 mb-8 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-300/80 text-xs font-semibold">FMTWiki · 已收录 14 个循证适应证 · 100% 来源可溯源</span>
          </div>
          <h2 className="text-3xl font-black text-white mb-5">开始探索肠菌移植的循证世界</h2>
          <p className="text-white/30 text-sm mb-10">由苏州市立医院支持 · 持续追踪全球最新研究进展</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button onClick={onEnterDoctor}
              className="rounded-xl px-10 py-4 font-bold text-base text-slate-900 transition-all duration-300 hover:-translate-y-1"
              style={{ background: 'linear-gradient(135deg, #00E5CC, #00B4A0)', boxShadow: '0 0 50px rgba(0,229,204,0.35)' }}
            >👨‍⚕️ 立即进入医生端</button>
            <button onClick={onEnterPatient}
              className="rounded-xl border border-white/15 bg-white/5 px-10 py-4 text-white/70 font-bold text-base hover:bg-white/10 hover:text-white transition-all duration-300 hover:-translate-y-1"
            >👤 了解更多</button>
          </div>
          <div className="mt-16 flex items-center justify-center gap-6 text-white/20 text-xs tracking-widest">
            <span>苏州市立医院</span><span className="text-cyan-400/30">·</span><span>循证医学</span><span className="text-cyan-400/30">·</span><span>持续迭代</span>
          </div>
        </div>
      </section>
    </div>
  );
}
