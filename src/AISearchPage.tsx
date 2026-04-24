/**
 * AISearchPage — 全屏AI搜索页
 *
 * 布局（自上而下单列）：
 * ┌────────────────────────────────────────────┐
 * │ ← 返回  FMTWiki AI 搜索          [深色顶栏] │
 * ├────────────────────────────────────────────┤
 * │ [  输入关键词或问题…         ] [搜索]     │ ← 固定在页面顶部
 * ├────────────────────────────────────────────┤
 * │ ┌─ 📚 知识库检索 ────────── 3条 ────────┐ │
 * │ │  🟢 艰难梭菌感染(rCDI)              │ │
 * │ │  🔵 溃疡性结肠炎                    │ │
 * │ └───────────────────────────────────────┘ │
 * │ ┌─ 🤖 DeepSeek AI 分析 ───────────────┐ │
 * │ │  ## 标题  **加粗**  • 列表  > 引用  │ │ ← Markdown 渲染
 * │ │  [代码框]                           │ │
 * │ │  ──────────────────────────────     │ │
 * │ │  参考文献列表                        │ │
 * │ │  ⚠️ 免责声明                         │ │
 * │ └───────────────────────────────────────┘ │
 * └────────────────────────────────────────────┘
 */

import React, { useState, useRef, useEffect } from 'react';
import { search, type SearchRecord, TYPE_LABELS, TYPE_COLORS } from './data/searchIndex';
import { callGLMStream, renderMarkdown, cleanMarkdown } from './lib/aiSearch';

interface Props {
  portal: 'doctor' | 'patient';
  onBack: () => void;
}

