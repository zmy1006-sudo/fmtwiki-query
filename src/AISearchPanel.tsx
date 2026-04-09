import { useState, useRef, useEffect } from 'react';
import { search, type SearchRecord, groupResults, type GroupedResults, TYPE_LABELS, TYPE_COLORS } from './data/searchIndex';
import { callGLMAnalysis, isConfigured } from './lib/aiSearch';

// =============================================================================
// 高亮组件
// =============================================================================
function Highlight({ text, tokens }: { text: string; tokens: string[] }) {
  if (!tokens.length || !text) return <>{text}</>;
  const pattern = tokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const regex = new RegExp(`(${pattern})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        tokens.some(t => t.toLowerCase() === part.toLowerCase())
          ? <mark key={i} className="bg-yellow-200 text-yellow-900 rounded px-0.5">{part}</mark>
          : <span key={i}>{part}</span>
      )}
    </>
  );
}

// =============================================================================
// 证据详情卡（右侧滑出面板）
// =============================================================================
function EvidenceDetail({ record, onClose }: { record: SearchRecord; onClose: () => void }) {
  const colors = TYPE_COLORS[record.type];
  const pmidMatch = record.content.match(/(?:PMID[:\s]*|pmid\.ncbi\.nlm\.nih\.gov\/)(\d{6,})/i);
  const pmid = pmidMatch ? pmidMatch[1] : null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* 遮罩 */}
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      {/* 滑出面板 */}
      <div className="w-full max-w-lg bg-white shadow-2xl overflow-y-auto">
        {/* 顶部栏 */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 ${colors.bg} ${colors.text} rounded text-xs font-bold`}>
              {TYPE_LABELS[record.type]}
            </span>
            {record.clinicalMeta?.grade && (
              <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs">
                证据 {record.clinicalMeta.grade}
              </span>
            )}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-lg transition">
            ✕
          </button>
        </div>

        {/* 内容 */}
        <div className="p-5 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 leading-snug">{record.title}</h2>

          {/* 匹配摘要 */}
          {record.snippet && (
            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-4">
              <Highlight text={record.snippet} tokens={record.matchedTokens ?? []} />
            </p>
          )}

          {/* 完整摘要 */}
          {record.summary && record.summary !== record.snippet && (
            <p className="text-sm text-gray-600 leading-relaxed">{record.summary}</p>
          )}

          {/* 疗效数据 */}
          {record.type === 'disease' && record.clinicalMeta?.efficacy && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
              <p className="text-xs font-bold text-red-600 mb-2">📊 临床疗效数据</p>
              <p className="text-xs text-red-700 leading-relaxed">{record.clinicalMeta.efficacy}</p>
            </div>
          )}

          {/* 团队信息 */}
          {record.type === 'team' && (
            <div className="space-y-2">
              {record.clinicalMeta?.leader && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-bold text-blue-600">👤</span>
                  <span className="text-gray-700">{record.clinicalMeta.leader}</span>
                </div>
              )}
              {record.clinicalMeta?.location && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-bold text-blue-600">📍</span>
                  <span className="text-gray-700">{record.clinicalMeta.location}</span>
                </div>
              )}
              {record.clinicalMeta?.directions && record.clinicalMeta.directions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {record.clinicalMeta.directions.map((d, i) => (
                    <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">{d}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 标签 */}
          {record.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {record.tags.map((tag, i) => (
                <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">#{tag}</span>
              ))}
            </div>
          )}

          {/* PMID */}
          {pmid && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-xs font-bold text-blue-600 mb-1">📚 原始文献</p>
              <a
                href={`https://pubmed.ncbi.nlm.nih.gov/${pmid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                PMID: {pmid} → PubMed 查看原文 ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// 主组件
// =============================================================================
interface AISearchPanelProps {
  portal: 'doctor' | 'patient';
  onResultClick?: (record: SearchRecord) => void;
  onBack?: () => void;
}

async function getAIAnalysis(query: string, results: SearchRecord[], portal: 'doctor' | 'patient'): Promise<string> {
  const context = results.slice(0, 10).map((r, i) =>
    `[${i + 1}] [${r.type}] ${r.title}\n摘要：${r.summary}\n标签：${r.tags.join(', ')}`
  ).join('\n\n');
  return await callGLMAnalysis(query, context, portal);
}

export function AISearchPanel({ portal, onResultClick, onBack }: AISearchPanelProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchRecord[]>([]);
  const [aiAnalysis, setAIAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<SearchRecord | null>(null);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<SearchRecord | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const groups = groupResults(results);
  const filteredResults = activeGroup ? results.filter(r => r.type === activeGroup) : results;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    setAIAnalysis(null);
    setSelectedRecord(null);
    setActiveGroup(null);

    const res = search(query, portal);
    setResults(res);

    // 并行调用AI分析
    if (res.length > 0) {
      try {
        const text = await getAIAnalysis(query, res, portal);
        setAIAnalysis(text);
      } catch {
        // AI失败不影响显示
      }
    }
    setLoading(false);
  }

  function handleSelect(r: SearchRecord) {
    setSelectedRecord(prev => prev?.id === r.id ? null : r);
  }

  const aiConfigured = isConfigured();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ══════════════ 顶部搜索栏 ══════════════ */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            {/* 返回 */}
            <button
              onClick={onBack}
              className="text-gray-400 hover:text-gray-700 text-xl leading-none transition shrink-0"
            >
              ‹
            </button>

            {/* 搜索框 */}
            <div className="flex-1 relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base">🔍</span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder={portal === 'doctor' ? '输入疾病、症状、治疗方案...' : '搜索FMT科普知识...'}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
            </div>

            {/* 搜索按钮 */}
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium rounded-xl transition shrink-0"
            >
              {loading ? '搜索中…' : '搜索'}
            </button>
          </div>

          {/* Portal标签 + AI状态 */}
          <div className="flex items-center gap-2 mt-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              portal === 'doctor' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {portal === 'doctor' ? '👨‍⚕️ 医生模式' : '👤 患者模式'}
            </span>
            {aiConfigured ? (
              <span className="flex items-center gap-1 text-xs text-green-600">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                AI 已连接
              </span>
            ) : (
              <span className="text-xs text-amber-500">⚠️ AI未连接</span>
            )}
            {searched && results.length > 0 && (
              <span className="text-xs text-gray-400">{results.length} 条相关结果</span>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════ 主内容区 ══════════════ */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-5 space-y-4">

        {/* ── 加载骨架 ── */}
        {loading && !aiAnalysis && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-5/6" />
          </div>
        )}

        {/* ── 未找到 ── */}
        {!loading && searched && results.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-500 font-medium">未找到相关知识库内容</p>
            <p className="text-gray-400 text-sm mt-1">请尝试其他关键词</p>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            AI 回答区（核心区域，优先展示）
        ══════════════════════════════════════════════ */}
        {aiAnalysis && (
          <div className="space-y-3">
            {/* AI回答主卡片 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm">🤖</div>
                <div>
                  <p className="text-sm font-bold text-gray-900">FMTWiki AI 分析</p>
                  <p className="text-xs text-gray-400">基于 {results.length} 条知识库内容</p>
                </div>
              </div>
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {aiAnalysis}
              </div>
            </div>

            {/* 参考文献来源 */}
            {results.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    📚 参考来源（{results.slice(0, 6).length} 条）
                  </p>
                </div>
                <div className="divide-y divide-gray-100">
                  {results.slice(0, 6).map((r, i) => {
                    const colors = TYPE_COLORS[r.type];
                    return (
                      <button
                        key={r.id}
                        onClick={() => setSelectedSource(r)}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition flex items-start gap-3"
                      >
                        <span className={`w-6 h-6 rounded-lg ${colors.bg} ${colors.text} text-xs font-bold flex items-center justify-center shrink-0 mt-0.5`}>
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-xs text-gray-400">{TYPE_LABELS[r.type]}</span>
                            {r.clinicalMeta?.grade && (
                              <span className="text-xs text-green-600">[{r.clinicalMeta.grade}]</span>
                            )}
                          </div>
                          <p className="text-sm font-medium text-gray-800 leading-tight line-clamp-1">
                            <Highlight text={r.title} tokens={r.matchedTokens ?? []} />
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                            {r.tags.slice(0, 3).map(t => `#${t}`).join(' ')}
                          </p>
                        </div>
                        <span className="text-gray-300 text-sm shrink-0 mt-1">›</span>
                      </button>
                    );
                  })}
                </div>
                {results.length > 6 && (
                  <div className="px-4 py-2.5 bg-gray-50 text-center">
                    <span className="text-xs text-gray-400">还有 {results.length - 6} 条结果，搜索更多内容可见</span>
                  </div>
                )}
              </div>
            )}

            {/* 免责声明 */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <p className="text-xs text-amber-700 leading-relaxed">
                ⚠️ <strong>免责声明：</strong>以上AI分析仅基于FMTWiki知识库内容生成，仅供参考，不作为诊断依据，请以医生诊断为准。如有不适请及时就医。
              </p>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            知识库检索结果（AI未激活时的兜底展示）
        ══════════════════════════════════════════════ */}
        {!aiAnalysis && !loading && results.length > 0 && (
          <div className="space-y-3">
            {/* 分组过滤 */}
            {groups.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <button
                  onClick={() => setActiveGroup(null)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                    !activeGroup ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
                  }`}
                >
                  全部 {results.length}
                </button>
                {groups.map(g => (
                  <button
                    key={g.type}
                    onClick={() => setActiveGroup(g.type === activeGroup ? null : g.type)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                      activeGroup === g.type ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
                    }`}
                  >
                    {TYPE_LABELS[g.type]} {g.count}
                  </button>
                ))}
              </div>
            )}

            {/* 结果卡片列表 */}
            <div className="space-y-2">
              {filteredResults.map((r, i) => {
                const colors = TYPE_COLORS[r.type];
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedSource(r)}
                    className="w-full bg-white rounded-xl border border-gray-200 p-4 text-left hover:border-blue-300 hover:shadow-sm transition group"
                  >
                    <div className="flex items-start gap-3">
                      <span className={`w-8 h-8 rounded-lg ${colors.bg} ${colors.text} text-xs font-bold flex items-center justify-center shrink-0`}>
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-1.5 py-0.5 ${colors.bg} ${colors.text} rounded text-xs font-bold`}>
                            {TYPE_LABELS[r.type]}
                          </span>
                          {r.clinicalMeta?.grade && (
                            <span className="text-xs text-green-600 font-medium">[{r.clinicalMeta.grade}]</span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-blue-700 transition">
                          <Highlight text={r.title} tokens={r.matchedTokens ?? []} />
                        </h3>
                        {r.snippet && (
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
                            <Highlight text={r.snippet} tokens={r.matchedTokens ?? []} />
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            热门问题快捷入口
        ══════════════════════════════════════════════ */}
        {!searched && !loading && (
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">💡 试试这些问题</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(portal === 'doctor'
                ? [
                    'FMT治疗复发性CDI的有效率是多少？',
                    '溃疡性结肠炎患者适合FMT吗？',
                    '哪些供体筛查指标最重要？',
                    'FMT治疗IBS的证据等级？',
                  ]
                : [
                    'FMT是什么？安全吗？',
                    '哪些疾病可以用FMT治疗？',
                    'FMT需要做多少次？',
                    'FMT有哪些注意事项？',
                  ]
              ).map((q, i) => (
                <button
                  key={i}
                  onClick={() => { setQuery(q); setTimeout(handleSearch, 100); }}
                  className="text-left px-4 py-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-xl text-xs text-gray-700 hover:text-blue-700 transition line-clamp-2"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════
          证据详情滑出面板
      ══════════════════════════════════════════════ */}
      {selectedSource && (
        <EvidenceDetail
          record={selectedSource}
          onClose={() => setSelectedSource(null)}
        />
      )}
    </div>
  );
}
