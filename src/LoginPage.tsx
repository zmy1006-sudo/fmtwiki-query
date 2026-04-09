import React from 'react';

interface LoginPageProps {
  onEnter: (type: 'doctor' | 'patient') => void;
  onAISearch: (portal: 'doctor' | 'patient') => void;
  onShowEvidenceGuide?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onEnter, onAISearch, onShowEvidenceGuide }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex flex-col items-center justify-center px-4 py-8">
      {/* Logo区域 */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 mb-4 shadow-lg shadow-blue-500/30">
          <span className="text-white text-2xl font-black">F</span>
        </div>
        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">FMTWiki</h1>
        <p className="text-blue-300 text-sm font-medium">肠菌移植专业知识库</p>
      </div>

      {/* 两入口卡片 */}
      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 医生端 */}
        <button
          onClick={() => onEnter('doctor')}
          className="group relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30 active:scale-100"
        >
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
              <span className="text-2xl">👨‍⚕️</span>
            </div>
            <h2 className="text-white text-xl font-bold mb-1">医生端</h2>
            <p className="text-blue-200 text-sm font-medium mb-3">专业版</p>
            <p className="text-blue-100/80 text-xs leading-relaxed">适合医学专业人员<br />包含适应证、团队、AI应用、科学文献</p>
            <div className="mt-4 flex items-center gap-2 text-white/90 text-xs font-semibold group-hover:gap-3 transition-all">
              <span>进入专业版</span>
              <span>→</span>
            </div>
          </div>
          {/* 装饰光效 */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-blue-400/10 rounded-full blur-xl" />
        </button>

        {/* 患者端 */}
        <button
          onClick={() => onEnter('patient')}
          className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-100"
        >
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
              <span className="text-2xl">👤</span>
            </div>
            <h2 className="text-white text-xl font-bold mb-1">患者端</h2>
            <p className="text-emerald-200 text-sm font-medium mb-3">科普版</p>
            <p className="text-emerald-100/80 text-xs leading-relaxed">适合患者和家属<br />通俗易懂，涵盖治疗全程科普</p>
            <div className="mt-4 flex items-center gap-2 text-white/90 text-xs font-semibold group-hover:gap-3 transition-all">
              <span>进入科普版</span>
              <span>→</span>
            </div>
          </div>
          {/* 装饰光效 */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-teal-300/10 rounded-full blur-xl" />
        </button>
      </div>

      {/* AI 智能搜索入口 */}
      <div className="mt-4 w-full max-w-2xl">
        <button
          onClick={() => onAISearch('doctor')}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium text-sm hover:opacity-90 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
        >
          <span className="text-lg">🔍</span>
          <span>AI 智能搜索 · 输入问题，即时分析</span>
        </button>
        <button
          onClick={() => onAISearch('patient')}
          className="w-full mt-2 py-2.5 bg-white/10 text-blue-200 rounded-xl font-medium text-xs hover:bg-white/20 transition flex items-center justify-center gap-2"
        >
          <span className="text-sm">🔍</span>
          <span>患者端AI搜索入口</span>
        </button>
        {onShowEvidenceGuide && (
          <button
            onClick={onShowEvidenceGuide}
            className="w-full mt-2 py-2.5 bg-white border border-blue-200 text-blue-600 rounded-xl font-medium text-sm hover:bg-blue-50 transition flex items-center justify-center gap-2"
          >
            <span className="text-lg">📊</span>
            <span>证据等级说明</span>
          </button>
        )}
      </div>

      {/* 底部版权信息 */}
      <div className="mt-10 text-center">
        <p className="text-blue-400/50 text-xs">FMTWiki © 2026 · 仅供医学参考，不构成临床决策依据</p>
      </div>
    </div>
  );
};

export default LoginPage;
