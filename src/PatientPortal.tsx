import React, { useState, useMemo } from 'react';
import { patientEduArticles, type PatientEduArticle } from './data/patientEdu';
import { search, type SearchRecord } from './data/searchIndex';
import PatientEduDetail from './PatientEduDetail';
import HospitalMapPanel from './HospitalMapPanel';

type PatientEduCategory = '全部' | '前世今生' | '适应证' | '治疗流程' | '政策规范' | '医保报销' | '知情同意' | '日常管理' | '就诊指南' | '医院地图';

interface PatientPortalProps {
  onLogout: () => void;
  onOpenAISearch: () => void;
}

const CATEGORIES: PatientEduCategory[] = ['全部', '前世今生', '适应证', '治疗流程', '政策规范', '医保报销', '知情同意', '日常管理', '就诊指南', '医院地图'];

const categoryColors: Record<string, string> = {
  '前世今生': 'bg-blue-100 text-blue-700',
  '适应证': 'bg-red-100 text-red-700',
  '治疗流程': 'bg-green-100 text-green-700',
  '政策规范': 'bg-amber-100 text-amber-700',
  '医保报销': 'bg-purple-100 text-purple-700',
  '知情同意': 'bg-pink-100 text-pink-700',
  '日常管理': 'bg-teal-100 text-teal-700',
  '就诊指南': 'bg-indigo-100 text-indigo-700',
};

const categoryIcons: Record<string, string> = {
  '前世今生': '📖',
  '适应证': '💊',
  '治疗流程': '🏥',
  '政策规范': '📋',
  '医保报销': '💰',
  '知情同意': '⚖️',
  '日常管理': '🌿',
  '就诊指南': '🗺️',
  '医院地图': '🗺️',
};

function ArticleCard({ article, onClick }: { article: PatientEduArticle; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="w-full text-left bg-white rounded-2xl border border-gray-200 p-4 hover:border-emerald-300 hover:shadow-md transition group">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${categoryColors[article.category] || 'bg-gray-100 text-gray-600'}`}>
              {article.category}
            </span>
            <span className="text-xs text-gray-300">·</span>
            <span className="text-xs text-gray-400">{article.lastUpdated}</span>
          </div>
          <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-700 transition leading-snug mb-1">
            {article.title}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">
            {article.summary}
          </p>
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

export default function PatientPortal({ onLogout, onOpenAISearch }: PatientPortalProps) {
  const [activeCategory, setActiveCategory] = useState<PatientEduCategory>('全部');
  const [selectedArticle, setSelectedArticle] = useState<PatientEduArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchRecord[] | null>(null);

  const handlePatientSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    const results = search(searchQuery, 'patient');
    setSearchResults(results);
  };

  const filteredArticles = useMemo(() => {
    if (activeCategory === '全部' || activeCategory === '医院地图') return patientEduArticles;
    return patientEduArticles.filter(a => a.category === activeCategory);
  }, [activeCategory]);

  if (selectedArticle) {
    return (
      <PatientEduDetail
        article={selectedArticle}
        onBack={() => setSelectedArticle(null)}
        onRelatedClick={(a) => setSelectedArticle(a)}
      />
    );
  }

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
            <button onClick={onOpenAISearch} className="px-3 py-1.5 bg-emerald-500 border border-emerald-400 rounded-full text-xs text-white hover:bg-emerald-400 transition font-medium">🤖 AI咨询</button>
            <button onClick={onLogout} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition">
              退出
            </button>
          </div>
        </div>
      </div>

      {/* Intro banner */}
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
              <button key={cat} onClick={() => { setActiveCategory(cat); setSearchResults(null); setSearchQuery(''); }}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition whitespace-nowrap ${activeCategory === cat
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                {cat === '全部' ? '📚 全部' : `${categoryIcons[cat] || ''} ${cat}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {activeCategory === '全部' && (
        <div className="px-4 py-3 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handlePatientSearch()}
              placeholder="搜索FMT科普知识..."
              className="w-full pl-9 pr-16 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
            <button
              onClick={handlePatientSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition"
            >
              搜索
            </button>
          </div>
          {/* Search Results Overlay */}
          {searchResults !== null && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">找到 {searchResults.length} 条结果</p>
                <button onClick={() => { setSearchQuery(''); setSearchResults(null); }}
                  className="text-xs text-gray-400 hover:text-gray-600">✕ 清除</button>
              </div>
              {searchResults.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-6">未找到相关科普内容</p>
              ) : (
                <div className="max-h-80 overflow-y-auto space-y-2">
                  {searchResults.slice(0, 10).map(r => {
                    const article = patientEduArticles.find(a => `patientEdu-${a.id}` === r.id);
                    return (
                      <button
                        key={r.id}
                        onClick={() => {
                          if (article) {
                            setSelectedArticle(article);
                            setSearchResults(null);
                            setSearchQuery('');
                          }
                        }}
                        className="w-full text-left p-3 bg-white rounded-xl border border-gray-100 hover:border-emerald-200 hover:shadow-sm transition"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded text-xs">
                            {r.meta?.category || '科普'}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-800">{r.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{r.summary}</p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Article List / Hospital Map */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-4 space-y-3">
          {searchResults !== null ? null : activeCategory === '医院地图' ? (
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

        {/* Disclaimer */}
        <div className="max-w-4xl mx-auto px-4 pb-4">
          <div className="bg-gray-100 rounded-xl p-3 text-xs text-gray-400 text-center leading-relaxed">
            <strong>免责声明：</strong>本页面内容仅供科普参考，不构成医疗建议。<br />
            具体诊疗方案请遵医嘱，FMT为研究性/探索性治疗，请选择正规有资质医疗机构。
          </div>
        </div>
      </div>
    </div>
  );
}