export default function AISearchPage({ portal, onBack }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchRecord[]>([]);
  const [aiContent, setAiContent] = useState('');
  const [aiThinking, setAiThinking] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<SearchRecord | null>(null);
  const [kbEmpty, setKbEmpty] = useState(false);
  const [kbLoading, setKbLoading] = useState(false);
  const abortRef = useRef<(() => void) | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const aiContentRef = useRef<HTMLDivElement>(null);
  const isDoctor = portal === 'doctor';

  // 自动聚焦
  useEffect(() => { inputRef.current?.focus(); }, []);

  // 自动滚动到AI内容
  useEffect(() => {
    if (aiContent && aiContentRef.current) {
      aiContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [aiContent]);

  function handleStop() {
    abortRef.current?.();
    setAiThinking(false);
  }

  function handleClear() {
    abortRef.current?.();
    setQuery('');
    setResults([]);
    setAiContent('');
    setAiThinking(false);
    setAiError(null);
    setSearched(false);
    setSelectedRecord(null);
    setKbEmpty(false);
    inputRef.current?.focus();
  }

  async function handleSearch() {
    const q = query.trim();
    if (!q) return;
    abortRef.current?.();
    setSearched(true);
    setResults([]);
    setAiContent('');
    setAiThinking(false);
    setAiError(null);
    setSelectedRecord(null);
    setKbEmpty(false);
    setKbLoading(true);
    setAiThinking(true); // 先显示AI加载状态

    // ── 阶段1：知识库检索 ──
    await new Promise(r => setTimeout(r, 0));
    let kbResults: SearchRecord[] = [];
    try {
      kbResults = search(q, portal);
      if (kbResults.length === 0) {
        // 尝试不加portal过滤的全量搜索
        kbResults = search(q, undefined);
      }
    } catch (e) {
      console.error('[KB Search Error]', e);
    }
    setResults(kbResults);
    setKbLoading(false);
    const empty = kbResults.length === 0;
    setKbEmpty(empty);

    // ── 阶段2：AI 流式分析 ──
    let accContent = '';

    // 医生端：累积原始 Markdown，完成后一次性渲染（避免碎片 HTML）
    // 患者端：累积纯文本，完成后一次性清理 Markdown 符号
    let rawAccContent = '';

    const onToken = (token: string, done: boolean) => {
      rawAccContent += token;
      if (done) {
        // 流结束时一次性渲染完整内容
        const final = isDoctor ? renderMarkdown(rawAccContent) : cleanMarkdown(rawAccContent);
        setAiContent(final);
        setAiThinking(false);
      } else {
        // 打字过程中：医生端用完整累积 HTML，患者端用累积纯文本
        if (isDoctor) {
          const partial = renderMarkdown(rawAccContent);
          setAiContent(partial);
        } else {
          setAiContent(cleanMarkdown(rawAccContent));
        }
      }
    };

    const onError = (msg: string) => {
      console.error('[AI Error]', msg);
      setAiError(msg);
      setAiThinking(false);
    };

    try {
      const { abort } = await callGLMStream(q, portal, onToken, onError);
      abortRef.current = abort;
    } catch (e) {
      console.error('[AI Catch Error]', e);
      onError('AI 分析失败，请检查网络后重试。');
    }
  }

  const placeholder = isDoctor
    ? '输入疾病、指南、团队、FMT适应证… 或直接提问'
    : '输入症状或疾病名称，AI为您分析…';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── 顶部导航栏 ─────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0 sticky top-0 z-20 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              🤖
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-gray-900 truncate">FMTWiki AI 搜索</h1>
              <p className="text-xs text-gray-400">知识库 + DeepSeek 双通道</p>
            </div>
          </div>
        </div>

        {/* ── 搜索框 ─────────────────────────────────── */}
        <div className="max-w-2xl mx-auto px-4 pb-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder={placeholder}
                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition shadow-sm"
              />
              {searched && (
                <button
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition p-0.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              disabled={!query.trim() || aiThinking}
              className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl text-sm font-bold transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 flex-shrink-0"
            >
              {aiThinking ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
              <span>{aiThinking ? '分析中' : '搜索'}</span>
            </button>
          </div>

          {/* 搜索状态提示 */}
          {searched && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-gray-400">
                搜索「<span className="text-emerald-600 font-semibold">{query}</span>」—
              </span>
              <span className={`text-xs font-medium ${results.length > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>
                知识库 {results.length} 条
              </span>
              {kbEmpty && (
                <span className="text-xs text-emerald-600 animate-pulse">
                  📡 启动 DeepSeek AI 分析…
                </span>
              )}
              {!kbEmpty && (
                <span className="text-xs text-indigo-400">🤖 AI 分析中…</span>
              )}
              <button onClick={handleClear} className="ml-auto text-xs text-gray-400 hover:text-gray-600 transition">
                清除
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── 主内容区 ──────────────────────────────────── */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-5 space-y-4">

        {/* 知识库结果 */}
        {searched && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-white text-base">📚</span>
                <span className="text-sm font-bold text-white">知识库检索</span>
                {kbLoading && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-emerald-200">检索中…</span>
                  </div>
                )}
                {kbEmpty && !kbLoading && (
                  <span className="text-xs text-emerald-200 animate-pulse">无命中，AI分析中…</span>
                )}
              </div>
              <span className="px-2.5 py-0.5 bg-white/20 text-white text-xs rounded-full font-medium">
                {results.length} 条
              </span>
            </div>

            {results.length > 0 ? (
              <div className="p-4 space-y-2">
                {results.slice(0, 10).map((r, i) => (
                  <button
                    key={r.id || i}
                    onClick={() => setSelectedRecord(selectedRecord?.id === r.id ? null : r)}
                    className={`w-full text-left p-4 rounded-xl border transition hover:shadow-sm ${
                      selectedRecord?.id === r.id
                        ? 'border-emerald-400 bg-emerald-50'
                        : 'border-gray-100 hover:border-emerald-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${TYPE_COLORS[r.type] || 'bg-gray-100 text-gray-600'}`}>
                            {TYPE_LABELS[r.type] || r.type}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 leading-snug mb-1">{r.title}</p>
                        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{r.summary}</p>
                      </div>
                      <svg className={`w-4 h-4 mt-1 flex-shrink-0 transition ${selectedRecord?.id === r.id ? 'text-emerald-600 rotate-90' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>

                    {/* 展开详情 */}
                    {selectedRecord?.id === r.id && (
                      <div className="mt-3 pt-3 border-t border-blue-100">
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{r.summary}</p>
                        {r.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {r.tags.map(tag => (
                              <span key={tag} className="px-2 py-0.5 bg-blue-50 text-emerald-600 rounded-full text-xs">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                ))}
                {results.length > 10 && (
                  <p className="text-xs text-center text-gray-400 py-2">
                    还有 {results.length - 10} 条结果…
                  </p>
                )}
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-3xl mb-2">🔍</p>
                <p className="text-sm text-gray-500">知识库暂无「{query}」相关内容</p>
                <p className="text-xs text-emerald-600 mt-1.5 animate-pulse">📡 正在通过 DeepSeek AI 进行分析…</p>
              </div>
            )}
          </div>
        )}

        {/* AI 分析结果 */}
        {(searched && (aiContent || aiThinking || aiError)) && (
          <div ref={aiContentRef} className="bg-white rounded-2xl border border-indigo-100 shadow-md overflow-hidden">
            {/* 紫色渐变头部 */}
            <div className="px-5 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-white text-base">🤖</span>
                <div>
                  <p className="text-sm font-bold text-white">DeepSeek AI 分析</p>
                  <p className="text-xs text-white/60">
                    {results.length > 0
                      ? `参考 ${results.length} 条知识库来源`
                      : '基于 FMT 医学知识'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {aiThinking && (
                  <button
                    onClick={handleStop}
                    className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white text-xs rounded-lg transition"
                    title="停止生成"
                  >
                    ⏹ 停止
                  </button>
                )}
                {aiContent && (
                  <button
                    onClick={() => navigator.clipboard.writeText(aiContent.replace(/<[^>]+>/g, ''))}
                    className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white text-xs rounded-lg transition"
                    title="复制回答"
                  >
                    📋 复制
                  </button>
                )}
                {aiContent && (
                  <span className="px-2 py-0.5 bg-white/20 text-white text-xs rounded-full">
                    {aiContent.length} 字
                  </span>
                )}
              </div>
            </div>

            {/* AI 内容 */}
            <div className="px-5 py-4">
              {/* 加载动画 */}
              {aiThinking && !aiContent && (
                <div className="flex items-center gap-2.5 mb-4 pb-4 border-b border-indigo-50">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                  </div>
                  <span className="text-xs text-indigo-400">DeepSeek 正在生成回答…</span>
                </div>
              )}

              {/* 错误提示 */}
              {aiError && !aiThinking && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl mb-3">
                  <p className="text-xs text-red-600">⚠️ {aiError}</p>
                </div>
              )}

              {/* 回答内容（Markdown 渲染） */}
              {aiContent && (
                <>
                  {isDoctor ? (
                    <div
                      className={`
                        text-sm text-gray-700 leading-8
                        [&>h1]:text-xl [&>h1]:font-bold [&>h1]:text-gray-900 [&>h1]:mt-6 [&>h1]:mb-3
                        [&>h2]:text-lg [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mt-5 [&>h2]:mb-3 [&>h2]:border-b [&>h2]:border-gray-100 [&>h2]:pb-2
                        [&>h3]:text-base [&>h3]:font-bold [&>h3]:text-gray-800 [&>h3]:mt-4 [&>h3]:mb-2
                        [&>h4]:text-sm [&>h4]:font-bold [&>h4]:text-gray-800 [&>h4]:mt-3 [&>h4]:mb-1.5
                        [&>p]:text-sm [&>p]:text-gray-700 [&>p]:leading-8 [&>p]:my-3
                        [&>ul]:space-y-1.5 [&>ul]:my-3 [&>ul]:list-disc [&>ul]:list-inside
                        [&>ul>li]:text-sm [&>ul>li]:text-gray-700 [&>ul>li]:leading-7 [&>ul>li]:marker:text-blue-400 [&>ul>li]:break-words [&>ul>li]:overflow-wrap-break-word [&>ul>li]:min-w-0
                        [&>ol]:space-y-1.5 [&>ol]:my-3 [&>ol]:list-decimal [&>ol]:list-inside
                        [&>ol>li]:text-sm [&>ol>li]:text-gray-700 [&>ol>li]:leading-7 [&>ol>li]:break-words [&>ol>li]:overflow-wrap-break-word [&>ol>li]:min-w-0
                        [&>blockquote]:border-l-4 [&>blockquote]:border-indigo-400 [&>blockquote]:bg-indigo-50 [&>blockquote]:pl-4 [&>blockquote]:py-3 [&>blockquote]:my-3 [&>blockquote]:rounded-r-xl [&>blockquote]:text-sm [&>blockquote]:text-indigo-700
                        [&>pre]:bg-gray-900 [&>pre]:text-gray-100 [&>pre]:rounded-xl [&>pre]:px-4 [&>pre]:py-3 [&>pre]:text-xs [&>pre]:font-mono [&>pre]:overflow-x-auto [&>pre]:my-3 [&>pre]:leading-relaxed
                        [&>code]:bg-gray-100 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-xs [&>code]:font-mono [&>code]:text-pink-600
                        [&>pre>code]:bg-transparent [&>pre>code]:p-0 [&>pre>code]:text-white
                        [&>strong]:font-bold [&>strong]:text-gray-900
                        [&>em]:italic [&>em]:text-gray-500
                        [&>del]:line-through [&>del]:text-gray-400
                      `}
                      dangerouslySetInnerHTML={{ __html: aiContent }}
                    />
                  ) : (
                    <div className="text-sm text-gray-700 leading-8 whitespace-pre-line">{aiContent}</div>
                  )}

                  {/* 打字光标 */}
                  {aiThinking && (
                    <span className="inline-block w-2 h-4 bg-indigo-500 ml-1 animate-pulse rounded-sm align-middle" />
                  )}
                </>
              )}

              {!aiContent && !aiThinking && !aiError && (
                <div className="text-center py-6">
                  <p className="text-3xl mb-2">🤖</p>
                  <p className="text-sm text-gray-400">
                    {kbEmpty ? '正在分析…' : '等待生成回答…'}
                  </p>
                </div>
              )}
            </div>

            {/* 参考文献 */}
            {results.length > 0 && aiContent && !aiThinking && (
              <div className="px-5 pb-4 border-t border-indigo-50 pt-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">参考文献</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {results.slice(0, 8).map((r, i) => (
                    <div key={r.id || i} className="flex items-start gap-2.5">
                      <span className="text-xs text-indigo-300 mt-0.5 font-bold w-4 text-right">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-700 font-medium leading-snug">{r.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{r.meta?.source || TYPE_LABELS[r.type] || r.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 免责声明 */}
            <div className="px-5 pb-4">
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <p className="text-xs text-amber-700 leading-relaxed">
                  ⚠️ <strong className="font-semibold">免责声明：</strong>
                  以上 AI 分析基于 DeepSeek 模型 FMT 医学知识
                  {results.length > 0 ? `（参考了 ${results.length} 条知识库来源）` : ''}，
                  仅供参考，不作为临床诊断依据，请遵医嘱。
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 空白状态 */}
        {!searched && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center text-4xl mb-5 shadow-sm">
              🤖
            </div>
            <h2 className="text-base font-bold text-gray-800 mb-2">FMTWiki AI 搜索</h2>
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              输入疾病、症状、指南或问题<br />
              知识库精准匹配 + DeepSeek 专业分析
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {['艰难梭菌感染', '溃疡性结肠炎', 'FMT适应证', '粪菌移植流程'].map(tag => (
                <button
                  key={tag}
                  onClick={() => { setQuery(tag); setTimeout(handleSearch, 100); }}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
