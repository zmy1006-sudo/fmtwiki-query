import React from 'react';
import { patientEduArticles, type PatientEduArticle } from './data/patientEdu';

interface PatientEduDetailProps {
  article: PatientEduArticle;
  onBack: () => void;
  onRelatedClick: (article: PatientEduArticle) => void;
}

const ExternalIcon = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const categoryColors: Record<string, string> = {
  '前世今生': 'bg-blue-100 text-blue-700',
  '适应证': 'bg-red-100 text-red-700',
  '治疗流程': 'bg-green-100 text-green-700',
  '政策规范': 'bg-amber-100 text-amber-700',
  '医保报销': 'bg-purple-100 text-purple-700',
  '知情同意': 'bg-pink-100 text-pink-700',
};

function renderInline(text: string): React.ReactElement | string {
  const boldRegex = /\*\*(.+?)\*\*/g;
  const parts: React.ReactElement[] = [];
  let lastIndex = 0;
  let match;
  let hasMatch = false;

  while ((match = boldRegex.exec(text)) !== null) {
    hasMatch = true;
    if (match.index > lastIndex) {
      parts.push(<span key={`t${lastIndex}`}>{text.slice(lastIndex, match.index)}</span>);
    }
    parts.push(<strong key={`b${match.index}`} className="font-bold text-gray-800">{match[1]}</strong>);
    lastIndex = boldRegex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(<span key="tend">{text.slice(lastIndex)}</span>);
  }
  if (!hasMatch) return text;
  return <>{parts}</>;
}

function renderContent(content: string): React.ReactNode[] {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      elements.push(<h2 key={key++} className="text-lg font-bold text-gray-800 mt-6 mb-3 flex items-center gap-2">{line.replace('## ', '')}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={key++} className="text-base font-bold text-gray-700 mt-4 mb-2">{line.replace('### ', '')}</h3>);
    } else if (line.startsWith('> ')) {
      elements.push(
        <div key={key++} className="bg-blue-50 border-l-4 border-blue-300 px-4 py-3 my-3 rounded-r-lg">
          <p className="text-sm text-blue-700 leading-relaxed">{line.replace('> ', '')}</p>
        </div>
      );
    } else if (line.startsWith('- ')) {
      elements.push(
        <li key={key++} className="text-gray-600 text-sm leading-relaxed ml-4 list-disc">
          {renderInline(line.replace('- ', ''))}
        </li>
      );
    } else if (line.match(/^\d+\. /)) {
      elements.push(
        <li key={key++} className="text-gray-600 text-sm leading-relaxed ml-4 list-decimal">
          {renderInline(line.replace(/^\d+\. /, ''))}
        </li>
      );
    } else if (line.trim() === '') {
      // skip empty lines
    } else if (line.startsWith('**来源：**')) {
      elements.push(
        <div key={key++} className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-400">📚 {line.replace('**来源：**', '')}</p>
        </div>
      );
    } else {
      elements.push(<p key={key++} className="text-sm text-gray-600 leading-relaxed my-1">{renderInline(line)}</p>);
    }
  }
  return elements;
}

const PatientEduDetail: React.FC<PatientEduDetailProps> = ({ article, onBack, onRelatedClick }) => {
  const relatedArticles = patientEduArticles
    .filter(a => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} className="text-white/80 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <p className="text-xs text-white/60">科普版</p>
            <h1 className="text-lg font-bold leading-tight">{article.title}</h1>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${categoryColors[article.category] || 'bg-gray-100 text-gray-600'}`}>
            {article.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-5 space-y-4">

          {/* 文章分类标签卡 */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm">🏷️</span>
                <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">文章分类</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${categoryColors[article.category] || 'bg-gray-100 text-gray-600'}`}>
                {article.category}
              </span>
            </div>
          </div>

          {/* 核心摘要卡 */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm">📝</span>
              <p className="text-xs font-bold uppercase tracking-wide text-gray-600">核心摘要</p>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{article.summary}</p>
          </div>

          {/* 正文内容卡 */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm">📄</span>
              <p className="text-xs font-bold uppercase tracking-wide text-gray-600">正文内容</p>
            </div>
            <div className="text-gray-700" style={{ fontSize: '15px', lineHeight: '1.9' }}>
              {renderContent(article.content)}
            </div>
          </div>

          {/* 关键词标签卡 */}
          {article.tags && article.tags.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">🔑</span>
                <p className="text-xs font-bold uppercase tracking-wide text-blue-700">关键词</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {article.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-white border border-blue-200 text-blue-700 rounded-full text-xs font-medium">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* 参考文献卡 */}
          {article.source && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">📚</span>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-500">参考文献</p>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{article.source}</p>
            </div>
          )}

          {/* 原文来源 */}
          {article.sourceUrl && (
            <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-500 hover:bg-blue-50 hover:border-blue-200 transition">
              🔗 查看原文来源 <ExternalIcon />
            </a>
          )}

          {/* Related articles */}
          {relatedArticles.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3 flex items-center gap-2">
                <span>📖</span> 同类文章推荐
              </p>
              <div className="space-y-3">
                {relatedArticles.map(a => (
                  <button key={a.id} onClick={() => onRelatedClick(a)}
                    className="w-full text-left bg-gray-50 rounded-xl p-3 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition">
                    <p className="text-sm font-bold text-gray-800">{a.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">{a.summary}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-gray-100 rounded-xl p-4 text-xs text-gray-400 leading-relaxed">
            <strong>免责声明：</strong>本页面内容仅供科普参考，不构成医疗建议。具体诊疗方案请遵医嘱。FMT为研究性/探索性治疗，请选择正规有资质医疗机构。
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientEduDetail;
