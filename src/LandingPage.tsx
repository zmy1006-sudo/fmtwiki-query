import { useEffect, useRef, useState } from 'react';

type DoctorTab = 'disease' | 'teams' | 'ai' | 'science';
type PatientEduCategory = '全部' | '前世今生' | '适应证' | '治疗流程' | '政策规范' | '医保报销' | '知情同意';

type AppView =
  | { screen: 'landing' }
  | { screen: 'login' }
  | { screen: 'aiSearch'; portal: 'doctor' | 'patient' }
  | { screen: 'doctor'; tab: DoctorTab }
  | { screen: 'patient'; tab: PatientEduCategory }
  | { screen: 'evidenceGuide' };

// ─────────────────────────────────────────────
// ParticleCanvas — Canvas粒子背景
// ─────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let animationId: number;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    const PARTICLE_COUNT = 100;
    const CONNECT_DISTANCE = 120;

    type Particle = {
      x: number; y: number;
      vx: number; vy: number;
      radius: number;
      color: string;
      opacity: number;
    };

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? '#0066FF' : '#8B5CF6',
      opacity: Math.random() * 0.5 + 0.2,
    }));

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update & draw particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(p.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
      }

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DISTANCE) {
            const alpha = (1 - dist / CONNECT_DISTANCE) * 0.3;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(100, 150, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-10" />;
}

// ─────────────────────────────────────────────
// CounterCard — 数字计数器动画
// ─────────────────────────────────────────────
function CounterCard({ value, label, suffix = '', color = 'blue' }: {
  value: number; label: string; suffix?: string; color?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1800;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(ease * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);

  const colorMap: Record<string, string> = {
    blue: 'from-blue-400 to-cyan-400',
    purple: 'from-purple-400 to-pink-400',
    green: 'from-emerald-400 to-teal-400',
    amber: 'from-amber-400 to-orange-400',
  };

  return (
    <div className="flex flex-col items-center animate-slide-up" style={{ opacity: 0 }}>
      <div className={`text-5xl font-black bg-gradient-to-r ${colorMap[color ?? 'blue']} bg-clip-text text-transparent tabular-nums`}>
        {count}{suffix}
      </div>
      <div className="text-sm text-gray-400 mt-1">{label}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
// GlassCard — 玻璃态功能卡片
// ─────────────────────────────────────────────
function GlassCard({ emoji, title, desc, tags, delay = 0 }: {
  emoji: string; title: string; desc: string; tags: string[]; delay?: number;
}) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl p-5 border border-white/10 bg-white/5 backdrop-blur-md
                 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02]
                 hover:shadow-[0_0_40px_rgba(0,102,255,0.15)] animate-slide-up"
      style={{ animationDelay: `${delay}ms`, opacity: 0 }}
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-bl-full" />
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

// ─────────────────────────────────────────────
// EvidenceBar — 证据等级可视化条
// ─────────────────────────────────────────────
function EvidenceBar() {
  const items = [
    { ox: '1b', grade: 'A', label: '复发性CDI', color: 'bg-green-500' },
    { ox: '1b', grade: 'B', label: '溃疡性结肠炎', color: 'bg-blue-500' },
    { ox: '2b', grade: 'C', label: '克罗恩病', color: 'bg-amber-500' },
    { ox: '4', grade: 'C', label: '自闭症ASD', color: 'bg-orange-500' },
    { ox: '5', grade: 'D', label: '帕金森(临床前)', color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: `${i * 150}ms`, opacity: 0 }}>
          <div className="w-16 text-right text-xs font-mono text-gray-500">{item.ox} · GRADE {item.grade}</div>
          <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${item.color} transition-all duration-1000`}
              style={{ width: `${70 + ((i * 17) % 30)}%`, animationDelay: `${i * 200 + 500}ms` }}
            />
          </div>
          <div className="w-36 text-xs text-gray-300">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// DataDashboard — 模拟实时数据面板
// ─────────────────────────────────────────────
function DataDashboard() {
  return (
    <div className="max-w-5xl mx-auto px-4 pb-20">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-white mb-2">数据面板</h2>
        <p className="text-gray-400 text-sm">实时追踪 · 每3天自动更新</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-mono">Last Sync</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-glow" />
          </div>
          <div className="text-2xl font-black text-white">2026-04-03 08:00</div>
          <div className="text-xs text-gray-500 mt-1">定时任务已执行</div>
          <div className="mt-3 bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
          </div>
        </div>
        {/* Card 2 */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-mono">Next Sync</span>
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse-glow" />
          </div>
          <div className="text-2xl font-black text-white">2026-04-06 08:00</div>
          <div className="text-xs text-gray-500 mt-1">距下次更新约 60h</div>
          <div className="mt-3 bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '35%' }} />
          </div>
        </div>
        {/* Card 3 */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-mono">Status</span>
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse-glow" />
          </div>
          <div className="text-2xl font-black text-white">M-DQA Active</div>
          <div className="text-xs text-gray-500 mt-1">双代理质量审查运行中</div>
          <div className="mt-3 bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: '80%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// LandingPage — 主组件
// ─────────────────────────────────────────────
export function LandingPage({ onEnterDoctor, onEnterPatient, onEnterLandingB, onEnterLandingC }: {
  onEnterDoctor: () => void;
  onEnterPatient: () => void;
  onEnterLandingB: () => void;
  onEnterLandingC: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#050d1a] text-white overflow-x-hidden">
      <ParticleCanvas />

      {/* 渐变叠加遮罩 */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-[#050d1a]/60 to-[#050d1a] pointer-events-none -z-5" />

      {/* ── Hero ── */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 animate-slide-up" style={{ animationDelay: '100ms', opacity: 0 }}>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-xl font-black shadow-[0_0_30px_rgba(99,102,241,0.5)]">F</div>
          <div className="text-left">
            <div className="text-xl font-black text-white">FMTWiki</div>
            <div className="text-xs text-gray-400">肠菌移植专业知识库</div>
          </div>
        </div>

        {/* 主标题 */}
        <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight animate-slide-up" style={{ animationDelay: '200ms', opacity: 0 }}>
          <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            循证 · 精准 · 智能
          </span>
        </h1>
        <p className="text-lg text-gray-400 mb-12 max-w-xl leading-relaxed animate-slide-up" style={{ animationDelay: '300ms', opacity: 0 }}>
          首个面向肠菌移植的垂直领域知识库<br />
          集成临床决策、循证文献、AI应用于一体
        </p>

        {/* 数字计数器 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-14">
          <CounterCard value={14} label="FMT适应证词条" color="blue" />
          <CounterCard value={21} label="研究团队收录" color="purple" />
          <CounterCard value={11} label="AI×FMT应用" color="green" />
          <CounterCard value={35} label="患者科普文章" color="amber" />
        </div>

        {/* CTA按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '500ms', opacity: 0 }}>
          <button
            onClick={onEnterDoctor}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-base
                       transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(37,99,235,0.5)]
                       flex items-center gap-2"
          >
            <span>👨‍⚕️</span> 进入医生端 <span>→</span>
          </button>
          <button
            onClick={onEnterPatient}
            className="px-8 py-4 bg-white/10 border border-white/20 hover:bg-white/20 text-white rounded-2xl font-bold text-base
                       transition-all hover:scale-105 backdrop-blur-md flex items-center gap-2"
          >
            <span>👤</span> 进入患者端 <span>→</span>
          </button>
        </div>
      </div>

      {/* ── 循证图谱 Section ── */}
      <div className="relative z-10 px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs text-blue-400 font-mono uppercase tracking-widest mb-2">Evidence Grade</div>
            <h2 className="text-3xl font-black text-white mb-2">循证分级，一目了然</h2>
            <p className="text-gray-400 text-sm">Oxford CEBM × GRADE 双轨系统 · 10个PMID溯源</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <EvidenceBar />
          </div>
        </div>
      </div>

      {/* ── 功能卡片 Section ── */}
      <div className="relative z-10 px-4 pb-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white mb-2">专业能力全景</h2>
            <p className="text-gray-400 text-sm">双端驱动，数据持续更新</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <GlassCard
              emoji="🔀" title="FMT临床决策树"
              desc="根据患者疾病类型→推荐方案→证据等级→参考团队，一步到位"
              tags={['14种适应证', 'PMID溯源', '推荐医院']} delay={0}
            />
            <GlassCard
              emoji="🔬" title="研究团队网络"
              desc="覆盖全国21家FMT研究中心，追踪最新临床进展与成果"
              tags={['南京/苏州/协和', '港中深/上交', '每3天更新']} delay={100}
            />
            <GlassCard
              emoji="🤖" title="AI精准配型"
              desc="DynaBiome等AI工具助力FMT精准配型，提升诊疗决策质量"
              tags={['DynaBiome LSTM', 'Transformer+微生物组', '数字孪生']} delay={200}
            />
            <GlassCard
              emoji="📚" title="患者科普内容"
              desc="35篇通俗科普，覆盖前世今生、治疗流程、医保政策、就诊指南"
              tags={['9大分类', '患者版入口', '医院地图']} delay={300}
            />
            <GlassCard
              emoji="📡" title="Science期刊追踪"
              desc="自动追踪FMT/微生物组/Science期刊最新论文"
              tags={['DOI溯源', '每日08:00', 'PubMed链接']} delay={400}
            />
            <GlassCard
              emoji="💊" title="药物相互作用"
              desc="15种药物与FMT的相互作用，临床决策实时参考"
              tags={['抗生素/PPI', '免疫抑制剂', 'refSource溯源']} delay={500}
            />
          </div>
        </div>
      </div>

      {/* ── 数据仪表盘 ── */}
      <DataDashboard />

      {/* ── 底部CTA ── */}
      <div className="relative z-10 px-4 pb-20 text-center">
        <div className="max-w-2xl mx-auto bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl border border-white/10 p-10 backdrop-blur-md">
          <h2 className="text-2xl font-black text-white mb-3">准备好探索了吗？</h2>
          <p className="text-gray-400 text-sm mb-6">FMTWiki 由 Minimax Agent AI 驱动，持续追踪全球FMT最新进展</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onEnterDoctor}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all hover:scale-105"
            >
              👨‍⚕️ 医生端入口
            </button>
            <button
              onClick={onEnterPatient}
              className="px-6 py-3 bg-white/10 border border-white/20 hover:bg-white/20 text-white rounded-xl font-bold transition-all hover:scale-105"
            >
              👤 患者端入口
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-4 mb-2">
            M-DQA双代理质量审查 · 来源必链 · 循证优先
          </p>
          <button
            onClick={onEnterLandingB}
            className="text-xs text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors"
          >
            🎨 Effect B · 数据仪表盘版 →
          </button>
          <button
            onClick={onEnterLandingC}
            className="text-xs text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors"
          >
            🧬 Effect C · DNA双螺旋沉浸版 →
          </button>
        </div>
      </div>
    </div>
  );
}
