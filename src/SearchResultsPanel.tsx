/**
 * SearchResultsPanel — 内嵌式搜索结果面板
 *
 * 布局规则（方案C）：
 * - PC（≥640px）：左右并排 — 左侧📚知识库(蓝) | 右侧🤖AI(紫)
 * - 手机（<640px）：上下叠加 — 知识库在上，AI在下
 *
 * 交互规则：
 * - 输入框按回车或点击按钮触发
 * - 知识库无结果 → 显示提示 + 继续AI分析
 * - AI结果在KB展开后显示（KB无结果时直接显示AI）
 */

import React, { useState, useRef, useEffect } from 'react';
import { search, type SearchRecord, TYPE_LABELS, TYPE_COLORS } from './data/searchIndex';
import { callGLMStream, renderMarkdown, cleanMarkdown } from './lib/aiSearch';

interface Props {
  portal: 'doctor' | 'patient';
  /** 按下清除按钮时回调 */
  onClear?: () => void;
}

export default function SearchResultsPanel({ portal, onClear }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchRecord[]>([]);
  const [aiContent, setAiContent] = useState('');
  const [aiThinking, setAiThinking] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<SearchRecord | null>(null);
  const [kbEmpty, setKbEmpty] = useState(false);
  const abortRef = useRef<(() => void) | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isDoctor = portal === 'doctor';

  // 清理函数
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
    onClear?.();
  }

  function handleStop() {
    abortRef.current?.();
    setAiThinking(false);
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

    // ── 阶段1：知识库检索（同步） ──
    await new Promise(r => setTimeout(r, 0));
    const kbResults = search(q, portal);
    setResults(kbResults);
    const empty = kbResults.length === 0;
    setKbEmpty(empty);

    // ── 阶段2：AI 流式分析（并行） ──
    setAiThinking(true);
    let accContent = '';

    const onToken = (token: string, done: boolean) => {
      if (done) {
        setAiContent(accContent);
        setAiThinking(false);
      } else {
        const processed = isDoctor ? renderMarkdown(token) : cleanMarkdown(token);
        accContent += processed;
        setAiContent(accContent);
      }
    };

    const onError = (msg: string) => {
      setAiError(msg);
      setAiThinking(false);
    };

    try {
      const { abort } = await callGLMStream(q, portal, onToken, onError);
      abortRef.current = abort;
    } catch {
      onError('AI 分析失败，请稍后重试。');
    }
  }

  const hasResults = searched && (results.length > 0 || aiContent || aiThinking || aiError);

  return (
    <div className="w-full">
      {/* ── 搜索框 ─────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto">
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
                placeholder="搜索疾病、指南、团队、FMT适应证…"
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              {searched && (
                <button
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
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
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
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
              <span>{aiThinking ? '分析中…' : '搜索'}</span>
            </button>
          </div>
          {/* 提示标签 */}
          {searched && (
            <p className="text-xs text-gray-400 mt-1.5">
              搜索「<span className="text-blue-600 font-medium">{query}</span>」—
              知识库 <span className={results.length > 0 ? 'text-green-600' : 'text-gray-400'}>{results.length} 条</span>
              {results.length > 0 && kbEmpty === false && ' · '}
              {!kbEmpty && <span className="text-blue-500">DeepSeek AI 分析中…</span>}
            </p>
          )}
        </div>
      </div>

      {/* ── 搜索结果区 ─────────────────────────────── */}
      {hasResults && (
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/*
            布局：PC左右并排（grid-cols-2），手机上下叠加（grid-cols-1）
            AI在KB展开后显示 → AI卡片在右侧/下方，KB结果触发后AI立即出现
          */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* ── 左侧：知识库结果 ───────────────────── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* 蓝色头部 */}
              <div className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm">📚</span>
                  <span className="text-sm font-bold text-white">知识库检索</span>
                </div>
                <span className="px-2 py-0.5 bg-white/20 text-white text-xs rounded-full font-medium">
                  {results.length} 条
                </span>
              </div>

              {/* 结果列表 */}
              <div className="p-3 space-y-2 max-h-80 overflow-y-auto">
                {results.length > 0 ? (
                  results.slice(0, 8).map((r, i) => (
                    <button
                      key={r.id || i}
                      onClick={() => setSelectedRecord(r.id === selectedRecord?.id ? null : r)}
                      className={`w-full text-left p-3 rounded-xl border transition hover:shadow-sm ${
                        selectedRecord?.id === r.id
                          ? 'border-blue-400 bg-blue-50'
                          : 'border-gray-100 hover:border-blue-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`px-1.5 py-0.5 text-xs rounded ${TYPE_COLORS[r.type] || 'bg-gray-100 text-gray-600'}`}>
                          {TYPE_LABELS[r.type] || r.type}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-gray-800 leading-snug">{r.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{r.summary}</p>
                      {/* 展开详情 */}
                      {selectedRecord?.id === r.id && (
                        <div className="mt-2 pt-2 border-t border-blue-100">
                          <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{r.summary}</p>
                          {r.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {r.tags.map(tag => (
                                <span key={tag} className="px-1.5 py-0.5 bg-blue-50 text-blue-500 rounded text-xs">{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  ))
                ) : (
                  /* 知识库无结果 */
                  <div className="text-center py-6">
                    <p className="text-3xl mb-2">🔍</p>
                    <p className="text-sm text-gray-500">知识库暂无「{query}」相关内容</p>
                    <p className="text-xs text-blue-500 mt-1.5 animate-pulse">📡 启动 DeepSeek AI 分析…</p>
                  </div>
                )}
                {results.length > 8 && (
                  <p className="text-xs text-center text-gray-400 py-1">
                    还有 {results.length - 8} 条结果…
                  </p>
                )}
              </div>
            </div>

            {/* ── 右侧 / 下方：AI 分析 ──────────────── */}
            <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
              {/* 紫色头部 */}
              <div className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm">🤖</span>
                  <div>
                    <p className="text-sm font-bold text-white">DeepSeek AI 分析</p>
                    <p className="text-xs text-white/60">
                      {results.length > 0 ? `参考 ${results.length} 条来源` : '基于 FMT 医学知识'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {aiContent && (
                    <button
                      onClick={() => navigator.clipboard.writeText(aiContent.replace(/<[^>]+>/g, ''))}
                      className="px-2 py-1 bg-white/20 hover:bg-white/30 text-white text-xs rounded-lg transition"
                      title="复制回答"
                    >
                      📋
                    </button>
                  )}
                  {aiThinking && (
                    <button
                      onClick={handleStop}
                      className="px-2 py-1 bg-white/20 hover:bg-white/30 text-white text-xs rounded-lg transition"
                    >
                      ⏹
                    </button>
                  )}
                  {aiContent && (
                    <span className="px-2 py-0.5 bg-white/20 text-white text-xs rounded-full">
                      {aiContent.length} 字
                    </span>
                  )}
                </div>
              </div>

              {/* AI 内容区 */}
              <div className="p-4 min-h-32 max-h-96 overflow-y-auto">
                {/* 加载动画 */}
                {aiThinking && !aiContent && (
                  <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-indigo-50">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                    </div>
                    <span className="text-xs text-indigo-400">DeepSeek 正在生成回答…</span>
                  </div>
                )}

                {/* 错误 */}
                {aiError && !aiThinking && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl mb-3">
                    <p className="text-xs text-red-600">⚠️ {aiError}</p>
                  </div>
                )}

                {/* 回答内容 */}
                {aiContent ? (
                  <>
                    {isDoctor ? (
                      <div
                        className="text-sm text-gray-700 leading-7 [&>h1]:text-xl [&>h1]:font-bold [&>h1]:text-gray-900 [&>h1]:mt-5 [&>h1]:mb-3 [&>h2]:text-lg [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mt-5 [&>h2]:mb-3 [&>h2]:border-b [&>h2]:border-gray-100 [&>h2]:pb-2 [&>h3]:text-base [&>h3]:font-bold [&>h3]:text-gray-800 [&>h3]:mt-4 [&>h3]:mb-2 [&>p]:text-sm [&>p]:text-gray-700 [&>p]:leading-7 [&>p]:my-2 [&>ul>li]:text-sm [&>ul>li]:text-gray-700 [&>ul>li]:leading-6 [&>ul]:space-y-1 [&>ol>li]:text-sm [&>ol>li]:text-gray-700 [&>blockquote]:border-l-4 [&>blockquote]:border-indigo-300 [&>blockquote]:bg-indigo-50 [&>blockquote]:pl-3 [&>blockquote]:py-2 [&>blockquote]:my-2 [&>blockquote]:text-sm [&>blockquote]:text-indigo-700 [&>pre]:bg-gray-900 [&>pre]:text-gray-100 [&>pre]:rounded-xl [&>pre]:px-4 [&>pre]:py-3 [&>pre]:text-xs [&>pre]:font-mono"
                        dangerouslySetInnerHTML={{ __html: aiContent }}
                      />
                    ) : (
                      <div className="text-sm text-gray-700 leading-7 whitespace-pre-line">{aiContent}</div>
                    )}
                    {/* 打字光标 */}
                    {aiThinking && (
                      <span className="inline-block w-2 h-4 bg-indigo-500 ml-1 animate-pulse rounded-sm align-middle" />
                    )}
                  </>
                ) : (
                  !aiThinking && !aiError && (
                    <div className="text-center py-6">
                      <p className="text-3xl mb-2">🤖</p>
                      <p className="text-sm text-gray-400">
                        {kbEmpty ? 'AI 分析已启动…' : '等待 DeepSeek 生成回答…'}
                      </p>
                    </div>
                  )
                )}
              </div>

              {/* 参考文献 */}
              {results.length > 0 && !aiThinking && aiContent && (
                <div className="px-4 pb-3 border-t border-indigo-50">
                  <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide pt-2">参考文献</p>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {results.slice(0, 5).map((r, i) => (
                      <div key={r.id || i} className="flex items-start gap-2">
                        <span className="text-xs text-gray-300 mt-0.5">{i + 1}.</span>
                        <div>
                          <p className="text-xs text-gray-600 font-medium">{r.title}</p>
                          <p className="text-xs text-gray-400">{r.meta?.source || r.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 免责声明 */}
              <div className="px-4 pb-3">
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                  <p className="text-xs text-amber-700 leading-relaxed">
                    ⚠️ <strong>免责声明：</strong>
                    以上 AI 分析基于 DeepSeek 模型 FMT 医学知识
                    {results.length > 0 ? `（参考了 ${results.length} 条知识库来源）` : ''}，
                    仅供参考，不作为临床诊断依据，请遵医嘱。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 空白状态 ───────────────────────────────── */}
      {!searched && (
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-3xl mx-auto mb-4">
            🔍
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">输入关键词搜索</p>
          <p className="text-xs text-gray-400 max-w-xs mx-auto">
            支持疾病名、指南、团队、FMT适应证等
          </p>
        </div>
      )}
    </div>
  );
}
