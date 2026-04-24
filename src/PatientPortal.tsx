import React, { useState, useMemo, useRef } from 'react';
import { patientEduArticles, type PatientEduArticle } from './data/patientEdu';
import { search, type SearchRecord } from './data/searchIndex';
import { callGLMStream, cleanMarkdown } from './lib/aiSearch';
import PatientEduDetail from './PatientEduDetail';
import HospitalMapPanel from './HospitalMapPanel';
import FloatingAIDrawer from './components/FloatingAIDrawer';
import SearchResultsPanel from './SearchResultsPanel';


type PatientEduCategory = '全部' | '前世今生' | '适应证' | '治疗流程' | '政策规范' | '医保报销' | '知情同意' | '日常管理' | '就诊指南' | '医院地图';

const CATEGORIES: PatientEduCategory[] = ['全部', '前世今生', '适应证', '治疗流程', '政策规范', '医保报销', '知情同意', '日常管理', '就诊指南', '医院地图'];
const categoryColors: Record<string, string> = {
  '前世今生': 'bg-blue-100 text-blue-700', '适应证': 'bg-red-100 text-red-700',
  '治疗流程': 'bg-green-100 text-green-700', '政策规范': 'bg-amber-100 text-amber-700',
  '医保报销': 'bg-purple-100 text-purple-700', '知情同意': 'bg-pink-100 text-pink-700',
  '日常管理': 'bg-teal-100 text-teal-700', '就诊指南': 'bg-indigo-100 text-indigo-700',
};
const categoryIcons: Record<string, string> = {
  '前世今生': '📖', '适应证': '💊', '治疗流程': '🏥', '政策规范': '📋',
  '医保报销': '💰', '知情同意': '⚖️', '日常管理': '🌿', '就诊指南': '🗺️',
};

