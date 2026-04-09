import React, { useState, useMemo } from 'react';
import { diseases, searchDiseases, type Disease } from './data/diseases';
import { teams, teamCategories, filterTeams, type Team } from './data/teams';
import { aiApps, appTypes, filterAIApps, type AIApp, type AppType, maturityColors, typeColors } from './data/aiApps';
import { sciencePapers, type SciencePaper } from './data/science';
import { decisionTree, getNodeById, verdictStyleMap, verdictColors, type DecisionNode, type FMTDecision } from './data/decisionTree';
import { EvidenceGuide } from './EvidenceGuide';

interface DoctorPortalProps {
  onLogout: () => void;
  onOpenAISearch: () => void;
}

type DoctorTab = 'disease' | 'teams' | 'ai' | 'science';
type DoctorView =
  | { kind: 'list'; tab: DoctorTab }
  | { kind: 'disease'; disease: Disease }
  | { kind: 'team'; team: Team }
  | { kind: 'aiApp'; app: AIApp }
  | { kind: 'science'; paper: SciencePaper };

// ── Icons ──────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
const BackIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);
const ExternalIcon = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);
const CategoryDot: Record<string, string> = {
  '临床合作': 'bg-red-400',
  '算法研发': 'bg-blue-400',
  '企业管线': 'bg-purple-400',
};

