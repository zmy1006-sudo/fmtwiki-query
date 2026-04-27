import React, { useState, useMemo, useRef, useCallback } from 'react';
import { diseases, searchDiseases, type Disease } from './data/diseases';
import { teams, teamCategories, filterTeams, type Team } from './data/teams';
import { aiApps, appTypes, filterAIApps, type AIApp, type AppType, maturityColors, typeColors } from './data/aiApps';
import { sciencePapers, type SciencePaper } from './data/science';
import { literature } from './data/literature';
import { decisionTree, getNodeById, verdictStyleMap, verdictColors, type DecisionNode, type FMTDecision } from './data/decisionTree';
import { EvidenceGuide } from './EvidenceGuide';
import { usePointsStore } from './store/pointsStore';
import { LEVEL_CONFIG } from './data/pointsStore';
import { search, type SearchRecord } from './data/searchIndex';
import { callGLMStream, cleanMarkdown } from './lib/aiSearch';
import AISearchPage from './AISearchPage';

interface DoctorPortalProps {
  onLogout: () => void;
  onOpenUserCenter: () => void;
}

type DoctorTab = 'disease' | 'teams' | 'ai' | 'scienceLit';
type DoctorView =
  | { kind: 'list'; tab: DoctorTab }
  | { kind: 'disease'; disease: Disease }
  | { kind: 'team'; team: Team }
  | { kind: 'aiApp'; app: AIApp }
  | { kind: 'science'; paper: SciencePaper }
  | { kind: 'literature'; entry: any };

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
// ── InfoCard ─────────────────────────────────────────────────
function InfoCard({ icon, title, color, children }: { icon: string; title: string; color: string; children: React.ReactNode }) {
  const colors: Record<string, { border: string; title: string; bg: string }> = {
    blue:    { border: 'border-blue-200',   title: 'text-blue-700',   bg: 'bg-blue-50'    },
    violet:  { border: 'border-violet-200', title: 'text-violet-700', bg: 'bg-violet-50'  },
    cyan:    { border: 'border-cyan-200',   title: 'text-cyan-700',   bg: 'bg-cyan-50'    },
    emerald: { border: 'border-emerald-200',title: 'text-emerald-700',bg: 'bg-emerald-50' },
    amber:   { border: 'border-amber-200',  title: 'text-amber-700',  bg: 'bg-amber-50'   },
    gray:    { border: 'border-gray-200',  title: 'text-gray-600',   bg: 'bg-gray-50'    },
    green:   { border: 'border-green-200', title: 'text-green-700',  bg: 'bg-green-50'   },
    red:     { border: 'border-red-200',   title: 'text-red-700',    bg: 'bg-red-50'     },
    indigo:  { border: 'border-indigo-200', title: 'text-indigo-700', bg: 'bg-indigo-50'  },
  };
  const c = colors[color] || colors.gray;
  return (
    <div className={`bg-white rounded-xl border ${c.border} ${c.bg} p-5`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">{icon}</span>
        <p className={`text-xs font-bold uppercase tracking-wide ${c.title}`}>{title}</p>
      </div>
      {children}
    </div>
  );
}

function DiseaseDetail({ disease, onBack, onShowEvidenceGuide }: { disease: Disease; onBack: () => void; onShowEvidenceGuide?: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶栏 */}
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

        {/* FMT疗效 */}
        {disease.efficacy && (
          <InfoCard icon="💊" title="FMT疗效" color="green">
            <p className="text-sm text-green-800 font-medium">{disease.efficacy}</p>
            <div className="mt-2">
              {onShowEvidenceGuide ? (
                <button
                  onClick={onShowEvidenceGuide}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 border border-green-200 rounded-full text-xs text-green-700 font-semibold hover:bg-green-200 transition"
                >
                  📖 {disease.evidenceGrade}
                </button>
              ) : (
                <p className="text-xs text-green-600 font-semibold">{disease.evidenceGrade}</p>
              )}
            </div>
          </InfoCard>
        )}

        {/* 警示 */}
        {disease.warnings && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
            <span className="text-xl">⚠️</span>
            <p className="text-sm text-red-700 leading-relaxed">{disease.warnings}</p>
          </div>
        )}

        {/* 典型特征 */}
        {disease.clinicalFeatures && (
          <InfoCard icon="🩺" title="典型特征" color="blue">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{disease.clinicalFeatures}</p>
          </InfoCard>
        )}

        {/* 流行病学 */}
        {disease.epidemiology && (
          <InfoCard icon="📊" title="流行病学" color="violet">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{disease.epidemiology}</p>
          </InfoCard>
        )}

        {/* 诊断标准 */}
        {disease.diagnosticCriteria && (
          <InfoCard icon="🔬" title="诊断标准" color="cyan">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{disease.diagnosticCriteria}</p>
          </InfoCard>
        )}

        {/* 疾病概述 */}
        {disease.summary && (
          <InfoCard icon="📋" title="疾病概述" color="gray">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{disease.summary}</p>
          </InfoCard>
        )}

        {/* FMT适应证 */}
        {disease.patientCriteria && (
          <InfoCard icon="✅" title="FMT适应证" color="emerald">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{disease.patientCriteria}</p>
          </InfoCard>
        )}

        {/* 预后与结局 */}
        {disease.diseaseProgression && (
          <InfoCard icon="📈" title="预后与结局" color="amber">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{disease.diseaseProgression}</p>
          </InfoCard>
        )}

        {/* 临床方案 */}
        <InfoCard icon="💊" title="临床方案" color="indigo">
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
                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">{disease.frequency}</p>
              </div>
            </div>
            {disease.protocolNote && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-bold text-gray-500 mb-1">方案备注</p>
                <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{disease.protocolNote}</p>
              </div>
            )}
          </div>
        </InfoCard>

        {/* 禁忌证 */}
        {disease.contraindications && (
          <InfoCard icon="🚫" title="禁忌证" color="red">
            <p className="text-sm text-red-700 leading-relaxed whitespace-pre-line">{disease.contraindications}</p>
          </InfoCard>
        )}

        {/* 参考文献 */}
        <InfoCard icon="📖" title="关键文献" color="gray">
          <div className="space-y-2">
            {disease.sources.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2.5 bg-gray-50 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-200 transition">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  s.type === 'PMID' ? 'bg-green-100 text-green-700' :
                  s.type === 'NCT'  ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-600'
                }`}>{s.type === 'PMID' ? 'P' : s.type === 'NCT' ? 'N' : 'W'}</span>
                <span className="text-xs text-gray-700 flex-1 leading-relaxed">{s.label}</span>
                <ExternalIcon />
              </a>
            ))}
          </div>
        </InfoCard>

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

        {/* 负责人信息卡 */}
        <InfoCard icon="👤" title="负责人信息" color="green">
          <p className="text-sm font-bold text-green-800 mt-1">{team.leader}</p>
          <p className="text-xs text-green-600 mt-0.5">{team.title}</p>
          {/* 联系方式：图标+文字组合 */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            {team.contact.map((c, i) => (
              <div key={i} className="bg-white/70 rounded-lg px-3 py-2 flex items-center gap-2">
                <span className="text-green-500 flex-shrink-0">
                  {c.type === '电话' || c.type === '手机' ? '📞' : '📧'}
                </span>
                <span className="text-xs text-green-800 leading-snug break-all">{c.value}</span>
              </div>
            ))}
          </div>
          {team.website && (
            <a href={team.website} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 bg-green-100 border border-green-200 rounded-full text-xs text-green-700 hover:bg-green-200 transition">
              🌐 官网 <ExternalIcon />
            </a>
          )}
        </InfoCard>

        {/* 研究方向标签卡 */}
        <InfoCard icon="🔬" title="研究方向" color="blue">
          <div className="flex flex-wrap gap-2 mt-1">
            {team.directions.map(d => (
              <span key={d} className="px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs text-blue-700 font-medium">{d}</span>
            ))}
          </div>
          <button
            onClick={() => onTeamClick(relatedTeams[0]?.id || team.id)}
            className="mt-3 inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-blue-200 rounded-full text-xs text-blue-600 hover:bg-blue-50 transition"
          >
            🔍 查看同类团队
          </button>
        </InfoCard>

        {/* 最新成果卡 */}
        <InfoCard icon="🏆" title="最新成果" color="amber">
          <div className="mt-1 bg-amber-50 rounded-lg p-3">
            <p className="text-sm text-amber-800 font-medium leading-relaxed">{team.latestResult}</p>
          </div>
        </InfoCard>

        {/* 代表论文卡 */}
        {team.publications && team.publications.length > 0 && (
          <InfoCard icon="📄" title="代表论文" color="gray">
            <div className="space-y-2 mt-1">
              {team.publications.map((pub, i) => (
                <a key={i} href={pub.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-2 px-3 py-3 bg-gray-50 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-200 transition">
                  <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 border border-green-200">P</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 leading-snug">{pub.title}</p>
                    <p className="text-xs italic text-gray-500 mt-0.5">{pub.journal}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-1.5 py-0.5 bg-gray-100 rounded text-xs text-gray-500">{pub.year}</span>
                      <span className="text-xs text-gray-400">PMID {pub.pmid}</span>
                    </div>
                  </div>
                  <ExternalIcon />
                </a>
              ))}
            </div>
          </InfoCard>
        )}

        {/* 企业概况卡（重点优化） */}
        {(team as any).enterprise && (
          <>
            {((team as any).enterprise.description || ((team as any).enterprise.certifications?.length > 0)) && (
              <InfoCard icon="🏢" title="企业概况" color="violet">
                {((team as any).enterprise.description || ((team as any).enterprise.certifications?.length > 0)) && (
                  <div className="space-y-3 mt-1">
                    {((team as any).enterprise.description) && (
                      <div>
                        <p className="text-xs font-bold text-violet-700 mb-1">📋 机构简介</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{(team as any).enterprise.description}</p>
                      </div>
                    )}
                    {/* 资质认证区 */}
                    {((team as any).enterprise.certifications?.length > 0) && (
                      <div>
                        <p className="text-xs font-bold text-violet-700 mb-2">🏅 资质认证</p>
                        <div className="flex flex-wrap gap-2">
                          {((team as any).enterprise.certifications as string[]).map((cert: string, i: number) => (
                            <span key={i} className="px-2.5 py-1 bg-gradient-to-r from-violet-100 to-purple-100 border border-violet-200 rounded-full text-xs text-violet-700 font-medium">{cert}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </InfoCard>
            )}

            {/* 公司状态 + 临床试验 + 全球布局 */}
            {((team as any).enterprise.companyStatus || ((team as any).enterprise.clinicalTrials != null) || ((team as any).enterprise.globalSites?.length > 0)) && (
              <div className="grid grid-cols-3 gap-3">
                {(team as any).enterprise.companyStatus && (
                  <div className="bg-white rounded-xl border border-purple-200 p-4">
                    <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wide mb-1">融资/上市</p>
                    <p className="text-xs text-gray-700 leading-snug">{(team as any).enterprise.companyStatus}</p>
                  </div>
                )}
                {((team as any).enterprise.clinicalTrials != null) && (
                  <div className="bg-white rounded-xl border border-green-200 p-4">
                    <p className="text-[10px] font-bold text-green-600 uppercase tracking-wide mb-1">临床试验</p>
                    <p className="text-xl font-bold text-green-700 leading-none">{(team as any).enterprise.clinicalTrials}</p>
                    <p className="text-[10px] text-green-500 mt-0.5">项</p>
                  </div>
                )}
                {(team as any).enterprise.globalSites && (team as any).enterprise.globalSites.length > 0 && (
                  <div className="bg-white rounded-xl border border-blue-200 p-4">
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wide mb-1">🗺️ 全球布局</p>
                    <div className="space-y-0.5">
                      {(team as any).enterprise.globalSites.map((s: string, i: number) => (
                        <div key={i} className="text-xs text-gray-600 leading-snug">• {s}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SOP/标准特色 */}
            {((team as any).enterprise.description && ((team as any).enterprise.sopHighlights?.length > 0)) && (
              <div className="bg-white rounded-xl border border-violet-200 p-4">
                <p className="text-xs font-bold text-violet-700 mb-2">📑 标准特色</p>
                <ul className="space-y-1">
                  {((team as any).enterprise.sopHighlights as string[]).map((s: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-700 leading-relaxed">
                      <span className="text-violet-400 flex-shrink-0 mt-0.5">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 竖向时间轴（里程碑/时间线） */}
            {((team as any).enterprise.milestones?.length > 0) && (
              <div className="bg-white rounded-xl border border-purple-200 p-4">
                <p className="text-xs font-bold text-purple-700 mb-3">⏱️ 发展里程碑</p>
                <div className="border-l-2 border-purple-300 pl-4 space-y-3">
                  {((team as any).enterprise.milestones as { year: string; event: string }[]).map((m: { year: string; event: string }, i: number) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-purple-400 border-2 border-white" />
                      <div className="text-xs font-bold text-purple-600">{m.year}</div>
                      <div className="text-xs text-gray-600 leading-snug mt-0.5">{m.event}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* 药物管线卡片 */}
        {(team as any).enterprise?.pipeline?.length > 0 && (
          <InfoCard icon="💊" title="管线/里程碑" color="indigo">
            <div className="space-y-3 mt-2">
              {(team as any).enterprise.pipeline.map((p: any, i: number) => {
                const phaseColor = p.stage.includes('上市') || p.stage.includes('Approved')
                  ? 'bg-rose-100 text-rose-700 border-rose-200'
                  : p.stage.includes('Phase 3') || p.stage.includes('临床III') || p.stage.includes('临床II期')
                  ? 'bg-green-100 text-green-700 border-green-200'
                  : p.stage.includes('Phase 2') || p.stage.includes('临床II')
                  ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                  : p.stage.includes('Phase 1') || p.stage.includes('临床I')
                  ? 'bg-blue-100 text-blue-700 border-blue-200'
                  : 'bg-gray-100 text-gray-600 border-gray-200';
                const progressPct = p.stage.includes('上市') || p.stage.includes('Approved') ? 100
                  : p.stage.includes('Phase 3') ? 80
                  : p.stage.includes('Phase 2') || p.stage.includes('临床II') ? 60
                  : p.stage.includes('Phase 1') || p.stage.includes('临床I') ? 30
                  : p.stage.includes('Pre') || p.stage.includes('临床前') ? 10 : 5;
                return (
                  <div key={i} className="bg-indigo-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-indigo-700 text-sm">{p.code}</span>
                        <span className="text-xs text-gray-500">{p.type}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${phaseColor}`}>{p.stage}</span>
                    </div>
                    {/* 进度条 */}
                    <div className="w-full bg-indigo-100 rounded-full h-1.5 mb-2">
                      <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">适应证：{p.indication}</span>
                      <span className="text-xs text-gray-400">{progressPct}%</span>
                    </div>
                    {p.note && <p className="text-xs text-gray-400 mt-1">备注：{p.note}</p>}
                  </div>
                );
              })}
            </div>
          </InfoCard>
        )}

        {/* 合作机构 */}
        {(team as any).enterprise?.collaborations?.length > 0 && (
          <InfoCard icon="🤝" title="合作机构" color="cyan">
            <div className="space-y-2 mt-1">
              {(team as any).enterprise.collaborations.map((c: string, i: number) => {
                const type = c.includes('医院') ? { icon: '🏥', label: '医院', cls: 'bg-red-50 text-red-600 border-red-200' }
                  : c.includes('大学') || c.includes('学院') ? { icon: '🎓', label: '院校', cls: 'bg-blue-50 text-blue-600 border-blue-200' }
                  : c.includes('研究') ? { icon: '🔬', label: '研究所', cls: 'bg-purple-50 text-purple-600 border-purple-200' }
                  : { icon: '🏢', label: '企业', cls: 'bg-gray-50 text-gray-600 border-gray-200' };
                return (
                  <div key={i} className="flex items-center gap-2 py-1.5">
                    <span className="text-base flex-shrink-0">{type.icon}</span>
                    <span className="text-xs text-gray-700 flex-1 leading-snug">{c}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-xs border font-medium ${type.cls}`}>{type.label}</span>
                  </div>
                );
              })}
            </div>
          </InfoCard>
        )}

        {/* 发展里程碑（横向时间轴） */}
        {(team as any).enterprise?.milestones?.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">📅 发展里程碑</p>
            <div className="relative">
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200" />
              <div className="flex justify-between overflow-x-auto gap-2 pb-1">
                {(team as any).enterprise.milestones.slice(0, 6).map((m: any, i: number) => (
                  <div key={i} className="flex flex-col items-center flex-shrink-0" style={{ minWidth: '80px' }}>
                    <div className="relative z-10 w-8 h-8 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center mb-1.5">
                      <span className="text-xs font-bold text-gray-600">{m.year.slice(-2)}</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-600 text-center leading-snug">{m.year}</span>
                    <span className="text-[10px] text-gray-400 text-center leading-snug mt-0.5 line-clamp-2">{m.event}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 同类型团队 */}
        {relatedTeams.length > 0 && (
          <InfoCard icon="🔗" title="同类型团队" color="gray">
            <div className="space-y-2 mt-1">
              {relatedTeams.map(t => (
                <button key={t.id} onClick={() => onTeamClick(t.id)}
                  className="w-full text-left flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 border border-transparent hover:border-gray-200 transition">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{t.nameShort}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{t.leader} · {t.location}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {t.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px]">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </InfoCard>
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
  // 成熟度颜色映射（用于badge展示）
  const maturityBadge = (m: string) => {
    const map: Record<string, { cls: string; label: string }> = {
      '实验室':   { cls: 'bg-gray-100 text-gray-600 border-gray-300', label: '🔬 实验室' },
      '临床验证': { cls: 'bg-blue-100 text-blue-700 border-blue-300', label: '🏥 临床验证' },
      '已商业化': { cls: 'bg-purple-100 text-purple-700 border-purple-300', label: '💰 已商业化' },
    };
    const b = map[m] || { cls: 'bg-gray-100 text-gray-600 border-gray-300', label: m };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${b.cls}`}>{b.label}</span>;
  };

  // 证据级别颜色映射
  const evidenceBadge = (e?: string) => {
    if (!e) return null;
    const map: Record<string, string> = {
      'case-report': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      '队列': 'bg-blue-50 text-blue-700 border-blue-200',
      'RCT': 'bg-green-50 text-green-700 border-green-200',
      '荟萃分析': 'bg-purple-50 text-purple-700 border-purple-200',
      '指南': 'bg-rose-50 text-rose-700 border-rose-200',
    };
    return <span className={`px-2 py-0.5 rounded-full text-xs border font-medium ${map[e] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>📊 {e}</span>;
  };

  // 监管状态
  const regulatoryStatus = (app as any).regulatoryStatus;
  const regulatoryBadges = regulatoryStatus ? (Array.isArray(regulatoryStatus) ? regulatoryStatus : [regulatoryStatus]).map((s: string) => {
    const cls = s.includes('FDA') ? 'bg-green-100 text-green-700 border-green-200'
      : s.includes('NMPA') ? 'bg-red-100 text-red-700 border-red-200'
      : s.includes('EMA') ? 'bg-blue-100 text-blue-700 border-blue-200'
      : 'bg-gray-100 text-gray-600 border-gray-200';
    return <span key={s} className={`px-2 py-0.5 rounded-full text-xs border font-medium ${cls}`}>🏛️ {s}</span>;
  }) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} className="text-gray-400 hover:text-gray-700 transition"><BackIcon /></button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-gray-900 truncate">{app.name}</h1>
            <p className="text-xs text-gray-400">{app.institution} · {app.location}</p>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${typeColors[app.type]}`}>{app.type}</span>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-5 space-y-4">
        {/* 基本信息卡 */}
        <InfoCard icon="ℹ️" title="基本信息" color="gray">
          <div className="grid grid-cols-2 gap-3 mt-1">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1">机构</p>
              <p className="text-xs text-gray-800 font-medium leading-snug">{app.institution}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1">位置</p>
              <p className="text-xs text-gray-800 font-medium leading-snug">{app.location}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1">类型</p>
              <p className="text-xs text-gray-800 font-medium leading-snug">{app.type}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1">成熟度</p>
              {maturityBadge(app.maturity)}
            </div>
          </div>
          {/* 第3行：证据级别 + 监管状态 */}
          {(app as any).evidenceLevel && (
            <div className="bg-gray-50 rounded-lg p-3 mt-2">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1.5">证据级别</p>
              <div className="flex flex-wrap gap-1.5">
                {evidenceBadge((app as any).evidenceLevel)}
              </div>
            </div>
          )}
          {regulatoryBadges && (
            <div className="bg-gray-50 rounded-lg p-3 mt-2">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1.5">监管状态</p>
              <div className="flex flex-wrap gap-1.5">
                {regulatoryBadges}
              </div>
            </div>
          )}
        </InfoCard>

        {/* 技术方向标签卡 */}
        <InfoCard icon="🧠" title="技术方向" color="blue">
          <div className="flex flex-wrap gap-2 mt-1">
            {app.techAreas.map(t => (
              <span key={t} className="px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs text-blue-700 font-medium">{t}</span>
            ))}
          </div>
        </InfoCard>

        {/* 应用描述卡 */}
        <InfoCard icon="📋" title="应用描述" color="gray">
          <p className="text-sm text-gray-700 leading-relaxed mt-1 whitespace-pre-line">{app.description}</p>
        </InfoCard>

        {/* 关键成果卡 */}
        <InfoCard icon="🏆" title="关键成果" color="green">
          <div className="mt-1 bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-800 leading-relaxed">{app.keyResult}</p>
            {/* 提取数字高亮 */}
            <div className="mt-2 flex flex-wrap gap-2">
              {Array.from(app.keyResult.matchAll(/(\d+)/g)).slice(0, 3).map((m, i) => (
                <span key={i} className="px-2 py-0.5 bg-green-100 rounded text-xs font-bold text-green-700">{m[0]}</span>
              ))}
            </div>
          </div>
        </InfoCard>

        {/* FMT环节卡：流程图样式 */}
        <InfoCard icon="🔄" title="FMT环节" color="violet">
          <div className="mt-2 bg-violet-50 rounded-lg p-4">
            <p className="text-sm font-bold text-violet-800">{app.fmtStage}</p>
          </div>
        </InfoCard>

        {/* 局限性卡（新增） */}
        {(app as any).limitations && (
          <InfoCard icon="⚠️" title="局限性" color="red">
            <p className="text-sm text-red-700 leading-relaxed mt-1 whitespace-pre-line">{(app as any).limitations}</p>
          </InfoCard>
        )}

        {/* 未来方向卡（新增） */}
        {(app as any).futureDirections && (
          <InfoCard icon="🔮" title="未来方向" color="blue">
            <div className="mt-1 space-y-1.5">
              {String((app as any).futureDirections).split(/[；;；\n]/).filter(Boolean).map((d: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-sm text-blue-700 leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  <span>{d.trim()}</span>
                </div>
              ))}
            </div>
          </InfoCard>
        )}

        {/* 相关文献卡（新增） */}
        {(app as any).relatedPMID?.length > 0 && (
          <InfoCard icon="📚" title="相关文献" color="green">
            <div className="space-y-2 mt-1">
              {((app as any).relatedPMID as string[]).map((pmid: string, i: number) => (
                <a key={i} href={`https://pubmed.ncbi.nlm.nih.gov/${pmid.replace(/\D/g, '')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2.5 bg-green-50 rounded-lg hover:bg-green-100 border border-transparent hover:border-green-200 transition">
                  <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center flex-shrink-0 border border-green-200">P</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-medium text-green-800">PubMed ID: {pmid}</span>
                  </div>
                  <ExternalIcon />
                </a>
              ))}
            </div>
          </InfoCard>
        )}

        {/* 来源链接卡 */}
        {app.sourceUrl && (
          <InfoCard icon="📖" title="来源链接" color="gray">
            <a href={app.sourceUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 mt-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition">
              <span className="text-xs text-blue-600 underline break-all">{app.sourceLabel || app.sourceUrl}</span>
              <ExternalIcon />
            </a>
          </InfoCard>
        )}

        {/* 官网按钮 */}
        {app.website ? (
          <a href={app.website} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition">
            🌐 访问官网 <ExternalIcon />
          </a>
        ) : null}
      </div>
    </div>
  );
}

// ── Science Tab ─────────────────────────────────────────────
// ── Science + Literature 合并Tab ────────────────────────────────
type LitFilter = 'all' | 'science' | 'literature' | 'rcdi' | 'ibd' | 'oncology' | 'metabolic' | 'neuro';

const LIT_FILTER_LABELS: Record<LitFilter, string> = {
  all: '全部',
  science: 'Science',
  literature: '核心文献',
  rcdi: 'rCDI',
  ibd: 'IBD',
  oncology: '肿瘤',
  metabolic: '代谢',
  neuro: '神经精神',
};

function ScienceLitTab({
  onSelectPaper,
  onSelectLit,
}: {
  onSelectPaper: (p: SciencePaper) => void;
  onSelectLit: (e: any) => void;
}) {
  const [filter, setFilter] = useState<LitFilter>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return null; // 全部显示
    if (filter === 'science') return { type: 'science' as const };
    if (filter === 'literature') return { type: 'literature' as const };
    // 按疾病筛选
    const diseaseMap: Record<string, string[]> = {
      rcdi: ['rCDI', 'rcdi', '复发性艰难梭菌', '艰难梭菌'],
      ibd: ['IBD', 'UC', 'CD', '溃疡性结肠炎', '克罗恩病'],
      oncology: ['肿瘤', '癌症', '黑色素瘤', 'ICI', 'onco', 'Oncology'],
      metabolic: ['代谢', '糖尿病', '肥胖', 'Metabolic', 'NAFLD'],
      neuro: ['神经', '帕金森', 'ASD', '自闭症', 'Parkinson', 'Neuro'],
    };
    return { type: 'disease' as const, diseases: diseaseMap[filter] || [] };
  }, [filter]);

  const scienceBadge = (year: number, volume: string) => (
    <span className="px-1.5 py-0.5 bg-red-50 border border-red-200 rounded text-xs text-red-600 font-bold">Science</span>
  );
  const litBadge = (item: any) => {
    const grade = item.evidenceGrade || '';
    const oxfordMatch = grade.match(/Oxford\s*([1-5][a-b]?)/i);
    const gradeMatch = grade.match(/GRADE\s*([A-D])/i);
    const isPositive = item.effectiveness === 'positive' ||
      (item.effectiveness !== 'negative' && grade.includes('✅')) ||
      item.keyFindings?.[0]?.toLowerCase().includes('显著') ||
      item.keyFindings?.[0]?.toLowerCase().includes('治愈率') ||
      item.keyFindings?.[0]?.toLowerCase().includes('缓解率') ||
      item.keyFindings?.[0]?.toLowerCase().includes('应答率');

    return (
      <div className="flex items-center gap-1 flex-wrap">
        <span className="px-1.5 py-0.5 bg-purple-50 border border-purple-200 rounded text-xs text-purple-600 font-bold">文献</span>
        {oxfordMatch && (
          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
            oxfordMatch[1].startsWith('1') ? 'bg-green-50 text-green-700 border border-green-200' :
            oxfordMatch[1].startsWith('2') ? 'bg-blue-50 text-blue-700 border border-blue-200' :
            'bg-gray-50 text-gray-600 border border-gray-200'
          }`}>{oxfordMatch[1]}</span>
        )}
        {gradeMatch && (
          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
            gradeMatch[1] === 'A' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
            gradeMatch[1] === 'B' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
            gradeMatch[1] === 'C' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
            'bg-red-50 text-red-700 border border-red-200'
          }`}>G{gradeMatch[1]}</span>
        )}
        {isPositive ? (
          <span className="px-1.5 py-0.5 bg-green-50 border border-green-200 rounded text-xs text-green-700 font-medium">✓ 支持</span>
        ) : item.effectiveness === 'negative' && (
          <span className="px-1.5 py-0.5 bg-red-50 border border-red-200 rounded text-xs text-red-700 font-medium">✗ 阴性</span>
        )}
      </div>
    );
  };

  const Card = ({
    item, badge, onClick,
  }: { item: any; badge: React.ReactNode; onClick: () => void }) => (
    <button onClick={onClick}
      className="w-full text-left bg-white rounded-xl border border-gray-200 p-4 hover:border-indigo-300 hover:shadow-sm transition group">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            {badge}
            {item.studyType && (
              <span className="px-1.5 py-0.5 bg-purple-50 border border-purple-200 rounded text-xs text-purple-600 font-bold">{item.studyType}</span>
            )}
            <span className="text-xs text-gray-400">{item.year}</span>
            {item.evidenceGrade && (
              <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                item.evidenceGrade.includes('1a') || item.evidenceGrade.includes('1b')
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : item.evidenceGrade.includes('2')
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-gray-50 text-gray-600 border border-gray-200'
              }`}>{item.evidenceGrade}</span>
            )}
          </div>
          <h3 className="text-sm font-bold text-gray-900 group-hover:text-indigo-700 transition leading-snug line-clamp-2">{item.title}</h3>
          <p className="text-xs text-gray-400 leading-relaxed mt-0.5">{item.journal} · {item.year}</p>
          {(item.targetIndication || item.disease) && (
            <span className="inline-block mt-1.5 px-2 py-0.5 bg-indigo-50 border border-indigo-200 rounded text-xs text-indigo-600">{item.targetIndication || item.disease}</span>
          )}
          {item.significance && (
            <p className="text-xs text-amber-600 mt-1 line-clamp-1 font-medium">📌 {item.significance}</p>
          )}
        </div>
        <svg className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );

  const total = sciencePapers.length + literature.length;
  const showScience = !filtered || filtered.type === 'science';
  const showLit = !filtered || filtered.type === 'literature';

  return (
    <div>
      {/* 顶部标题栏 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 pt-4 pb-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
              <span className="text-xl">📚</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Science + 核心文献</h2>
              <p className="text-xs text-gray-500">Science 期刊 · PubMed 验证文献 · 共{total}篇</p>
            </div>
          </div>
          {/* 筛选标签 */}
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(LIT_FILTER_LABELS) as LitFilter[]).map(k => (
              <button key={k} onClick={() => setFilter(k)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${
                  filter === k
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                }`}>
                {LIT_FILTER_LABELS[k]}
                {k === 'science' && `(${sciencePapers.length})`}
                {k === 'literature' && `(${literature.length})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4 space-y-6">
        {/* Science 期刊 */}
        {showScience && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-red-600">🔬 Science 期刊</span>
              <span className="text-xs text-gray-400">{sciencePapers.length} 篇</span>
            </div>
            <div className="space-y-2">
              {sciencePapers.map(p => (
                <Card key={p.id} item={p}
                  badge={scienceBadge(p.year, p.volume)}
                  onClick={() => onSelectPaper(p)} />
              ))}
            </div>
          </div>
        )}

        {/* 核心文献 */}
        {showLit && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-purple-600">📖 核心文献（PubMed 验证）</span>
              <span className="text-xs text-gray-400">{literature.length} 篇</span>
            </div>
            {filtered && filtered.type === 'disease' ? (
              // 按疾病筛选模式
              <div className="space-y-2">
                {literature
                  .filter(l => filtered.diseases.some(d => (l as any).disease?.includes(d)))
                  .map(l => (
                    <Card key={l.id} item={l}
                      badge={litBadge(l)}
                      onClick={() => onSelectLit(l)} />
                  ))}
              </div>
            ) : (
              <div className="space-y-2">
                {literature.map(l => (
                  <Card key={l.id} item={l}
                    badge={litBadge(l)}
                    onClick={() => onSelectLit(l)} />
                ))}
              </div>
            )}
          </div>
        )}
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

// ── Literature Detail ────────────────────────────────────
function LiteratureDetail({ entry, onBack }: { entry: any; onBack: () => void }) {
  const gradeColor = (g: string) => {
    if (!g) return 'bg-gray-100 text-gray-600';
    if (g.includes('1a') || g.includes('1b')) return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    if (g.includes('2')) return 'bg-blue-50 text-blue-700 border border-blue-200';
    return 'bg-amber-50 text-amber-700 border border-amber-200';
  };

  const entryAny = entry as any;
  const pmid = entryAny.pmid;
  const doi = entryAny.doi;
  const title = entryAny.title || '';
  const authors = entryAny.authors || '';
  const journal = entryAny.journal || '';
  const year = entryAny.year;
  const studyType = entryAny.studyType || '';
  const evidenceGrade = entryAny.evidenceGrade || '';
  const targetIndication = entryAny.targetIndication || entryAny.disease || '';
  const population = entryAny.population || '';
  const n = entryAny.n;
  const intervention = entryAny.intervention || '';
  const control = entryAny.control || '';
  const outcomes = entryAny.outcomes;
  const keyFindings = entryAny.keyFindings || [];
  const sources = entryAny.sources || [];
  const abstract = entryAny.abstract || '';
  const keywords = entryAny.keywords || [];
  const significance = entryAny.significance || '';
  const notes = entryAny.notes || '';

  // Authors display
  const authorsDisplay = Array.isArray(authors) ? authors.join(' · ') : authors;

  // Outcomes display
  const primaryOutcome = outcomes?.primary || '';
  const secondaryOutcome = outcomes?.secondary || '';
  const outcomesText = outcomes && typeof outcomes === 'object'
    ? (primaryOutcome ? `主要结局：${primaryOutcome}` : '') +
      (secondaryOutcome ? `\n次要结局：${secondaryOutcome}` : '')
    : (typeof outcomes === 'string' ? outcomes : '');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} className="text-gray-400 hover:text-gray-700 transition"><BackIcon /></button>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              {studyType && (
                <span className="px-2 py-0.5 bg-purple-600 text-white rounded text-xs font-bold">{studyType}</span>
              )}
              {evidenceGrade && (
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${gradeColor(evidenceGrade)}`}>{evidenceGrade}</span>
              )}
              {targetIndication && (
                <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded text-xs font-medium">{targetIndication}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {pmid && (
              <a href={`https://pubmed.ncbi.nlm.nih.gov/${pmid}/`} target="_blank" rel="noopener noreferrer"
                className="px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs text-blue-700 hover:bg-blue-100 transition flex items-center gap-1">
                PMID {pmid} <ExternalIcon />
              </a>
            )}
          </div>
        </div>
        {doi && (
          <div className="max-w-4xl mx-auto px-4 pb-2">
            <a href={`https://doi.org/${doi}`} target="_blank" rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:text-blue-700 font-mono flex items-center gap-1">
              DOI: {doi} <ExternalIcon />
            </a>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4 py-5 space-y-4">

        {/* ── Title & Meta ── */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h1 className="text-base font-bold text-gray-900 leading-snug">{title}</h1>
          <p className="text-sm text-gray-600 mt-2">{authorsDisplay}</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {journal && <span className="text-xs text-gray-500 font-medium">{journal}</span>}
            {year && <span className="text-xs text-gray-400">{year}</span>}
            {n > 0 && <span className="text-xs text-gray-400">n={n}</span>}
          </div>
        </div>

        {/* ── Study Design Bar ── */}
        <div className="bg-purple-50 border border-purple-100 rounded-xl px-4 py-3">
          <div className="flex flex-wrap items-center gap-4 text-xs text-purple-800">
            {studyType && (
              <div className="flex items-center gap-1.5">
                <span className="font-bold">📋</span>
                <span className="font-semibold">研究设计：{studyType}</span>
              </div>
            )}
            {n > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="font-bold">👥</span>
                <span>n={n}</span>
              </div>
            )}
            {population && (
              <div className="flex items-center gap-1.5">
                <span className="font-bold">🎯</span>
                <span className="truncate max-w-xs">{population.length > 60 ? population.slice(0, 60) + '…' : population}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Intervention & Control ── */}
        {(intervention || control) && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">干预与对照</p>
            {intervention && (
              <div className="flex gap-2">
                <span className="text-xs bg-green-50 border border-green-200 text-green-700 px-2 py-0.5 rounded font-bold flex-shrink-0">💊干预</span>
                <p className="text-sm text-gray-700">{intervention}</p>
              </div>
            )}
            {control && (
              <div className="flex gap-2">
                <span className="text-xs bg-gray-50 border border-gray-200 text-gray-600 px-2 py-0.5 rounded font-bold flex-shrink-0">📊对照</span>
                <p className="text-sm text-gray-700">{control}</p>
              </div>
            )}
          </div>
        )}

        {/* ── Outcomes ── */}
        {outcomesText && (
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">结局指标</p>
            <div className="space-y-2">
              {primaryOutcome && (
                <div className="flex gap-2">
                  <span className="text-xs bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 rounded font-bold flex-shrink-0">🔬主要</span>
                  <p className="text-sm text-gray-700 leading-relaxed">{primaryOutcome}</p>
                </div>
              )}
              {secondaryOutcome && (
                <div className="flex gap-2">
                  <span className="text-xs bg-gray-50 border border-gray-200 text-gray-600 px-2 py-0.5 rounded font-bold flex-shrink-0">🔬次要</span>
                  <p className="text-sm text-gray-700 leading-relaxed">{secondaryOutcome}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Significance (NEW) ── */}
        {significance && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <span className="text-base mt-0.5">📌</span>
              <div>
                <p className="text-xs font-bold text-amber-700 uppercase mb-1">参考意义</p>
                <p className="text-sm text-amber-900 leading-relaxed font-medium">{significance}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Keywords (NEW) ── */}
        {keywords.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <span className="text-base mt-0.5">🔑</span>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">关键词</p>
                <div className="flex flex-wrap gap-1.5">
                  {keywords.map((kw: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 bg-gray-100 border border-gray-200 rounded-full text-xs text-gray-600">{kw}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Abstract (NEW) ── */}
        {abstract && (
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-bold text-gray-500 uppercase mb-2">摘要 Abstract</p>
            <p className="text-sm text-gray-700 leading-relaxed">{abstract}</p>
          </div>
        )}

        {/* ── Key Findings ── */}
        {keyFindings.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-bold text-gray-500 uppercase mb-3">关键发现</p>
            <div className="space-y-2">
              {keyFindings.map((f: string, i: number) => (
                <div key={i} className="flex gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">✅</span>
                  <p className="text-sm text-gray-700 leading-relaxed">{f}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Notes ── */}
        {notes && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">备注</p>
            <p className="text-xs text-gray-600 leading-relaxed">{notes}</p>
          </div>
        )}

        {/* ── Sources ── */}
        {sources.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-bold text-gray-500 uppercase mb-2">来源</p>
            <div className="space-y-2">
              {sources.map((s: any, i: number) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                  <span className="text-xs font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">{s.type}</span>
                  <span className="text-xs text-blue-600 font-mono truncate flex-1">{s.label}</span>
                  <ExternalIcon />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Bottom spacer */}
        <div className="h-8" />
      </div>
    </div>
  );
}

// ── Disease Tab ──────────────────────────────────────────
function DiseaseTab({ onSelect, query = '' }: { onSelect: (d: Disease) => void; query?: string }) {
  const [activeCategory, setActiveCategory] = useState('全部');
  const categories = ["全部","感染性疾病","炎症性肠病","功能性胃肠病","神经系统疾病","肝脏疾病","神经发育障碍","代谢性疾病","感染防控","肿瘤与免疫"];
  const filtered = useMemo(() => {
    let r = searchDiseases(query);
    if (activeCategory !== '全部') r = r.filter(d => d.category === activeCategory);
    return r;
  }, [query, activeCategory]);
  return (
    <div>
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 pt-4 pb-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
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
export default function DoctorPortal({ onLogout, onOpenUserCenter }: Omit<DoctorPortalProps, 'onOpenAISearch'>) {
  const [view, setView] = useState<DoctorView>({ kind: 'list', tab: 'disease' });
  const [showDecisionTree, setShowDecisionTree] = useState(false);
  const [showEvidenceGuide, setShowEvidenceGuide] = useState(false);

  // ── 搜索状态 ──────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [kbResults, setKbResults] = useState<SearchRecord[] | null>(null);
  const [kbLoading, setKbLoading] = useState(false);
  const [showAISearch, setShowAISearch] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiContent, setAiContent] = useState('');
  const [aiError, setAiError] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState<'idle' | 'kb' | 'ai'>('idle');
  const aiAbortRef = useRef<(() => void) | null>(null);

  const activeTab = view.kind === 'list' ? view.tab : null;
  const currentUser = usePointsStore(s => s.currentUser);

  // 知识库检索
  const handleKBSearch = useCallback(() => {
    const q = searchQuery.trim();
    if (!q) return;
    setSearchMode('kb');
    setKbLoading(true);
    setAiContent('');
    setAiError(null);
    aiAbortRef.current?.();

    try {
      const results = search(q, 'doctor');
      setKbResults(results);
      setKbLoading(false);
      // 无结果 → 自动触发AI搜索
      if (results.length === 0) {
        handleAISearch(q);
      }
    } catch {
      setKbResults([]);
      setKbLoading(false);
    }
  }, [searchQuery]);

  // AI智能搜索（四阶段）
  const handleAISearch = useCallback((q?: string) => {
    const query = (q ?? searchQuery).trim();
    if (!query) return;
    setSearchMode('ai');
    setAiLoading(true);
    setAiContent('');
    setAiError(null);
    setKbResults(null);
    aiAbortRef.current?.();

    let rawContent = '';
    const onToken = (token: string, done: boolean) => {
      rawContent += token;
      setAiContent(cleanMarkdown(rawContent));
      if (done) setAiLoading(false);
    };
    const onError = (msg: string) => {
      setAiError(msg);
      setAiLoading(false);
    };
    callGLMStream(query, 'doctor', onToken, onError)
      .then(({ abort }) => { aiAbortRef.current = abort; })
      .catch(() => { setAiLoading(false); });
  }, [searchQuery]);

  const clearDoctorSearch = () => {
    setSearchQuery('');
    setKbResults(null);
    setAiContent('');
    setAiError(null);
    setSearchMode('idle');
    aiAbortRef.current?.();
  };

  const tabConfig = [
    { id: 'disease' as DoctorTab, label: '💊 适应证', count: diseases.length },
    { id: 'teams' as DoctorTab, label: '🔬 团队', count: teams.length },
    { id: 'ai' as DoctorTab, label: '🤖 AI应用', count: aiApps.length },
    { id: 'scienceLit' as DoctorTab, label: '📚文献', count: sciencePapers.length + literature.length },
  ];

  // AI思考步骤渲染（避免JSX嵌套模板复杂度）
  const aiSteps = [
    { icon: '🧠', text: `正在分析您的问题：${searchQuery}`, done: true },
    { icon: '📚', text: '正在检索本地知识库（适应证 + 文献 + 指南）', done: true },
    { icon: '🔬', text: '正在匹配相关临床证据', done: aiContent.length > 0 },
    { icon: '✍️', text: '正在生成专业回答', done: aiContent.length > 0 },
  ];

  const renderSteps = () => aiSteps.map((step) => (
    <div key={step.icon} className="flex items-center gap-2.5">
      {step.done
        ? <span className="text-green-500 text-sm flex-shrink-0">✓</span>
        : <span className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />}
      <span className={`text-xs ${step.done ? 'text-gray-500' : 'text-indigo-600'}`}>
        {step.icon} {step.text}
      </span>
    </div>
  ));

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
          <div className="flex items-center gap-2">
            {/* User Points Card */}
            <button
              onClick={onOpenUserCenter}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full transition"
            >
              <span className="text-sm">⭐</span>
              <span className="text-xs font-bold text-white">{currentUser.points}</span>
              <span className="text-xs text-white/60">积分</span>
            </button>
            <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full">👨‍⚕️ 医生</span>
            <button onClick={() => setShowEvidenceGuide(true)} className="px-3 py-1.5 bg-white border border-blue-200 rounded-full text-xs text-blue-600 hover:bg-blue-50 transition">📊 证据说明</button>
            <button onClick={() => setShowDecisionTree(true)} className="px-3 py-1.5 bg-indigo-600 border border-indigo-500 rounded-full text-xs text-white hover:bg-indigo-500 transition font-medium">🔀 决策树</button>
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


      {/* 搜索栏 */}
      {view.kind === 'list' && (
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleKBSearch()}
                  placeholder="搜索适应证、文献、指南…"
                  className="w-full pl-9 pr-28 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                {/* 右侧两按钮 */}
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                  <button onClick={handleKBSearch}
                    className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition shadow-sm">
                    📖 知识库检索
                  </button>
                  <button onClick={() => handleAISearch()}
                    className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition shadow-sm">
                    🤖 AI智能搜索
                  </button>
                </div>
              </div>
              {(kbResults || aiContent || aiLoading) && (
                <button onClick={clearDoctorSearch}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* 知识库检索结果（AI模式下隐藏） */}
            {searchMode !== 'ai' && kbLoading && (
              <div className="flex items-center gap-2 mt-2 text-xs text-blue-600">
                <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                正在检索知识库…
              </div>
            )}
            {searchMode === 'kb' && kbResults !== null && kbResults.length > 0 && !aiLoading && (
              <div className="mt-2 flex items-center gap-2 text-xs text-green-600">
                <span>✅</span> 知识库找到 <strong>{kbResults.length}</strong> 条相关结果
              </div>
            )}
            {searchMode === 'kb' && kbResults !== null && kbResults.length === 0 && !aiLoading && (
              <div className="mt-2 text-xs text-gray-400">📖 知识库暂无「{searchQuery}」相关内容，正在启动 AI 智能搜索…</div>
            )}

            {/* AI 四阶段显示 */}
            {(aiLoading || aiContent || aiError) && (
              <div className="mt-3 bg-white rounded-xl border border-indigo-100 shadow-sm overflow-hidden">
                {/* 标题栏 */}
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-3 flex items-center gap-2">
                  <span className="text-white text-sm">🤖</span>
                  <div>
                    <p className="text-sm font-bold text-white">AI 智能分析</p>
                    <p className="text-xs text-white/60">基于 DeepSeek 大模型 · FMT 医学知识库</p>
                  </div>
                  {aiLoading && (
                    <div className="ml-auto flex items-center gap-1.5 text-white/80 text-xs">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-ping" />
                      分析中…
                    </div>
                  )}
                </div>
                {/* AI思考动画 - DeepSeek风格 */}
                {aiLoading && (
                  <div className="px-4 py-4 border-t border-indigo-50">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      {/* Thinking进度步骤（内容来时✍️立即变✓） */}
                      <div className="space-y-2.5 mb-4">
                        {renderSteps()}
                      </div>
                      {/* 实时输出区（内容逐字出现，光标跟随） */}
                      <div className="bg-white rounded-lg border border-gray-200 p-3 min-h-[60px]">
                        <div className="text-xs text-gray-700 leading-6 whitespace-pre-wrap">{aiContent}</div>
                        {aiLoading && <span className="inline-block w-1.5 h-3.5 bg-indigo-400 ml-1 animate-pulse align-middle" />}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">基于 DeepSeek 大模型 · FMT 医学知识库</span>
                      <button
                        onClick={() => { aiAbortRef.current?.(); setAiLoading(false); setAiContent(''); setAiError(null); }}
                        className="px-3 py-1 bg-white border border-gray-200 text-gray-500 rounded-lg text-xs hover:bg-gray-50 transition"
                      >
                        ⏹ 停止
                      </button>
                    </div>
                  </div>
                )}
                {/* AI回答（完成后） */}
                {!aiLoading && aiContent && (
                  <div className="px-4 py-4 border-t border-indigo-50">
                    <div className="text-sm text-gray-700 leading-7 whitespace-pre-line">{aiContent}</div>
                    {/* 免责声明 */}
                    <div className="mt-3 pt-3 border-t border-gray-100 bg-amber-50 rounded-xl px-3 py-2">
                      <p className="text-xs text-amber-700 leading-relaxed">
                        <strong>⚠️ 免责声明：</strong>以上 AI 回答仅供参考，不能替代医生诊断。具体治疗方案请遵医嘱。
                      </p>
                    </div>
                  </div>
                )}
                {/* AI错误 */}
                {aiError && !aiLoading && (
                  <div className="px-4 py-3 border-t border-indigo-50">
                    <p className="text-xs text-red-600">⚠️ {aiError}</p>
                  </div>
                )}
              </div>
            )}

            {/* 知识库结果列表（AI模式下隐藏） */}
            {searchMode !== 'ai' && !aiLoading && kbResults !== null && kbResults.length > 0 && (
              <div className="mt-3 space-y-2">
                {kbResults.slice(0, 8).map(r => (
                  <button key={r.id}
                    onClick={() => {
                      // 根据类型导航到对应详情页
                      if (r.id.startsWith('disease-')) {
                        const d = diseases.find(x => x.id === r.id.replace('disease-', ''));
                        if (d) setView({ kind: 'disease', disease: d });
                      } else if (r.id.startsWith('team-')) {
                        const t = teams.find(x => x.id === r.id.replace('team-', ''));
                        if (t) setView({ kind: 'team', team: t });
                      } else if (r.id.startsWith('aiApp-')) {
                        const a = aiApps.find(x => x.id === r.id.replace('aiApp-', ''));
                        if (a) setView({ kind: 'aiApp', app: a });
                      } else if (r.id.startsWith('science-') || r.id.startsWith('literature-')) {
                        const entry = literature.find(x => x.id === r.id.replace('literature-', '').replace('science-', '')) ||
                          sciencePapers.find(x => x.id === (r.id.includes('science-') ? r.id.replace('science-', '') : r.id));
                        if (entry) {
                          if ('journal' in entry) setView({ kind: 'literature', entry });
                          else setView({ kind: 'science', paper: entry as SciencePaper });
                        }
                      }
                      clearDoctorSearch();
                    }}
                    className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-100 transition">
                    <p className="text-xs text-blue-400 mb-0.5 font-medium">{r.type}</p>
                    <p className="text-sm font-semibold text-gray-800">{r.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{r.summary}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {view.kind === 'list' && !(searchMode === 'ai' || aiLoading || aiContent) && (
          <>
            {view.tab === 'disease' && <DiseaseTab onSelect={d => setView({ kind: 'disease', disease: d })} query={searchQuery} />}
            {view.tab === 'teams' && <TeamsTab onSelect={t => setView({ kind: 'team', team: t })} />}
            {view.tab === 'ai' && <AIAppsTab onSelect={a => setView({ kind: 'aiApp', app: a })} />}
            {view.tab === 'scienceLit' && (
              <ScienceLitTab
                onSelectPaper={p => setView({ kind: 'science', paper: p })}
                onSelectLit={e => setView({ kind: 'literature', entry: e })}
              />
            )}
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
        {view.kind === 'science' && <ScienceDetail paper={view.paper} onBack={() => setView({ kind: 'list', tab: 'scienceLit' })} />}
        {view.kind === 'literature' && <LiteratureDetail entry={view.entry} onBack={() => setView({ kind: 'list', tab: 'scienceLit' })} />}
      </div>

      {/* Disclaimer */}
      {view.kind === 'list' && !(searchMode === 'ai' || aiLoading || aiContent) && (
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