function ArticleCard({ article, onClick }: { article: PatientEduArticle; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="w-full text-left bg-white rounded-2xl border border-gray-200 p-4 hover:border-emerald-300 hover:shadow-md transition group">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${categoryColors[article.category] || 'bg-gray-100 text-gray-600'}`}>{article.category}</span>
            <span className="text-xs text-gray-300">·</span>
            <span className="text-xs text-gray-400">{article.lastUpdated}</span>
          </div>
          <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-700 transition leading-snug mb-1">{article.title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">{article.summary}</p>
          <div className="flex flex-wrap gap-1">
            {article.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-1.5 py-0.5 bg-gray-50 text-gray-400 rounded text-xs">{tag}</span>
            ))}
          </div>
        </div>
        <svg className="w-5 h-5 text-gray-300 group-hover:text-emerald-400 transition flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}

export default function PatientPortal({ onLogout, onOpenUserCenter }: { onLogout: () => void; onOpenUserCenter?: () => void }) {
  const [activeCategory, setActiveCategory] = useState<PatientEduCategory>('全部');
  const [selectedArticle, setSelectedArticle] = useState<PatientEduArticle | null>(null);
  const [searchActive, setSearchActive] = useState(false);
  const [showAISearch, setShowAISearch] = useState(false);
  const [showFloatingAI, setShowFloatingAI] = useState(false);
  const floatingAIBtnRef = useRef<HTMLButtonElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchRecord[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  // AI response state
  const [aiContent, setAiContent] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const aiAbortRef = React.useRef<(() => void) | null>(null);

  function clearSearch() {
    setSearchQuery('');
    setSearchResults(null);
    setSearchError(null);
    setSearchLoading(false);
    setAiContent('');
    setAiError(null);
    setAiLoading(false);
    aiAbortRef.current?.();
  }

  function handlePatientSearch() {
    const q = searchQuery.trim();
    if (!q) { clearSearch(); return; }

    // Stop previous AI
    aiAbortRef.current?.();

    setSearchLoading(true);
    setSearchError(null);
    setSearchResults(null);
    setAiContent('');
    setAiError(null);
    setAiLoading(false);

    // ── 并行执行：知识库搜索 + AI分析 ──
    // 1. 知识库搜索（同步，快）
    try {
      const kbResults = search(q, 'patient');
      setSearchResults(kbResults);
    } catch (e: any) {
      console.error('KB search error:', e);
      setSearchError('知识库搜索暂时不可用');
      setSearchResults([]);
    }
    setSearchLoading(false);

    // 2. AI分析（异步，流式）
    setAiLoading(true);
    let rawAccContent = '';
    const onToken = (token: string, done: boolean) => {
      rawAccContent += token;
      if (done) {
        setAiContent(cleanMarkdown(rawAccContent));
        setAiLoading(false);
      } else {
        // 每5个token刷新一次（避免频繁setState，同时保持响应感）
        if (rawAccContent.length % 20 < token.length) {
          setAiContent(cleanMarkdown(rawAccContent));
        }
      }
    };
    const onError = (msg: string) => {
      setAiError(msg);
      setAiLoading(false);
    };
    callGLMStream(q, 'patient', onToken, onError)
      .then(({ abort }) => { aiAbortRef.current = abort; })
      .catch(() => {});
  }

  const filteredArticles = useMemo(() => {
    if (activeCategory === '全部' || activeCategory === '医院地图') return patientEduArticles;
    return patientEduArticles.filter(a => a.category === activeCategory);
  }, [activeCategory]);

  // 单独触发AI搜索（AI按钮直接调用）
  function triggerAISearch() {
    const q = searchQuery.trim();
    if (!q) return;
    aiAbortRef.current?.();
    setAiContent('');
    setAiError(null);
    setAiLoading(true);
    let raw = '';
    const onToken = (token: string, done: boolean) => {
      raw += token;
      setAiContent(cleanMarkdown(raw));
      if (done) setAiLoading(false);
    };
    const onErr = (msg: string) => { setAiError(msg); setAiLoading(false); };
    callGLMStream(q, 'patient', onToken, onErr)
      .then(({ abort }) => { aiAbortRef.current = abort; })
      .catch(() => { setAiLoading(false); });
  }

  if (selectedArticle) {
    return <PatientEduDetail article={selectedArticle} onBack={() => setSelectedArticle(null)} onRelatedClick={a => setSelectedArticle(a)} />;
  }

  const hasSearch = searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <span className="text-white text-sm font-black">F</span>
            </div>
            <div>
              <h1 className="text-sm font-bold">FMTWiki 科普版</h1>
              <p className="text-xs text-white/60">通俗易懂，安心阅读</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full">👤 患者</span>
            <button onClick={onLogout} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition">退出</button>
          </div>
        </div>
      </div>

      {/* Disclaimer banner */}
      <div className="bg-emerald-50 border-b border-emerald-100 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="bg-white rounded-xl p-3 flex items-start gap-3 shadow-sm">
            <span className="text-xl flex-shrink-0">💡</span>
            <div>
              <p className="text-xs font-bold text-emerald-700 mb-0.5">温馨提示</p>
              <p className="text-xs text-gray-500 leading-relaxed">以下内容仅供科普参考，不构成医疗建议。如有疑问，请咨询专业医生。</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0 overflow-x-auto">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1 py-2">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => { setActiveCategory(cat); if (!hasSearch) { setSearchResults(null); setAiContent(''); setAiError(null); } }}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition whitespace-nowrap ${activeCategory === cat ? 'bg-emerald-500 text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                {cat === '全部' ? '📚 全部' : `${categoryIcons[cat] || ''} ${cat}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Bar — always visible */}
      <div className="px-4 py-3 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input type="text" value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handlePatientSearch()}
                placeholder="搜索FMT科普知识…"
                className="w-full pl-9 pr-24 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition" />
              <button onClick={handlePatientSearch}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition shadow-sm">
                搜索
              </button>
              {/* AI助手按钮 — 直接触发AI搜索 */}
              <button onClick={() => { if (searchQuery.trim()) triggerAISearch(); }}
                className="absolute right-[72px] top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-medium transition shadow-sm">
                🤖 AI
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* ── 搜索结果 + AI回答 ── */}
      {hasSearch && (
        <div className="flex-1">
          <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">

            {/* KB Loading */}
            {searchLoading && (
              <div className="flex items-center gap-3 py-3 px-4 bg-emerald-50 rounded-xl">
                <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-emerald-700">正在检索知识库…</span>
              </div>
            )}

            {/* KB 搜索结果 */}
            {!searchLoading && searchResults !== null && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-400">
                    📖 知识库找到 <span className="font-semibold text-gray-600">{searchResults.length}</span> 条相关科普
                  </p>
                  <button onClick={clearSearch} className="text-xs text-gray-400 hover:text-gray-600">✕ 清除</button>
                </div>
                {searchResults.length > 0 ? (
                  <div className="space-y-2">
                    {searchResults.slice(0, 10).map(r => {
                      const article = patientEduArticles.find(a => `patientEdu-${a.id}` === r.id);
                      return (
                        <button key={r.id}
                          onClick={() => { if (article) { setSelectedArticle(article); } }}
                          className="w-full text-left p-4 bg-white rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-sm transition">
                          <p className="text-sm font-semibold text-gray-800">{r.title}</p>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-1">{r.summary}</p>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-4 px-4 bg-gray-50 rounded-xl text-center">
                    <p className="text-gray-400 text-sm">📖 知识库暂无「{searchQuery}」相关内容</p>
                  </div>
                )}
              </div>
            )}

            {/* AI 分析结果 */}
            {(aiLoading || aiContent || aiError) && (
              <div className="mt-2">
                {/* AI Loading */}
                {aiLoading && (
                  <div className="flex items-center gap-3 py-3 px-4 bg-blue-50 border border-blue-100 rounded-xl mb-3">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <div>
                      <p className="text-sm text-blue-700 font-medium">🤖 DeepSeek AI 分析中…</p>
                      <p className="text-xs text-blue-400">基于模型 FMT 医学知识，约需 3-5 秒</p>
                    </div>
                    <button onClick={() => { aiAbortRef.current?.(); setAiLoading(false); setAiContent(''); setAiError(null); }}
                      className="ml-auto px-3 py-1 bg-white border border-blue-200 text-blue-600 rounded-lg text-xs hover:bg-blue-50 transition">
                      ⏹ 停止
                    </button>
                  </div>
                )}

                {/* AI 错误 */}
                {aiError && !aiLoading && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-3">
                    <p className="text-sm text-red-600">⚠️ {aiError}</p>
                  </div>
                )}

                {/* AI 回答卡片 */}
                {aiContent && (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 flex items-center gap-2">
                      <span className="text-white text-sm">🤖</span>
                      <div>
                        <p className="text-sm font-bold text-white">DeepSeek AI 回答</p>
                        <p className="text-xs text-white/60">基于模型 FMT 医学知识 · {aiContent.length} 字</p>
                      </div>
                      <span className="ml-auto px-1.5 py-0.5 bg-white/20 rounded text-xs text-white/80">患者版</span>
                    </div>
                    <div className="px-4 py-4">
                      <div className="text-sm text-gray-700 leading-7 whitespace-pre-line">{aiContent}</div>
                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-start gap-2 bg-amber-50 rounded-xl px-3 py-2">
                        <span className="text-amber-400 text-sm">⚠️</span>
                        <p className="text-xs text-amber-700 leading-relaxed">
                          <strong>免责声明：</strong>以上 AI 回答基于 DeepSeek 模型 FMT 医学知识，仅供参考，不构成诊断依据，请遵医嘱。
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 搜索无结果且 AI 还在分析中 */}
            {!searchLoading && !aiLoading && !aiContent && !aiError && searchResults !== null && searchResults.length === 0 && (
              <div className="text-center py-8">
                <p className="text-4xl mb-3">🔍</p>
                <p className="text-gray-500 text-sm">未找到「{searchQuery}」相关内容</p>
                <p className="text-gray-400 text-xs mt-1">DeepSeek AI 正在分析中，请稍候…</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 正常文章列表（未搜索时） ── */}
      {!hasSearch && (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-4 space-y-3">
            {activeCategory === '医院地图' ? (
              <HospitalMapPanel />
            ) : filteredArticles.length > 0 ? (
              <>
                <p className="text-xs text-gray-400 mb-1">
                  {activeCategory === '全部' ? '全部文章' : `${activeCategory}相关`}：共{filteredArticles.length}篇
                </p>
                {filteredArticles.map(article => (
                  <ArticleCard key={article.id} article={article} onClick={() => setSelectedArticle(article)} />
                ))}
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-5xl mb-3">📖</p>
                <p className="text-gray-500 text-sm">该分类暂无文章</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Disclaimer footer */}
      <div className="max-w-4xl mx-auto px-4 pb-4">
        <div className="bg-gray-100 rounded-xl p-3 text-xs text-gray-400 text-center leading-relaxed">
          <strong>免责声明：</strong>本页面内容仅供科普参考，不构成医疗建议。<br />
          具体诊疗方案请遵医嘱，FMT为研究性/探索性治疗，请选择正规有资质医疗机构。
        </div>
      </div>

      {/* 浮动AI助手（受控模式） */}
      <FloatingAIDrawer portal="patient" open={showFloatingAI} onOpenChange={setShowFloatingAI} />

      {/* 右下角浮动AI入口 */}
      {!showFloatingAI && !showAISearch && (
        <button
          ref={floatingAIBtnRef}
          onClick={() => setShowFloatingAI(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center transition hover:scale-110"
          style={{ boxShadow: '0 4px 20px rgba(16,185,129,0.4)' }}
          aria-label="打开AI助手"
        >
          <span className="text-2xl">🤖</span>
        </button>
      )}
    </div>
  );
}
