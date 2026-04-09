import { useRef, useEffect, useState } from 'react';

// ============================================================
// 1. DNAHelixCanvas — 核心DNA双螺旋Canvas组件
// ============================================================
function DNAHelixCanvas({ height = 520 }: { height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollYRef = useRef(0);

  const diseases = [
    { label: 'rCDI', base: 'G' as const, pmid: '23323867', grade: 'A', color: '#10B981' },
    { label: 'UC', base: 'A' as const, pmid: '28214091', grade: 'B', color: '#3B82F6' },
    { label: 'CD', base: 'T' as const, pmid: '32014035', grade: 'C', color: '#8B5CF6' },
    { label: 'ASD', base: 'G' as const, pmid: '28122648', grade: 'C', color: '#F59E0B' },
    { label: 'MDRO', base: 'A' as const, pmid: '30986562', grade: 'B', color: '#EF4444' },
    { label: 'IBS', base: 'T' as const, pmid: '37346153', grade: 'D', color: '#6B7280' },
    { label: 'NAFLD', base: 'C' as const, pmid: '32618656', grade: 'C', color: '#14B8A6' },
    { label: 'Parkinson', base: 'G' as const, pmid: '27912077', grade: 'C', color: '#EC4899' },
    { label: '便秘', base: 'A' as const, pmid: '31994479', grade: 'C', color: '#06B6D4' },
    { label: 'Sepsis', base: 'T' as const, pmid: '36650836', grade: 'B', color: '#84CC16' },
    { label: 'IBD', base: 'C' as const, pmid: '32955918', grade: 'B', color: '#F97316' },
    { label: '肝性脑病', base: 'G' as const, pmid: '31179030', grade: 'C', color: '#A78BFA' },
    { label: 'SIBO', base: 'A' as const, pmid: '31533267', grade: 'C', color: '#2DD4BF' },
    { label: 'Metabolic', base: 'T' as const, pmid: '31706637', grade: 'C', color: '#FB923C' },
  ];

  const baseColorMap: Record<string, { a: string; b: string }> = {
    A: { a: '#FF6B6B', b: '#10B981' },
    T: { a: '#4ECDC4', b: '#F59E0B' },
    G: { a: '#6366F1', b: '#FBBF24' },
    C: { a: '#3B82F6', b: '#EF4444' },
  };

  useEffect(() => {
    const onScroll = () => { scrollYRef.current = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let raf: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const CX = () => canvas.offsetWidth / 2;
    const SCROLL = () => scrollYRef.current;

    const draw = () => {
      time += 0.008;
      const W = canvas.offsetWidth;
      const H = height;
      ctx.clearRect(0, 0, W, H);

      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#020408');
      bg.addColorStop(1, '#050d1a');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      const CX_val = CX();
      const scrollOffset = SCROLL() * 0.4;
      const AMPLITUDE = Math.min(W * 0.35, 180);

      for (let i = 0; i < diseases.length * 2; i++) {
        const t = i / (diseases.length * 2 - 1);
        const y = t * H + 20 - scrollOffset;
        const angle = t * Math.PI * 4 + time;

        if (y < -60 || y > H + 60) continue;

        const x1 = CX_val + Math.cos(angle) * AMPLITUDE;
        const x2 = CX_val + Math.cos(angle + Math.PI) * AMPLITUDE;
        const z = Math.sin(angle);

        const dataIdx = Math.floor(i / 2);
        const node = diseases[dataIdx];
        const baseColors = baseColorMap[node.base];

        // 骨架线条
        if (i < diseases.length * 2 - 1) {
          const nextT = (i + 1) / (diseases.length * 2 - 1);
          const nextY = nextT * H + 20 - scrollOffset;
          const nextAngle = nextT * Math.PI * 4 + time;
          const nx1 = CX_val + Math.cos(nextAngle) * AMPLITUDE;
          const nx2 = CX_val + Math.cos(nextAngle + Math.PI) * AMPLITUDE;

          const sg = ctx.createLinearGradient(x1, y, nx1, nextY);
          sg.addColorStop(0, `rgba(0,229,204,${0.3 + 0.3 * z})`);
          sg.addColorStop(1, `rgba(99,102,241,${0.3 + 0.3 * z})`);
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(nx1, nextY);
          ctx.strokeStyle = sg;
          ctx.lineWidth = 1.5 + z * 0.5;
          ctx.stroke();

          const sg2 = ctx.createLinearGradient(x2, y, nx2, nextY);
          sg2.addColorStop(0, `rgba(99,102,241,${0.3 - 0.3 * z})`);
          sg2.addColorStop(1, `rgba(0,229,204,${0.3 - 0.3 * z})`);
          ctx.beginPath();
          ctx.moveTo(x2, y);
          ctx.lineTo(nx2, nextY);
          ctx.strokeStyle = sg2;
          ctx.lineWidth = 1.5 - z * 0.5;
          ctx.stroke();
        }

        // 碱基对连线
        const alpha = 0.5 + z * 0.3;
        const grad = ctx.createLinearGradient(x1, y, x2, y);
        grad.addColorStop(0, baseColors.a);
        grad.addColorStop(1, baseColors.b);

        ctx.shadowBlur = 8;
        ctx.shadowColor = baseColors.a;
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.strokeStyle = grad;
        ctx.globalAlpha = Math.max(0.1, alpha);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.globalAlpha = 1;

        // 碱基圆点
        if (Math.abs(z) > 0.1) {
          const nearX = z > 0 ? x1 : x2;
          const nearColor = baseColors.a;

          ctx.beginPath();
          ctx.arc(nearX, y, 5, 0, Math.PI * 2);
          ctx.fillStyle = nearColor;
          ctx.shadowBlur = 12;
          ctx.shadowColor = nearColor;
          ctx.fill();

          if (Math.abs(z) > 0.7) {
            ctx.shadowBlur = 0;
            ctx.font = 'bold 10px monospace';
            ctx.fillStyle = '#e2e8f0';
            ctx.textAlign = z > 0 ? 'left' : 'right';
            const labelX = z > 0 ? nearX + 10 : nearX - 10;
            ctx.fillText(node.label, labelX, y + 4);

            const gradeColors: Record<string, string> = {
              A: '#10B981', B: '#3B82F6', C: '#F59E0B', D: '#6B7280',
            };
            ctx.font = '8px sans-serif';
            ctx.fillStyle = gradeColors[node.grade] || '#6B7280';
            ctx.fillText(`GRADE ${node.grade}`, labelX, y + 16);
          }
        }
        ctx.shadowBlur = 0;
      }

      // 中心FMTWiki标签
      const labelY = H / 2 - scrollOffset;
      if (labelY > -20 && labelY < H + 20) {
        ctx.font = 'bold 14px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#00E5CC';
        ctx.fillText('FMTWiki', CX_val, labelY);
        ctx.shadowBlur = 0;
        ctx.font = '10px sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText('肠菌移植知识库 · DNA双螺旋', CX_val, labelY + 18);
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [height]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: `${height}px`, display: 'block' }}
    />
  );
}

// ============================================================
// 2. ScrollRevealCard — 滚动触发渐入卡片
// ============================================================
function ScrollRevealCard({
  title, pmid, journal, grade, color, icon,
}: {
  title: string; pmid: string; journal: string; grade: string; color: string; icon: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current!;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const gradeColors: Record<string, string> = {
    A: 'bg-emerald-500', B: 'bg-blue-500', C: 'bg-amber-500', D: 'bg-gray-500',
  };

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{
        background: `linear-gradient(135deg, ${color}08, ${color}15)`,
        borderColor: `${color}30`,
      }}
    >
      <div
        className="absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-10"
        style={{ background: color }}
      />
      <div className="flex items-start justify-between mb-3">
        <div className="text-2xl">{icon}</div>
        <div
          className={`w-6 h-6 rounded-full ${gradeColors[grade]} flex items-center justify-center text-white text-xs font-bold`}
        >
          {grade}
        </div>
      </div>
      <div className="text-white font-bold text-sm mb-1">{title}</div>
      <div className="text-xs text-gray-500 mb-1">{journal}</div>
      <div className="text-xs font-mono text-gray-400">PMID {pmid}</div>
    </div>
  );
}

// ============================================================
// 3. HotspotPanel — AI配型热力矩阵
// ============================================================
function HotspotPanel() {
  const data = [
    ['—', 'rCDI', 'UC', 'CD', 'ASD', 'MDRO'],
    ['rCDI', '—', 0.2, 0.3, 0.1, 0.4],
    ['UC', 0.2, '—', 0.5, 0.2, 0.3],
    ['CD', 0.3, 0.5, '—', 0.1, 0.2],
    ['ASD', 0.1, 0.2, 0.1, '—', 0.1],
    ['MDRO', 0.4, 0.3, 0.2, 0.1, '—'],
  ];

  const getColor = (v: number) => {
    if (v >= 0.5) return `rgba(16,185,129,${v})`;
    if (v >= 0.3) return `rgba(59,130,246,${v})`;
    if (v > 0) return `rgba(107,114,128,${v})`;
    return 'transparent';
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-max">
        <div className="flex mb-1">
          {data[0].map((h, i) => (
            <div key={i} className="w-16 flex-shrink-0 text-center text-xs font-mono text-gray-500 px-1">
              {h}
            </div>
          ))}
        </div>
        {data.slice(1).map((row, ri) => (
          <div key={ri} className="flex">
            <div className="w-16 flex-shrink-0 text-center text-xs font-mono text-gray-400 py-1">
              {row[0]}
            </div>
            {row.slice(1).map((v, ci) => (
              <div
                key={ci}
                className="w-16 flex-shrink-0 h-10 flex items-center justify-center"
                title={typeof v === 'number' ? `${v * 100}% 匹配度` : '—'}
              >
                {typeof v === 'number' && v > 0 ? (
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: getColor(v) }}
                  >
                    {Math.round(v * 100)}%
                  </div>
                ) : (
                  <div className="w-8 h-8" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// 4. TeamConstellationCanvas — 团队星系Canvas
// ============================================================
function TeamConstellationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let raf: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = 220;
    };
    resize();
    window.addEventListener('resize', resize);

    const W = () => canvas.offsetWidth;
    const H = 220;

    const teams = [
      { label: '南医大二附院', cx: 0.5, cy: 0.5, color: '#60a5fa', r: 12 },
      { label: '中科院动物所', cx: 0.2, cy: 0.3, color: '#a78bfa', r: 10 },
      { label: '苏州市立医院', cx: 0.8, cy: 0.3, color: '#34d399', r: 10 },
      { label: '深圳未知君', cx: 0.15, cy: 0.6, color: '#fbbf24', r: 9 },
      { label: '北京协和', cx: 0.85, cy: 0.55, color: '#f87171', r: 11 },
      { label: '中山六院', cx: 0.3, cy: 0.75, color: '#22d3ee', r: 9 },
      { label: '上交微生物国重', cx: 0.7, cy: 0.7, color: '#c084fc', r: 9 },
      { label: '港中深', cx: 0.08, cy: 0.45, color: '#fb923c', r: 8 },
    ];

    const loop = () => {
      time += 0.005;
      ctx.clearRect(0, 0, W(), H);
      const W_val = W();
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const cCenterX = 0.5 * W_val;
      const cCenterY = 0.5 * H;

      // 画边线
      teams.forEach((t, i) => {
        const tx = t.cx * W_val;
        const ty = t.cy * H;
        teams.forEach((t2, j) => {
          if (j <= i) return;
          const t2x = t2.cx * W_val;
          const t2y = t2.cy * H;
          const d = Math.sqrt((t2x - tx) ** 2 + (t2y - ty) ** 2);
          if (d < W_val * 0.4) {
            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(t2x, t2y);
            ctx.strokeStyle = 'rgba(148,163,184,0.08)';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });

        // 到中心连线
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(cCenterX, cCenterY);
        ctx.strokeStyle = 'rgba(0,229,204,0.05)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      // 画节点
      teams.forEach((t) => {
        const tx = t.cx * W_val + Math.sin(time + t.cx * 10) * 3;
        const ty = t.cy * H + Math.cos(time + t.cy * 10) * 3;
        const dx = mx - tx;
        const dy = my - ty;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const isNear = dist < 60;
        const r = isNear ? t.r * 1.4 : t.r;

        const glow = ctx.createRadialGradient(tx, ty, 0, tx, ty, r * 3);
        glow.addColorStop(0, t.color + '60');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(tx, ty, r * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(tx, ty, r, 0, Math.PI * 2);
        ctx.fillStyle = t.color;
        ctx.fill();

        if (isNear) {
          ctx.font = 'bold 10px sans-serif';
          ctx.fillStyle = '#e2e8f0';
          ctx.textAlign = 'center';
          ctx.fillText(t.label, tx, ty + r + 14);
        }
      });

      // 中心
      const cGlow = ctx.createRadialGradient(cCenterX, cCenterY, 0, cCenterX, cCenterY, 30);
      cGlow.addColorStop(0, 'rgba(0,229,204,0.3)');
      cGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = cGlow;
      ctx.beginPath();
      ctx.arc(cCenterX, cCenterY, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cCenterX, cCenterY, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#00E5CC';
      ctx.fill();

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.addEventListener('mousemove', onMove);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full rounded-xl" style={{ height: 220 }} />;
}

// ============================================================
// 5. 主组件 — LandingPageC
// ============================================================
export function LandingPageC({
  onEnterDoctor,
  onEnterPatient,
}: {
  onEnterDoctor: () => void;
  onEnterPatient: () => void;
}) {
  const diseases = [
    { title: '复发性 CDI', pmid: '23323867', journal: 'NEJM 2013', grade: 'A', color: '#10B981', icon: '🦠' },
    { title: '溃疡性结肠炎', pmid: '28214091', journal: 'Lancet 2017', grade: 'B', color: '#3B82F6', icon: '🔥' },
    { title: '克罗恩病', pmid: '32014035', journal: 'Microbiome 2020', grade: 'C', color: '#8B5CF6', icon: '⚡' },
    { title: '自闭症 ASD', pmid: '28122648', journal: 'Microbiome 2017', grade: 'C', color: '#F59E0B', icon: '🧠' },
    { title: '耐药菌 MDRO', pmid: '30986562', journal: 'Clin Microbiol Infect 2019', grade: 'B', color: '#EF4444', icon: '💉' },
    { title: 'NAFLD 脂肪肝', pmid: '32618656', journal: 'Am J Gastroenterol 2020', grade: 'C', color: '#14B8A6', icon: '🫀' },
    { title: '帕金森病', pmid: '27912077', journal: 'Cell 2016', grade: 'C', color: '#EC4899', icon: '🌀' },
    { title: '便秘', pmid: '31994479', journal: 'JGH 2020', grade: 'C', color: '#06B6D4', icon: '💧' },
    { title: '脓毒症', pmid: '36650836', journal: 'Critical Care Med 2023', grade: 'B', color: '#84CC16', icon: '🫁' },
  ];

  return (
    <div className="min-h-screen bg-[#020408] text-white overflow-x-hidden">

      {/* HERO：DNA双螺旋 Canvas */}
      <section className="relative">
        <div className="w-full overflow-hidden">
          <DNAHelixCanvas height={520} />
        </div>

        {/* 叠加文字 */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-end pb-10 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #020408 0%, transparent 60%)' }}
        >
          <div className="text-center px-4 mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Effect C · DNA双螺旋 · 沉浸医学叙事
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-3">
              <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                肠菌生命的<br />双螺旋密码
              </span>
            </h1>
            <p className="text-gray-400 text-base max-w-md mx-auto leading-relaxed">
              14种FMT适应证 · 21个研究团队 · 11个AI应用<br />
              每一对碱基，都是一个生命的可能
            </p>
          </div>
          <div className="flex gap-3 pointer-events-auto">
            <button
              onClick={onEnterDoctor}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-sm transition-all hover:scale-105"
            >
              👨‍⚕️ 进入医生端
            </button>
            <button
              onClick={onEnterPatient}
              className="px-6 py-3 bg-white/10 border border-white/20 hover:bg-white/20 text-white rounded-2xl font-bold text-sm backdrop-blur-md transition-all hover:scale-105"
            >
              👤 患者端入口
            </button>
          </div>
        </div>
      </section>

      {/* Section 1：循证适应证 */}
      <section className="relative z-10 px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs text-emerald-400 font-mono uppercase tracking-widest mb-2">
              Evidence Base · 循证医学
            </div>
            <h2 className="text-3xl font-black text-white mb-2">每一种可能 · 都有迹可循</h2>
            <p className="text-gray-500 text-sm">滚动脉络 · PMID直连PubMed · GRADE可信度评级</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {diseases.map((d, i) => (
              <ScrollRevealCard key={i} {...d} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 2：团队星系 */}
      <section className="relative z-10 px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <div className="text-xs text-indigo-400 font-mono uppercase tracking-widest mb-2">
              Research Network · 研究网络
            </div>
            <h2 className="text-2xl font-black text-white">21个团队 · 围绕同一个核心</h2>
          </div>
          <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
            <TeamConstellationCanvas />
          </div>
          <div className="flex justify-center gap-4 mt-4 text-xs text-gray-500 flex-wrap">
            {(['临床合作', '算法研发', '企业管线'] as const).map((cat, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${['bg-blue-400', 'bg-purple-400', 'bg-amber-400'][i]}`} />
                <span>{cat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3：AI配型热力矩阵 */}
      <section className="relative z-10 px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <div className="text-xs text-cyan-400 font-mono uppercase tracking-widest mb-2">
              AI Matching · 智能配型
            </div>
            <h2 className="text-2xl font-black text-white">DynaBiome × AI 精准配型矩阵</h2>
            <p className="text-gray-500 text-xs mt-1">
              基于肠道菌群特征相似度预测 · CDI准确率 &gt;90%
            </p>
          </div>
          <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
            <HotspotPanel />
          </div>
        </div>
      </section>

      {/* Section 4：患者入口 */}
      <section className="relative z-10 px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-white">从恐惧到治愈</h2>
            <p className="text-gray-500 text-sm mt-1">真实患者故事 · 简化版科普 · 就医指南</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                emoji: '🌱',
                title: 'rCDI患者老张的故事',
                sub: '从反复住院到一次FMT治愈',
                tag: '复发性艰难梭菌',
                color: '#10B981',
              },
              {
                emoji: '💜',
                title: 'UC患者小林的经历',
                sub: '激素依赖型结肠炎的缓解之路',
                tag: '溃疡性结肠炎',
                color: '#8B5CF6',
              },
              {
                emoji: '🧬',
                title: 'FMT科普时间线',
                sub: '从"粪便移植"到"菌群精准干预"',
                tag: '前世今生',
                color: '#3B82F6',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group cursor-pointer rounded-2xl border border-white/10 p-6 bg-white/3 hover:bg-white/8 transition-all"
                style={{ borderColor: `${item.color}30` }}
              >
                <div className="text-4xl mb-3">{item.emoji}</div>
                <div className="text-white font-bold text-sm mb-1">{item.title}</div>
                <div className="text-gray-400 text-xs mb-3">{item.sub}</div>
                <div
                  className="inline-block px-2 py-0.5 rounded-full text-xs"
                  style={{ background: `${item.color}20`, color: item.color }}
                >
                  {item.tag}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5：CTA */}
      <section className="relative z-10 px-4 pb-20 text-center">
        <div className="max-w-xl mx-auto">
          <div className="text-xs text-gray-600 font-mono mb-4">FMTWiki · 肠菌移植专业知识库</div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onEnterDoctor}
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white rounded-2xl font-bold transition-all hover:scale-105 shadow-lg shadow-emerald-900/40"
            >
              👨‍⚕️ 进入医生端
            </button>
            <button
              onClick={onEnterPatient}
              className="px-8 py-4 bg-white/10 border border-white/20 hover:bg-white/20 text-white rounded-2xl font-bold transition-all hover:scale-105"
            >
              👤 进入患者端
            </button>
          </div>
          <div className="text-xs text-gray-600 mt-6">M-DQA双代理审查 · PMID溯源 · 来源必链</div>
        </div>
      </section>

    </div>
  );
}
