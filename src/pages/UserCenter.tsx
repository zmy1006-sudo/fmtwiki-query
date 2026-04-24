import React, { useState, useEffect } from 'react';
import { usePointsStore } from '../store/pointsStore';
import { LEVEL_CONFIG, getLevelColor, POINTS_RULES, type Level } from '../data/pointsStore';
import ContributionForm from '../components/ContributionForm';
import FeedbackButton from '../components/FeedbackButton';

type TabType = 'history' | 'contributions' | 'feedback' | 'levels';

interface UserCenterProps {
  onBack: () => void;
}

export default function UserCenter({ onBack }: UserCenterProps) {
  const {
    currentUser,
    getUserPointsHistory,
    getUserContributions,
    getUserFeedbacks,
    recordDailyLogin,
    browseEntry,
    downloadPDF,
    contributions,
  } = usePointsStore();

  const [activeTab, setActiveTab] = useState<TabType>('history');
  const [showContributionForm, setShowContributionForm] = useState(false);
  const [loginBonus, setLoginBonus] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const pointsHistory = getUserPointsHistory(currentUser.userId);
  const myContributions = getUserContributions(currentUser.userId);
  const myFeedbacks = getUserFeedbacks(currentUser.userId);

  // 尝试领取每日登录积分
  useEffect(() => {
    const got = recordDailyLogin(currentUser.userId);
    if (got) setLoginBonus(true);
  }, []);

  const filteredContributions = filterStatus === 'all'
    ? myContributions
    : myContributions.filter(c => c.status === filterStatus);

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    pending: { label: '审核中', color: 'text-amber-700', bg: 'bg-amber-50' },
    approved: { label: '已采纳', color: 'text-emerald-700', bg: 'bg-emerald-50' },
    rejected: { label: '未通过', color: 'text-red-700', bg: 'bg-red-50' },
    reviewed: { label: '已查看', color: 'text-blue-700', bg: 'bg-blue-50' },
    resolved: { label: '已解决', color: 'text-emerald-700', bg: 'bg-emerald-50' },
  };

  const tabs = [
    { key: 'history' as TabType, label: '📜 积分明细', count: pointsHistory.length },
    { key: 'contributions' as TabType, label: '✍️ 我的贡献', count: myContributions.length },
    { key: 'feedback' as TabType, label: '💬 我的反馈', count: myFeedbacks.length },
    { key: 'levels' as TabType, label: '🏆 等级规则', count: 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={onBack} className="text-white/70 hover:text-white transition p-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-sm font-bold">个人中心</h1>
              <p className="text-xs text-blue-200">积分 · 贡献 · 反馈</p>
            </div>
          </div>

          {/* User Card */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
              {currentUser.username.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base font-bold text-white">{currentUser.username}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${LEVEL_CONFIG[currentUser.level].color.replace('text-', 'text-').replace('bg-', 'bg-').replace('border-', 'border-').replace(/-100/, '-200').replace(/-700/, '-600')}`}
                  style={{
                    backgroundColor: currentUser.level === '初阶' ? 'rgba(243,244,246,0.3)' :
                                    currentUser.level === '中阶' ? 'rgba(59,130,246,0.3)' :
                                    currentUser.level === '高阶' ? 'rgba(147,51,234,0.3)' :
                                    'rgba(251,191,36,0.3)',
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.3)',
                  }}>
                  {currentUser.level}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-black text-yellow-300">⭐</span>
                  <span className="text-2xl font-black text-white">{currentUser.points}</span>
                  <span className="text-xs text-white/60">积分</span>
                </div>
                <div className="h-4 w-px bg-white/20" />
                <div className="text-xs text-white/60">
                  加入于 {currentUser.joinDate}
                </div>
              </div>
              {loginBonus && (
                <div className="mt-1.5 inline-flex items-center gap-1 bg-yellow-400/20 border border-yellow-400/30 rounded-full px-2.5 py-0.5">
                  <span className="text-yellow-300 text-xs">✨</span>
                  <span className="text-xs text-yellow-200">每日登录 +5 积分已入账</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: '贡献次数', value: currentUser.contributionsCount, icon: '✍️', color: 'text-blue-600' },
              { label: '纠错采纳', value: currentUser.correctionsCount, icon: '🔧', color: 'text-emerald-600' },
              { label: '等级门槛', value: currentUser.level === '专家' ? '∞' : `${currentUser.points}/${currentUser.level === '初阶' ? 50 : currentUser.level === '中阶' ? 200 : 200}`, icon: '🎯', color: 'text-purple-600' },
            ].map(stat => (
              <div key={stat.label} className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-lg mb-0.5">{stat.icon}</div>
                <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1 py-2">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                  activeTab === t.key
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}>
                {t.label}
                {t.count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${activeTab === t.key ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-4">

          {/* 📜 积分明细 */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              {/* 积分规则速览 */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                <p className="text-xs font-bold text-blue-700 mb-3">📋 积分规则</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { label: '注册即得', value: `+${POINTS_RULES.INITIAL}`, positive: true },
                    { label: '每日登录', value: `+${POINTS_RULES.DAILY_LOGIN}`, positive: true },
                    { label: '文献被采纳', value: `+${POINTS_RULES.CONTRIBUTION_ADOPTED}`, positive: true },
                    { label: '纠错被采纳', value: `+${POINTS_RULES.CORRECTION_ADOPTED}`, positive: true },
                    { label: '补充被采纳', value: `+${POINTS_RULES.ADDITION_ADOPTED}`, positive: true },
                    { label: '浏览词条', value: `${POINTS_RULES.BROWSE_COST}/次`, positive: false },
                    { label: '下载PDF', value: `${POINTS_RULES.DOWNLOAD_COST}/次`, positive: false },
                  ].map(rule => (
                    <div key={rule.label} className="flex items-center justify-between py-1 px-2 bg-white rounded-lg border border-blue-100">
                      <span className="text-gray-600">{rule.label}</span>
                      <span className={`font-bold ${rule.positive ? 'text-emerald-600' : 'text-red-500'}`}>{rule.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {pointsHistory.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-5xl mb-3">📜</p>
                  <p className="text-gray-500 text-sm">暂无积分记录</p>
                  <p className="text-gray-400 text-xs mt-1">浏览词条、下载文献或提交贡献来赚取积分</p>
                </div>
              ) : (
                pointsHistory.map(record => (
                  <div key={record.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      record.amount > 0 ? 'bg-emerald-50' : 'bg-red-50'
                    }`}>
                      <span className="text-lg">{record.amount > 0 ? '💰' : '💸'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{record.reason}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(record.timestamp).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className={`text-sm font-bold flex-shrink-0 ${record.amount > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {record.amount > 0 ? '+' : ''}{record.amount}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ✍️ 我的贡献 */}
          {activeTab === 'contributions' && (
            <div className="space-y-3">
              {/* 提交入口 */}
              <button
                onClick={() => setShowContributionForm(true)}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:from-blue-700 hover:to-indigo-700 transition shadow-sm flex items-center justify-center gap-2"
              >
                <span>✍️</span> 提交新贡献
              </button>

              {/* 状态筛选 */}
              <div className="flex gap-2 flex-wrap">
                {[
                  { key: 'all', label: '全部' },
                  { key: 'pending', label: '审核中' },
                  { key: 'approved', label: '已采纳' },
                  { key: 'rejected', label: '未通过' },
                ].map(f => (
                  <button key={f.key} onClick={() => setFilterStatus(f.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                      filterStatus === f.key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}>
                    {f.label}
                  </button>
                ))}
              </div>

              {filteredContributions.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-5xl mb-3">✍️</p>
                  <p className="text-gray-500 text-sm">暂无贡献记录</p>
                  <p className="text-gray-400 text-xs mt-1">点击上方按钮提交文献、纠错或补充内容</p>
                </div>
              ) : (
                filteredContributions.map(contrib => {
                  const s = statusConfig[contrib.status];
                  let contentPreview = '';
                  try {
                    const parsed = JSON.parse(contrib.content);
                    contentPreview = parsed.title || parsed.errorDescription || parsed.correctContent || contrib.content.slice(0, 50);
                  } catch {
                    contentPreview = contrib.content.slice(0, 50);
                  }
                  return (
                    <div key={contrib.id} className="bg-white rounded-xl border border-gray-200 p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          contrib.type === 'literature' ? 'bg-blue-50 text-blue-600' :
                          contrib.type === 'correction' ? 'bg-red-50 text-red-600' :
                          'bg-emerald-50 text-emerald-600'
                        }`}>
                          <span>{contrib.type === 'literature' ? '📄' : contrib.type === 'correction' ? '🔧' : '➕'}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-sm font-semibold text-gray-800">
                              {contrib.type === 'literature' ? '文献贡献' : contrib.type === 'correction' ? '纠错' : '补充内容'}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.color}`}>
                              {s.label}
                            </span>
                            {contrib.pointsAwarded && (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">
                                +{contrib.pointsAwarded}
                              </span>
                            )}
                          </div>
                          {contrib.targetTitle && (
                            <p className="text-xs text-gray-400 mb-1">→ {contrib.targetTitle}</p>
                          )}
                          <p className="text-xs text-gray-600 line-clamp-2">{contentPreview}</p>
                          <p className="text-xs text-gray-300 mt-1">
                            提交于 {new Date(contrib.submittedAt).toLocaleDateString('zh-CN')}
                            {contrib.reviewedAt && ` · 审核于 ${new Date(contrib.reviewedAt).toLocaleDateString('zh-CN')}`}
                          </p>
                          {contrib.reviewerNote && (
                            <p className="text-xs text-gray-500 mt-1.5 bg-gray-50 rounded-lg px-3 py-2 italic">
                              💬 {contrib.reviewerNote}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* 💬 我的反馈 */}
          {activeTab === 'feedback' && (
            <div className="space-y-3">
              {myFeedbacks.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-5xl mb-3">💬</p>
                  <p className="text-gray-500 text-sm">暂无反馈记录</p>
                  <p className="text-gray-400 text-xs mt-1">在任意词条页面点击右下角反馈按钮</p>
                </div>
              ) : (
                myFeedbacks.map(fb => {
                  const s = statusConfig[fb.status] || { label: fb.status, color: 'text-gray-600', bg: 'bg-gray-50' };
                  const typeLabels: Record<string, string> = {
                    error_report: '错误报告',
                    clarification: '内容澄清',
                    addition: '补充建议',
                  };
                  return (
                    <div key={fb.id} className="bg-white rounded-xl border border-gray-200 p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                          <span>💬</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-sm font-semibold text-gray-800">{typeLabels[fb.type] || fb.type}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.color}`}>
                              {s.label}
                            </span>
                          </div>
                          {fb.targetTitle && fb.targetTitle !== '通用反馈' && (
                            <p className="text-xs text-gray-400 mb-1">→ {fb.targetTitle}</p>
                          )}
                          <p className="text-xs text-gray-600 line-clamp-3">{fb.content}</p>
                          <p className="text-xs text-gray-300 mt-1">
                            提交于 {new Date(fb.submittedAt).toLocaleDateString('zh-CN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* 🏆 等级规则 */}
          {activeTab === 'levels' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-5">
                <p className="text-sm font-bold text-amber-700 mb-1">🏆 贡献者等级体系</p>
                <p className="text-xs text-amber-600">持续贡献可解锁更多权限</p>
              </div>

              {(Object.entries(LEVEL_CONFIG) as [Level, typeof LEVEL_CONFIG['初阶']][]).map(([level, config]) => {
                const isCurrent = currentUser.level === level;
                const isUnlocked = currentUser.points >= config.points || level === '专家';
                return (
                  <div key={level} className={`bg-white rounded-xl border-2 p-5 ${isCurrent ? 'border-blue-400 shadow-md' : 'border-gray-200'}`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                        level === '初阶' ? 'bg-gray-100' :
                        level === '中阶' ? 'bg-blue-100' :
                        level === '高阶' ? 'bg-purple-100' :
                        'bg-amber-100'
                      }`}>
                        {level === '初阶' ? '🌱' : level === '中阶' ? '🔰' : level === '高阶' ? '⭐' : '👑'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-base font-bold text-gray-900">{level}</span>
                          {isCurrent && (
                            <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">当前等级</span>
                          )}
                          {isUnlocked && level !== '专家' && (
                            <span className="text-xs text-emerald-600">✓ 已解锁</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{config.description}</p>
                        {level !== '专家' && (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  level === '初阶' ? 'bg-blue-500' :
                                  level === '中阶' ? 'bg-purple-500' :
                                  'bg-amber-500'
                                }`}
                                style={{ width: `${Math.min(100, (currentUser.points / config.points) * 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 font-medium">
                              {currentUser.points} / {config.points}
                            </span>
                          </div>
                        )}
                        {level === '专家' && (
                          <p className="text-xs text-gray-400 italic">由管理员特邀加入</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* 等级权益对照表 */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-500">等级权益对照</p>
                </div>
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-gray-400">
                      <th className="px-4 py-2 font-medium">等级</th>
                      <th className="px-4 py-2 font-medium">积分门槛</th>
                      <th className="px-4 py-2 font-medium">权限</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { level: '🌱 初阶', points: '0', perms: '浏览 + 下载' },
                      { level: '🔰 中阶', points: '≥ 50', perms: '+ 提交审核 + 参与讨论' },
                      { level: '⭐ 高阶', points: '≥ 200', perms: '+ 加急审核通道' },
                      { level: '👑 专家', points: '管理员邀请', perms: '审核他人贡献' },
                    ].map(row => (
                      <tr key={row.level}>
                        <td className="px-4 py-2.5 font-semibold text-gray-700">{row.level}</td>
                        <td className="px-4 py-2.5 text-gray-500">{row.points}</td>
                        <td className="px-4 py-2.5 text-gray-600">{row.perms}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contribution Form Modal */}
      {showContributionForm && (
        <ContributionForm
          onClose={() => setShowContributionForm(false)}
          onSuccess={(msg) => {
            setShowContributionForm(false);
          }}
        />
      )}

      {/* Floating Feedback Button */}
      <FeedbackButton />
    </div>
  );
}