// ── Decision Tree Modal ─────────────────────────────────────
function DecisionTreeModal({ onClose }: { onClose: () => void }) {
  const [currentNodeId, setCurrentNodeId] = useState<string>('cdi-entry');
  const currentNode = getNodeById(currentNodeId);

  const handleSelect = (next: string | 'RESULT') => {
    if (next === 'RESULT') return;
    setCurrentNodeId(next);
  };

  const handleBack = () => {
    // Go back to the start
    setCurrentNodeId('cdi-entry');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-blue-700 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔀</span>
            <div>
              <h2 className="text-sm font-bold">FMT临床决策树</h2>
              <p className="text-xs text-blue-200">快速判断FMT适用性</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto">
          {!currentNode ? (
            <div className="p-8 text-center text-gray-500 text-sm">节点不存在</div>
          ) : currentNode.result ? (
            // Result View
            <DecisionResultView decision={currentNode.result} onBack={handleBack} allTeams={teams} />
          ) : (
            // Question View
            <div className="p-4 space-y-4">
              {/* Progress indicator */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-blue-600 font-semibold">第 {decisionTree.findIndex(n => n.id === currentNodeId) + 1} 步</span>
                <div className="flex-1 h-1 bg-blue-100 rounded-full">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, ((decisionTree.findIndex(n => n.id === currentNodeId) + 1) / decisionTree.length) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm font-bold text-blue-800 leading-relaxed">{currentNode.question}</p>
              </div>

              {/* Options */}
              <div className="space-y-2">
                {currentNode.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(opt.next)}
                    className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-sm text-gray-700 group-hover:text-blue-800">{opt.label}</span>
                      {opt.note && (
                        <span className="ml-auto text-xs text-gray-400">{opt.note}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Reset */}
              <button onClick={handleBack} className="w-full py-2 text-xs text-gray-400 hover:text-gray-600 transition">
                ← 重新开始
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Decision Result View ───────────────────────────────────
function DecisionResultView({ decision, onBack, allTeams, onShowEvidenceGuide }: { decision: FMTDecision; onBack: () => void; allTeams: Team[]; onShowEvidenceGuide?: () => void }) {
  const vColor = verdictStyleMap[decision.verdict];

  return (
    <div className="p-4 space-y-3">
      {/* Verdict Banner */}
      <div className={`${vColor.bg} border ${vColor.border} rounded-xl p-4 text-center`}>
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${vColor.bg} border ${vColor.border} ${vColor.text} mb-2`}>
          {vColor.label}
        </span>
        <h3 className="text-base font-bold text-gray-900 mt-1">{decision.label}</h3>
        <div className="flex items-center justify-center gap-2 mt-2">
          {onShowEvidenceGuide ? (
          <button
            onClick={onShowEvidenceGuide}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-full text-xs text-blue-600 hover:bg-blue-100 transition"
          >
            📖 证据等级：{decision.evidenceGrade}
          </button>
        ) : (
          <span className="px-2.5 py-0.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600">
            证据等级：{decision.evidenceGrade}
          </span>
        )}
        </div>
      </div>

      {/* Clinical Plan */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-xs font-bold text-gray-400 uppercase mb-3">💊 推荐方案</p>
        <div className="space-y-2">
          <div className="flex gap-3">
            <span className="text-xs font-bold text-blue-600 w-16 flex-shrink-0">剂量</span>
            <span className="text-xs text-gray-700">{decision.recommendedDose}</span>
          </div>
          <div className="flex gap-3">
            <span className="text-xs font-bold text-emerald-600 w-16 flex-shrink-0">途径</span>
            <span className="text-xs text-gray-700">{decision.recommendedRoute}</span>
          </div>
          <div className="flex gap-3">
            <span className="text-xs font-bold text-purple-600 w-16 flex-shrink-0">频次</span>
            <span className="text-xs text-gray-700">{decision.recommendedFrequency}</span>
          </div>
        </div>
      </div>

      {/* Key References */}
      {decision.keyRefs.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs font-bold text-amber-800 mb-2">📖 关键参考文献</p>
          <div className="space-y-1">
            {decision.keyRefs.map((ref, i) => (
              <a key={i} href={`https://pubmed.ncbi.nlm.nih.gov/?term=${ref.replace('PMID ', '')}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-blue-700 hover:underline">
                <span className="w-4 h-4 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center flex-shrink-0">P</span>
                {ref}
                <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {decision.warnings.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-xs font-bold text-red-700 mb-2">⚠️ 注意事项</p>
          <ul className="space-y-1">
            {decision.warnings.map((w, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-red-400 flex-shrink-0 mt-0.5">•</span>
                <span className="text-xs text-red-700 leading-relaxed">{w}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Related Teams */}
      {decision.relatedTeamIds.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">🏥 推荐医院团队</p>
          <div className="space-y-1">
            {decision.relatedTeamIds.map(tid => {
              const t = teams.find(x => x.id === tid);
              return t ? (
                <div key={tid} className="flex items-center gap-2 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                  <span className="text-xs font-medium text-gray-800">{t.nameShort}</span>
                  <span className="text-xs text-gray-400">· {t.leader}</span>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Back button */}
      <button onClick={onBack} className="w-full py-2 text-xs text-gray-400 hover:text-gray-600 transition">
        ← 重新开始
      </button>
    </div>
  );
}
function DiseaseDetail({ disease, onBack, onShowEvidenceGuide }: { disease: Disease; onBack: () => void; onShowEvidenceGuide?: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} className="text-gray-400 hover:text-gray-700 transition"><BackIcon /></button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-gray-900 truncate">{disease.name}</h1>
            <p className="text-xs text-gray-400">{disease.nameEn} · {disease.category}</p>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${disease.gradeColor}`}>{disease.gradeLabel}</span>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-5 space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">证据等级</p>
              {onShowEvidenceGuide ? (
                <button
                  onClick={onShowEvidenceGuide}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-full text-xs text-blue-600 hover:bg-blue-100 transition"
                >
                  📖 证据等级：{disease.evidenceGrade}
                </button>
              ) : (
                <p className="text-sm font-bold text-gray-800 mt-0.5">{disease.evidenceGrade}</p>
              )}
              <p className="text-sm text-gray-600 mt-1">{disease.efficacy}</p>
            </div>
          </div>
        </div>
        {disease.warnings ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-red-700 leading-relaxed">{disease.warnings}</p>
          </div>
        ) : null}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs font-bold text-amber-800 mb-1">📖 关键参考文献</p>
          <p className="text-sm text-amber-900 font-medium">{disease.keyRef}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">概述</p>
          <p className="text-sm text-gray-700 leading-relaxed">{disease.summary}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">💊 临床方案</p>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs font-bold text-blue-600 mb-1">给药途径</p>
                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">{disease.administrationRoute}</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3">
                <p className="text-xs font-bold text-emerald-600 mb-1">推荐剂量</p>
                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">{disease.dosage}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-xs font-bold text-purple-600 mb-1">疗程/频次</p>
                <p className="text-xs text-gray-700 leading-relaxed">{disease.frequency}</p>
              </div>
            </div>
            {disease.protocolNote ? (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-bold text-gray-500 mb-1">方案备注</p>
                <p className="text-xs text-gray-600 leading-relaxed">{disease.protocolNote}</p>
              </div>
            ) : null}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-red-100 p-5">
          <p className="text-xs font-bold text-red-400 uppercase tracking-wide mb-2">禁忌证</p>
          <p className="text-sm text-red-700 leading-relaxed">{disease.contraindications}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">来源引用（可点击验证）</p>
          </div>
          <div className="space-y-2">
            {disease.sources.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2.5 bg-gray-50 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-200 transition">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  s.type === 'PMID' ? 'bg-green-100 text-green-700' :
                  s.type === 'NCT' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-600'
                }`}>{s.type === 'PMID' ? 'P' : s.type === 'NCT' ? 'N' : 'W'}</span>
                <span className="text-xs text-gray-700 flex-1 leading-relaxed">{s.label}</span>
                <ExternalIcon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Team Card ────────────────────────────────────────────────
function TeamCard({ team, onClick }: { team: Team; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="w-full text-left bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm transition group">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`w-2 h-2 rounded-full ${CategoryDot[team.category] || 'bg-gray-400'}`} />
            <span className="text-xs text-gray-400">{team.location}</span>
          </div>
          <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition">{team.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{team.leader} · {team.title}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {team.tags.map((tag) => (
              <span key={tag} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">{tag}</span>
            ))}
          </div>
        </div>
        <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}

// ── Team Detail ────────────────────────────────────────────
function TeamDetail({ team, onBack, onTeamClick, allTeams }: { team: Team; onBack: () => void; onTeamClick: (id: string) => void; allTeams: Team[] }) {
  const relatedTeams = allTeams.filter(t => t.id !== team.id && t.category === team.category).slice(0, 3);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} className="text-gray-400 hover:text-gray-700 transition"><BackIcon /></button>
          <div className="flex-1">
            <h1 className="text-base font-bold text-gray-900">{team.name}</h1>
            <p className="text-xs text-gray-400">{team.location} · {team.category}</p>
          </div>
          <span className="text-xs font-bold text-gray-400">{team.lastUpdated}</span>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-5 space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs text-gray-400 font-semibold uppercase">负责人</p>
          <p className="text-sm font-bold text-gray-800 mt-0.5">{team.leader}</p>
          <p className="text-xs text-gray-500 mt-0.5">{team.title}</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs font-bold text-blue-700 mb-2">研究方向</p>
          <div className="flex flex-wrap gap-2">
            {team.directions.map(d => (
              <span key={d} className="px-2.5 py-1 bg-white border border-blue-200 rounded-full text-xs text-blue-700 font-medium">{d}</span>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">最新成果</p>
          <p className="text-sm text-gray-700 leading-relaxed">{team.latestResult}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-bold text-gray-400 uppercase mb-3">对接方式</p>
          <div className="space-y-2">
            {team.contact.map((c, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-xs font-bold text-gray-400 w-10 flex-shrink-0 pt-0.5">{c.type}</span>
                <span className="text-sm text-gray-700">{c.value}</span>
              </div>
            ))}
          </div>
          {team.website ? (
            <a href={team.website} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs text-blue-700 hover:bg-blue-100 transition">
              官网 <ExternalIcon />
            </a>
          ) : null}
        </div>
        {team.publications && team.publications.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs font-bold text-gray-400 uppercase mb-3">代表论文</p>
            <div className="space-y-2">
              {team.publications.map((pub, i) => (
                <a key={i} href={pub.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-2 px-3 py-2.5 bg-gray-50 rounded-lg hover:bg-blue-50 transition">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">P</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 leading-snug">{pub.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{pub.journal} · {pub.year} · PMID {pub.pmid}</p>
                  </div>
                  <ExternalIcon />
                </a>
              ))}
            </div>
          </div>
        )}
        {/* ── 企业管线扩展详情 ── */}
        {(team as any).enterprise && (
          <>
            {/* 公司概况 */}
            {(team as any).enterprise.description && (
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-5">
                <p className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-2">公司概况</p>
                <p className="text-sm text-gray-700 leading-relaxed">{(team as any).enterprise.description}</p>
              </div>
            )}

            {/* 公司状态 + 全球布局 */}
            <div className="grid grid-cols-2 gap-3">
              {(team as any).enterprise.companyStatus && (
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="text-xs font-bold text-purple-600 mb-1">融资/上市状态</p>
                  <p className="text-xs text-gray-700">{(team as any).enterprise.companyStatus}</p>
                </div>
              )}
              {(team as any).enterprise.globalSites && (team as any).enterprise.globalSites.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="text-xs font-bold text-blue-600 mb-1">全球布局</p>
                  <div className="space-y-0.5">
                    {(team as any).enterprise.globalSites.map((s: string, i: number) => (
                      <div key={i} className="text-xs text-gray-600">• {s}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 药物管线表格 */}
            {(team as any).enterprise.pipeline && (team as any).enterprise.pipeline.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100 bg-purple-50">
                  <p className="text-xs font-bold text-purple-700">药物管线</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr className="text-left text-gray-500">
                        <th className="px-4 py-2 font-semibold">代号</th>
                        <th className="px-4 py-2 font-semibold">类型</th>
                        <th className="px-4 py-2 font-semibold">适应证</th>
                        <th className="px-4 py-2 font-semibold">阶段</th>
                        <th className="px-4 py-2 font-semibold">备注</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(team as any).enterprise.pipeline.map((p: any, i: number) => (
                        <tr key={i} className="hover:bg-purple-50/30">
                          <td className="px-4 py-2.5 font-mono font-bold text-purple-700">{p.code}</td>
                          <td className="px-4 py-2.5 text-gray-600">{p.type}</td>
                          <td className="px-4 py-2.5 text-gray-700">{p.indication}</td>
                          <td className="px-4 py-2.5">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                              p.stage.includes('Phase 3') || p.stage.includes('临床III') || p.stage.includes('临床II期') ? 'bg-green-100 text-green-700' :
                              p.stage.includes('Phase 2') || p.stage.includes('临床II') ? 'bg-blue-100 text-blue-700' :
                              p.stage.includes('Phase 1') || p.stage.includes('临床I') ? 'bg-amber-100 text-amber-700' :
                              p.stage.includes('临床前') || p.stage.includes('Pre') ? 'bg-gray-100 text-gray-600' :
                              'bg-slate-100 text-slate-600'
                            }`}>{p.stage}</span>
                          </td>
                          <td className="px-4 py-2.5 text-gray-500 max-w-xs">{p.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 合作伙伴 */}
            {(team as any).enterprise.collaborations && (team as any).enterprise.collaborations.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <p className="text-xs font-bold text-gray-400 uppercase mb-3">合作伙伴</p>
                <div className="space-y-1.5">
                  {(team as any).enterprise.collaborations.map((c: string, i: number) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                      <span className="text-xs text-gray-600 leading-relaxed">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 发展里程碑 */}
            {(team as any).enterprise.milestones && (team as any).enterprise.milestones.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <p className="text-xs font-bold text-gray-400 uppercase mb-3">发展里程碑</p>
                <div className="space-y-0">
                  {(team as any).enterprise.milestones.map((m: any, i: number) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-8 text-xs font-bold text-purple-600 bg-purple-100 rounded px-1.5 py-0.5 text-center flex-shrink-0">{m.year}</div>
                        {i < ((team as any).enterprise.milestones.length - 1) && (
                          <div className="w-px flex-1 bg-purple-200 my-0.5" />
                        )}
                      </div>
                      <div className="pb-3 text-xs text-gray-600 leading-snug pt-0.5">{m.event}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {relatedTeams.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs font-bold text-gray-400 uppercase mb-3">同类型团队</p>
            <div className="space-y-2">
              {relatedTeams.map(t => (
                <button key={t.id} onClick={() => onTeamClick(t.id)}
                  className="w-full text-left flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{t.nameShort}</p>
                    <p className="text-xs text-gray-400">{t.leader}</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── AI App Card ─────────────────────────────────────────────
function AIAppCard({ app, onClick }: { app: AIApp; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="w-full text-left bg-white rounded-xl border border-gray-200 p-4 hover:border-purple-300 hover:shadow-sm transition group">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${typeColors[app.type]}`}>{app.type}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${maturityColors[app.maturity]}`}>{app.maturity}</span>
          </div>
          <h3 className="text-sm font-bold text-gray-900 group-hover:text-purple-700 transition mt-1">{app.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{app.institution} · {app.location}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {app.techAreas.map(t => (
              <span key={t} className="px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded text-xs">{t}</span>
            ))}
          </div>
        </div>
        <svg className="w-4 h-4 text-gray-300 group-hover:text-purple-400 transition flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}

// ── AI App Detail ─────────────────────────────────────────
function AIAppDetail({ app, onBack }: { app: AIApp; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} className="text-gray-400 hover:text-gray-700 transition"><BackIcon /></button>
          <div className="flex-1">
            <h1 className="text-base font-bold text-gray-900">{app.name}</h1>
            <p className="text-xs text-gray-400">{app.institution} · {app.location}</p>
          </div>
          <div className="flex gap-1">
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${typeColors[app.type]}`}>{app.type}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${maturityColors[app.maturity]}`}>{app.maturity}</span>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-5 space-y-4">
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
          <p className="text-xs font-bold text-purple-700 mb-2">技术方向</p>
          <div className="flex flex-wrap gap-2">
            {app.techAreas.map(t => (
              <span key={t} className="px-2.5 py-1 bg-white border border-purple-200 rounded-full text-xs text-purple-700 font-medium">{t}</span>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">应用描述</p>
          <p className="text-sm text-gray-700 leading-relaxed">{app.description}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-xs font-bold text-green-700 mb-2">关键成果</p>
          <p className="text-sm text-green-800 leading-relaxed">{app.keyResult}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs font-bold text-gray-400 uppercase mb-2">FMT环节</p>
            <p className="text-sm text-gray-800 font-medium">{app.fmtStage}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs font-bold text-gray-400 uppercase mb-2">成熟度</p>
            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${maturityColors[app.maturity]}`}>{app.maturity}</span>
          </div>
        </div>
        {app.website ? (
          <a href={app.website} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition">
            访问官网 <ExternalIcon />
          </a>
        ) : null}
        {app.sourceUrl && (
          <a href={app.sourceUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 w-full py-2.5 px-4 bg-gray-50 border border-gray-200 rounded-xl text-xs text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition mt-2">
            <span className="text-gray-400 shrink-0">📚</span>
            <span className="font-bold text-gray-500 shrink-0">来源：</span>
            <span className="underline break-all">{app.sourceLabel || app.sourceUrl}</span>
            <span className="text-gray-300 shrink-0 ml-auto">↗</span>
          </a>
        )}
      </div>
    </div>
  );
}

// ── Science Tab ─────────────────────────────────────────────
function ScienceTab({ onSelect }: { onSelect: (p: SciencePaper) => void }) {
  return (
    <div>
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 pt-4 pb-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <span className="text-xl">🔬</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Science 期刊追踪</h2>
              <p className="text-xs text-gray-500">Science FMT / 微生物组 / 肠-脑轴 核心论文</p>
            </div>
            <span className="ml-auto px-2 py-0.5 bg-red-50 border border-red-200 rounded-full text-xs text-red-600 font-medium">每日更新</span>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-4">
        <p className="text-xs text-gray-400 mb-3">{sciencePapers.length} 篇 Science 论文</p>
        <div className="space-y-3">
          {sciencePapers.map((p) => (
            <button key={p.id} onClick={() => onSelect(p)}
              className="w-full text-left bg-white rounded-xl border border-gray-200 p-4 hover:border-red-300 hover:shadow-sm transition group">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-bold text-red-600">Science</span>
                    <span className="text-xs text-gray-400">{p.year} · Vol.{p.volume}</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-red-700 transition leading-snug">{p.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{p.authors.slice(0,3).join(', ')}{p.authors.length > 3 ? ` +${p.authors.length-3}` : ''}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {p.tags.map(tag => (
                      <span key={tag} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
                <svg className="w-4 h-4 text-gray-300 group-hover:text-red-400 transition flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Science Detail ─────────────────────────────────────────
function ScienceDetail({ paper, onBack }: { paper: SciencePaper; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} className="text-gray-400 hover:text-gray-700 transition"><BackIcon /></button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-red-600 text-white rounded text-xs font-bold">Science</span>
              <span className="text-xs text-gray-400">{paper.journal} · {paper.year}</span>
            </div>
          </div>
          <div className="flex gap-1">
            <a href={`https://pubmed.ncbi.nlm.nih.gov/${paper.pmid}/`} target="_blank" rel="noopener noreferrer"
              className="px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs text-blue-700 hover:bg-blue-100 transition flex items-center gap-1">
              PubMed <ExternalIcon />
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-5 space-y-4">
        <div className="bg-red-50 border border-red-100 rounded-xl p-5">
          <p className="text-xs font-bold text-red-700 mb-2 uppercase tracking-wide">论文标题</p>
          <h1 className="text-base font-bold text-gray-900 leading-snug">{paper.title}</h1>
          <p className="text-sm text-gray-600 mt-3">{paper.authors.join(' · ')}</p>
          <p className="text-xs text-gray-400 mt-1">{paper.journal} {paper.volume}:{paper.pages} ({paper.year})</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-bold text-gray-400 uppercase mb-3">摘要 Abstract</p>
          <p className="text-sm text-gray-700 leading-relaxed">{paper.abstract}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-bold text-gray-400 uppercase mb-3">核心发现 Key Findings</p>
          <div className="space-y-3">
            {paper.keyFindings.map((f, i) => (
              <div key={i} className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</span>
                <p className="text-sm text-gray-700 leading-relaxed">{f}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-bold text-gray-400 uppercase mb-3">标签</p>
          <div className="flex flex-wrap gap-2">
            {paper.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">{tag}</span>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-red-200 p-5">
          <p className="text-xs font-bold text-red-400 uppercase mb-3">全部来源链接（可点击验证）</p>
          <div className="space-y-2">
            <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2.5 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
              <span className="text-sm font-bold text-blue-700">DOI</span>
              <span className="text-sm text-blue-600 font-mono">doi.org/{paper.doi}</span>
              <ExternalIcon />
            </a>
            {paper.pmid ? (
              <a href={`https://pubmed.ncbi.nlm.nih.gov/${paper.pmid}/`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2.5 bg-green-50 rounded-lg hover:bg-green-100 transition">
                <span className="text-sm font-bold text-green-700">PubMed</span>
                <span className="text-sm text-green-600 font-mono">PMID {paper.pmid}</span>
                <ExternalIcon />
              </a>
            ) : null}
            <a href={`https://www.science.org/doi/${paper.doi}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2.5 bg-red-50 rounded-lg hover:bg-red-100 transition">
              <span className="text-sm font-bold text-red-600">Science.org</span>
              <span className="text-sm text-red-500 font-mono">science.org/doi/{paper.doi}</span>
              <ExternalIcon />
            </a>
          </div>
        </div>
        {paper.relatedTeams && paper.relatedTeams.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs font-bold text-gray-400 uppercase mb-3">相关研究团队</p>
            <div className="flex flex-wrap gap-2">
              {paper.relatedTeams.map(tid => {
                const t = teams.find(x => x.id === tid);
                return t ? (
                  <span key={tid} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">{t.nameShort} · {t.leader}</span>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Disease Tab ──────────────────────────────────────────
function DiseaseTab({ onSelect }: { onSelect: (d: Disease) => void }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');
  const categories = ["全部","感染性疾病","炎症性肠病","功能性胃肠病","神经系统疾病","肝脏疾病","神经发育障碍","代谢性疾病","感染防控"];
  const filtered = useMemo(() => {
    let r = searchDiseases(query);
    if (activeCategory !== '全部') r = r.filter(d => d.category === activeCategory);
    return r;
  }, [query, activeCategory]);
  return (
    <div>
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 pt-4 pb-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></span>
            <input type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="搜索疾病、关键词..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 mt-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition ${activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-4">
        <p className="text-xs text-gray-400 mb-3">{filtered.length} 个适应证</p>
        <div className="space-y-3">
          {filtered.map(d => (
            <button key={d.id} onClick={() => onSelect(d)}
              className="w-full text-left bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm transition group">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-700">{d.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${d.gradeColor}`}>{d.gradeLabel}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{d.nameEn} · {d.category}</p>
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">{d.efficacy}</p>
                </div>
                <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-gray-500 text-sm">未找到相关词条</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Teams Tab ───────────────────────────────────────────
function TeamsTab({ onSelect }: { onSelect: (t: Team) => void }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<typeof teamCategories[number]['value'] | '全部'>('全部');
  const filtered = useMemo(() => {
    let r = filterTeams(activeCategory as typeof teamCategories[number]['value']);
    if (query.trim()) {
      const q = query.toLowerCase();
      r = r.filter(t => t.name.includes(q) || t.leader.includes(q) || t.directions.some(d => d.includes(q)));
    }
    return r;
  }, [query, activeCategory]);
  return (
    <div>
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 pt-4 pb-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></span>
            <input type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="搜索团队、专家、研究方向..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
          </div>
          <div className="flex items-center gap-3 mt-3">
            {teamCategories.map(cat => (
              <button key={cat.value} onClick={() => setActiveCategory(cat.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition ${activeCategory === cat.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {cat.value !== '全部' && <span className={`w-1.5 h-1.5 rounded-full ${cat.value === '临床合作' ? 'bg-red-400' : cat.value === '算法研发' ? 'bg-blue-400' : 'bg-purple-400'}`} />}
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-gray-400">{filtered.length} 个团队</p>
          <span className="text-xs text-blue-500">🔄 每3天自动更新</span>
        </div>
        <div className="space-y-3">
          {filtered.map(t => <TeamCard key={t.id} team={t} onClick={() => onSelect(t)} />)}
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-gray-500 text-sm">未找到相关团队</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── AI Apps Tab ─────────────────────────────────────────
function AIAppsTab({ onSelect }: { onSelect: (a: AIApp) => void }) {
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState<AppType | '全部'>('全部');
  const filtered = useMemo(() => {
    let r = filterAIApps(activeType);
    if (query.trim()) {
      const q = query.toLowerCase();
      r = r.filter(a => a.name.includes(q) || a.institution.includes(q) || a.techAreas.some(t => t.includes(q)));
    }
    return r;
  }, [query, activeType]);
  return (
    <div>
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 pt-4 pb-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></span>
            <input type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="搜索AI应用、技术、机构..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition" />
          </div>
          <div className="flex gap-2 mt-3">
            {appTypes.map(t => (
              <button key={t.value} onClick={() => setActiveType(t.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${activeType === t.value ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-gray-400">{filtered.length} 个应用</p>
          <span className="text-xs text-purple-500">⚡ 每日自动更新</span>
        </div>
        <div className="space-y-3">
          {filtered.map(a => <AIAppCard key={a.id} app={a} onClick={() => onSelect(a)} />)}
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🤖</p>
              <p className="text-gray-500 text-sm">未找到相关应用</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Doctor Portal ────────────────────────────────────────
export default function DoctorPortal({ onLogout, onOpenAISearch }: DoctorPortalProps) {
  const [view, setView] = useState<DoctorView>({ kind: 'list', tab: 'disease' });
  const [showDecisionTree, setShowDecisionTree] = useState(false);
  const [showEvidenceGuide, setShowEvidenceGuide] = useState(false);
  const activeTab = view.kind === 'list' ? view.tab : null;

  const tabConfig = [
    { id: 'disease' as DoctorTab, label: '💊 适应证', count: diseases.length },
    { id: 'teams' as DoctorTab, label: '🔬 团队', count: teams.length },
    { id: 'ai' as DoctorTab, label: '🤖 AI应用', count: aiApps.length },
    { id: 'science' as DoctorTab, label: 'Science', count: sciencePapers.length },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <div className="bg-blue-700 text-white flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <span className="text-white text-sm font-black">F</span>
            </div>
            <div>
              <h1 className="text-sm font-bold">FMTWiki 专业版</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full">👨‍⚕️ 医生</span>
            <button onClick={() => setShowEvidenceGuide(true)} className="px-3 py-1.5 bg-white border border-blue-200 rounded-full text-xs text-blue-600 hover:bg-blue-50 transition">📊 证据说明</button>
            <button onClick={onOpenAISearch} className="px-3 py-1.5 bg-blue-500 border border-blue-400 rounded-full text-xs text-white hover:bg-blue-400 transition font-medium">🤖 AI咨询</button>
            <button onClick={onLogout} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition">
              退出
            </button>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 pb-0">
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {tabConfig.map(t => (
              <button key={t.id} onClick={() => setView({ kind: 'list', tab: t.id })}
                className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-semibold transition ${activeTab === t.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                <span>{t.label}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${activeTab === t.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>{t.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>


      {/* Decision Tree Entry */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setShowDecisionTree(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:from-blue-700 hover:to-indigo-700 transition shadow-sm"
          >
            <span>🔀</span>
            <span>FMT临床决策树</span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">快速判断适用性</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {view.kind === 'list' && (
          <>
            {view.tab === 'disease' && <DiseaseTab onSelect={d => setView({ kind: 'disease', disease: d })} />}
            {view.tab === 'teams' && <TeamsTab onSelect={t => setView({ kind: 'team', team: t })} />}
            {view.tab === 'ai' && <AIAppsTab onSelect={a => setView({ kind: 'aiApp', app: a })} />}
            {view.tab === 'science' && <ScienceTab onSelect={p => setView({ kind: 'science', paper: p })} />}
          </>
        )}
        {view.kind === 'disease' && <DiseaseDetail disease={view.disease} onBack={() => setView({ kind: 'list', tab: 'disease' })} onShowEvidenceGuide={() => setShowEvidenceGuide(true)} />}
        {view.kind === 'team' && (
          <TeamDetail team={view.team}
            onBack={() => setView({ kind: 'list', tab: 'teams' })}
            onTeamClick={id => { const t = teams.find(x => x.id === id); if (t) setView({ kind: 'team', team: t }); }}
            allTeams={teams} />
        )}
        {view.kind === 'aiApp' && <AIAppDetail app={view.app} onBack={() => setView({ kind: 'list', tab: 'ai' })} />}
        {view.kind === 'science' && <ScienceDetail paper={view.paper} onBack={() => setView({ kind: 'list', tab: 'science' })} />}
      </div>

      {/* Disclaimer */}
      {view.kind === 'list' && (
        <div className="max-w-4xl mx-auto px-4 pb-4">
          <div className="bg-gray-100 rounded-xl p-3 text-xs text-gray-400 text-center leading-relaxed">
            <strong>免责：</strong>本知识库仅供医学参考，FMT为研究性治疗，不构成临床决策依据。<br />
            团队🔄每3天更新 · AI应用⚡每日更新 · Science📡每日08:00更新
          </div>
        </div>
      )}
      {/* Decision Tree Modal */}
      {showDecisionTree && <DecisionTreeModalOverlay onClose={() => setShowDecisionTree(false)} onShowEvidenceGuide={() => setShowEvidenceGuide(true)} />}
      {showEvidenceGuide && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowEvidenceGuide(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <EvidenceGuide inline={true} />
          </div>
        </div>
      )}
    </div>
  );
}

// Decision Tree Modal (portal-level, rendered outside main layout)
export function DecisionTreeModalOverlay({ onClose, onShowEvidenceGuide }: { onClose: () => void; onShowEvidenceGuide?: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        <DecisionTreeModalInner onClose={onClose} />
      </div>
    </div>
  );
}

function DecisionTreeModalInner({ onClose, onShowEvidenceGuide }: { onClose: () => void; onShowEvidenceGuide?: () => void }) {
  const [currentNodeId, setCurrentNodeId] = useState<string>('cdi-entry');
  const currentNode = getNodeById(currentNodeId);

  const handleSelect = (next: string | 'RESULT') => {
    if (next === 'RESULT') return;
    setCurrentNodeId(next);
  };

  const handleBack = () => setCurrentNodeId('cdi-entry');

  return (
    <>
      {/* Modal Header */}
      <div className="bg-blue-700 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔀</span>
          <div>
            <h2 className="text-sm font-bold">FMT临床决策树</h2>
            <p className="text-xs text-blue-200">快速判断FMT适用性</p>
          </div>
        </div>
        <button onClick={onClose} className="text-white/70 hover:text-white transition p-1">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Modal Content */}
      <div className="flex-1 overflow-y-auto">
        {!currentNode ? (
          <div className="p-8 text-center text-gray-500 text-sm">节点不存在</div>
        ) : currentNode.result ? (
          <DecisionResultViewInner decision={currentNode.result} onBack={handleBack} onShowEvidenceGuide={onShowEvidenceGuide} />
        ) : (
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-blue-600 font-semibold">步骤 {decisionTree.findIndex(n => n.id === currentNodeId) + 1}/{decisionTree.length}</span>
              <div className="flex-1 h-1 bg-blue-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${Math.min(100, ((decisionTree.findIndex(n => n.id === currentNodeId) + 1) / decisionTree.length) * 100)}%` }} />
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm font-bold text-blue-800 leading-relaxed">{currentNode.question}</p>
            </div>
            <div className="space-y-2">
              {currentNode.options.map((opt, i) => (
                <button key={i} onClick={() => handleSelect(opt.next)}
                  className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition group">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-sm text-gray-700 group-hover:text-blue-800">{opt.label}</span>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={handleBack} className="w-full py-2 text-xs text-gray-400 hover:text-gray-600 transition">
              ← 重新开始
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function DecisionResultViewInner({ decision, onBack, onShowEvidenceGuide }: { decision: FMTDecision; onBack: () => void; onShowEvidenceGuide?: () => void }) {
  const vColor = verdictStyleMap[decision.verdict];

  return (
    <div className="p-4 space-y-3">
      <div className={`${vColor.bg} border ${vColor.border} rounded-xl p-4 text-center`}>
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${vColor.bg} border ${vColor.border} ${vColor.text} mb-2`}>
          {vColor.label}
        </span>
        <h3 className="text-base font-bold text-gray-900 mt-1">{decision.label}</h3>
        {onShowEvidenceGuide ? (
          <button
            onClick={onShowEvidenceGuide}
            className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-full text-xs text-blue-600 hover:bg-blue-100 transition"
          >
            📖 证据等级：{decision.evidenceGrade}
          </button>
        ) : (
          <span className="inline-block mt-2 px-2.5 py-0.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600">
            证据等级：{decision.evidenceGrade}
          </span>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-xs font-bold text-gray-400 uppercase mb-3">💊 推荐方案</p>
        <div className="space-y-2">
          {[
            { label: '剂量', color: 'text-blue-600', value: decision.recommendedDose },
            { label: '途径', color: 'text-emerald-600', value: decision.recommendedRoute },
            { label: '频次', color: 'text-purple-600', value: decision.recommendedFrequency },
          ].map(item => (
            <div key={item.label} className="flex gap-3">
              <span className={`text-xs font-bold ${item.color} w-12 flex-shrink-0`}>{item.label}</span>
              <span className="text-xs text-gray-700 leading-relaxed">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {decision.keyRefs.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs font-bold text-amber-800 mb-2">📖 关键参考文献</p>
          <div className="space-y-1">
            {decision.keyRefs.map((ref, i) => (
              <a key={i} href={`https://pubmed.ncbi.nlm.nih.gov/?term=${ref.replace('PMID ', '')}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-blue-700 hover:underline">
                <span className="w-4 h-4 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center flex-shrink-0">P</span>
                {ref}
                <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      )}

      {decision.warnings.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-xs font-bold text-red-700 mb-2">⚠️ 注意事项</p>
          <ul className="space-y-1">
            {decision.warnings.map((w, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-red-400 flex-shrink-0 mt-0.5">•</span>
                <span className="text-xs text-red-700 leading-relaxed">{w}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {decision.relatedTeamIds.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">🏥 推荐医院团队</p>
          <div className="space-y-1">
            {decision.relatedTeamIds.map(tid => {
              const t = teams.find(x => x.id === tid);
              return t ? (
                <div key={tid} className="flex items-center gap-2 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                  <span className="text-xs font-medium text-gray-800">{t.nameShort}</span>
                  <span className="text-xs text-gray-400">· {t.leader}</span>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      <button onClick={onBack} className="w-full py-2 text-xs text-gray-400 hover:text-gray-600 transition">
        ← 重新开始
      </button>
    </div>
  );
}
