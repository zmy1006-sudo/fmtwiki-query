import React, { useState } from 'react';
import { usePointsStore } from '../store/pointsStore';
import { diseases } from '../data/diseases';
import { literature } from '../data/literature';

type TabType = 'literature' | 'correction' | 'addition';

interface ContributionFormProps {
  onClose: () => void;
  onSuccess?: (msg: string) => void;
}

// PMID 模拟数据（真实场景会调用 PubMed API）
const mockPMIDLookup: Record<string, {
  title: string;
  authors: string[];
  journal: string;
  year: number;
  abstract: string;
}> = {
  '32929953': {
    title: 'Fecal microbiota transplantation for recurrent Clostridioides difficile infection: A network meta-analysis',
    authors: ['Tariq R', 'Kao D'],
    journal: 'Gut Microbes',
    year: 2021,
    abstract: 'FMT is an effective treatment for rCDI...',
  },
  '34254943': {
    title: 'Randomized controlled trial of encapsulated FMT for ulcerative colitis',
    authors: ['Fehily SR', 'Kumar K'],
    journal: 'Lancet Gastroenterology',
    year: 2021,
    abstract: 'FMT shows promise in treating UC...',
  },
};

export default function ContributionForm({ onClose, onSuccess }: ContributionFormProps) {
  const [activeTab, setActiveTab] = useState<TabType>('literature');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { submitContribution } = usePointsStore();

  // 文献提交
  const [pmid, setPmid] = useState('');
  const [litTitle, setLitTitle] = useState('');
  const [litAuthors, setLitAuthors] = useState('');
  const [litJournal, setLitJournal] = useState('');
  const [litYear, setLitYear] = useState('');
  const [litAbstract, setLitAbstract] = useState('');
  const [pmidLoading, setPmidLoading] = useState(false);
  const [pmidError, setPmidError] = useState('');

  // 纠错/补充
  const [targetType, setTargetType] = useState<'disease' | 'literature'>('disease');
  const [selectedId, setSelectedId] = useState('');
  const [correctionContent, setCorrectionContent] = useState('');
  const [correctContent, setCorrectContent] = useState('');

  // 补充
  const [additionContent, setAdditionContent] = useState('');

  // PMID 自动补全
  async function handlePMIDLookup() {
    const pmidTrim = pmid.trim();
    if (!pmidTrim) { setPmidError('请输入 PMID'); return; }
    
    setPmidLoading(true);
    setPmidError('');
    
    // 模拟 API 延迟
    await new Promise(r => setTimeout(r, 800));
    
    const mockData = mockPMIDLookup[pmidTrim];
    if (mockData) {
      setLitTitle(mockData.title);
      setLitAuthors(mockData.authors.join('; '));
      setLitJournal(mockData.journal);
      setLitYear(String(mockData.year));
      setLitAbstract(mockData.abstract);
    } else {
      setPmidError(`未找到 PMID: ${pmidTrim}（仅支持示例数据）`);
    }
    setPmidLoading(false);
  }

  function handleLiteratureSubmit() {
    if (!litTitle.trim()) { alert('请填写文献标题'); return; }
    setSubmitting(true);
    setTimeout(() => {
      submitContribution({
        userId: 'user_001',
        username: '热心用户',
        type: 'literature',
        content: JSON.stringify({
          pmid: pmid.trim(),
          title: litTitle.trim(),
          authors: litAuthors.trim(),
          journal: litJournal.trim(),
          year: litYear.trim(),
          abstract: litAbstract.trim(),
        }),
      });
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  }

  function handleCorrectionSubmit() {
    if (!selectedId) { alert('请选择要纠错的词条'); return; }
    if (!correctionContent.trim()) { alert('请描述错误内容'); return; }
    if (!correctContent.trim()) { alert('请填写正确内容'); return; }
    setSubmitting(true);
    setTimeout(() => {
      const target = targetType === 'disease'
        ? diseases.find(d => d.id === selectedId)
        : literature.find(l => l.id === selectedId);
      submitContribution({
        userId: 'user_001',
        username: '热心用户',
        type: 'correction',
        content: JSON.stringify({
          errorDescription: correctionContent.trim(),
          correctContent: correctContent.trim(),
        }),
        targetId: selectedId,
        targetTitle: target ? (target as any).name || (target as any).title : selectedId,
      });
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  }

  function handleAdditionSubmit() {
    if (!selectedId) { alert('请选择要补充的词条'); return; }
    if (!additionContent.trim()) { alert('请填写补充内容'); return; }
    setSubmitting(true);
    setTimeout(() => {
      const target = targetType === 'disease'
        ? diseases.find(d => d.id === selectedId)
        : literature.find(l => l.id === selectedId);
      submitContribution({
        userId: 'user_001',
        username: '热心用户',
        type: 'addition',
        content: additionContent.trim(),
        targetId: selectedId,
        targetTitle: target ? (target as any).name || (target as any).title : selectedId,
      });
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-md p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">✅</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">提交成功！</h3>
          <p className="text-sm text-gray-500 mb-6">您的{activeTab === 'literature' ? '文献贡献' : activeTab === 'correction' ? '纠错' : '补充'}已提交审核，审核通过后可得积分奖励。</p>
          <div className="flex gap-3">
            <button onClick={onClose}
              className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition">
              关闭
            </button>
            <button
              onClick={() => { setSubmitted(false); setActiveTab('literature'); }}
              className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition">
              继续提交
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">✍️</span>
            <div>
              <h2 className="text-sm font-bold">贡献内容</h2>
              <p className="text-xs text-blue-200">提交文献 / 纠错 / 补充</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition p-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 flex-shrink-0">
          {([
            { key: 'literature' as TabType, label: '📄 提交文献', color: 'blue' },
            { key: 'correction' as TabType, label: '🔧 纠错', color: 'red' },
            { key: 'addition' as TabType, label: '➕ 补充内容', color: 'emerald' },
          ] as { key: TabType; label: string; color: string }[]).map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`flex-1 py-3 text-xs font-semibold transition border-b-2 ${
                activeTab === t.key
                  ? `border-${t.color}-500 text-${t.color}-600`
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 📄 文献提交 */}
          {activeTab === 'literature' && (
            <div className="space-y-4">
              {/* PMID 输入 */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">PMID 快速导入</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pmid}
                    onChange={e => setPmid(e.target.value)}
                    placeholder="输入 PubMed ID，如 32929953"
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handlePMIDLookup}
                    disabled={pmidLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {pmidLoading ? (
                      <span className="flex items-center gap-1">
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        查询中
                      </span>
                    ) : '🔍 查询'}
                  </button>
                </div>
                {pmidError && <p className="text-xs text-red-500 mt-1">{pmidError}</p>}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-xs text-amber-700">
                  💡 提示：输入 PMID 后点击「查询」可自动填充文献信息，或手动填写下方字段。
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">论文标题 <span className="text-red-500">*</span></label>
                <textarea
                  value={litTitle}
                  onChange={e => setLitTitle(e.target.value)}
                  placeholder="请输入完整论文标题"
                  rows={2}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">作者</label>
                <input
                  type="text"
                  value={litAuthors}
                  onChange={e => setLitAuthors(e.target.value)}
                  placeholder="作者1; 作者2; ..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">期刊</label>
                  <input
                    type="text"
                    value={litJournal}
                    onChange={e => setLitJournal(e.target.value)}
                    placeholder="如 Lancet"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">年份</label>
                  <input
                    type="number"
                    value={litYear}
                    onChange={e => setLitYear(e.target.value)}
                    placeholder="2023"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">摘要</label>
                <textarea
                  value={litAbstract}
                  onChange={e => setLitAbstract(e.target.value)}
                  placeholder="简要描述文献主要内容..."
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <button
                onClick={handleLiteratureSubmit}
                disabled={submitting}
                className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    提交中...
                  </>
                ) : (
                  <>📤 提交文献贡献</>
                )}
              </button>
            </div>
          )}

          {/* 🔧 纠错 */}
          {activeTab === 'correction' && (
            <div className="space-y-4">
              {/* 目标类型 */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">选择纠错对象</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setTargetType('disease'); setSelectedId(''); }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition ${
                      targetType === 'disease'
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}>
                    💊 适应证词条
                  </button>
                  <button
                    onClick={() => { setTargetType('literature'); setSelectedId(''); }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition ${
                      targetType === 'literature'
                        ? 'bg-purple-50 border-purple-300 text-purple-700'
                        : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}>
                    📚 文献词条
                  </button>
                </div>
              </div>

              {/* 词条选择 */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">选择具体词条 <span className="text-red-500">*</span></label>
                <select
                  value={selectedId}
                  onChange={e => setSelectedId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">请选择词条...</option>
                  {(targetType === 'disease' ? diseases : literature).map(item => (
                    <option key={(item as any).id} value={(item as any).id}>
                      {(item as any).name || (item as any).title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">描述错误内容 <span className="text-red-500">*</span></label>
                <textarea
                  value={correctionContent}
                  onChange={e => setCorrectionContent(e.target.value)}
                  placeholder="请详细描述您认为不正确的内容..."
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">正确内容 <span className="text-red-500">*</span></label>
                <textarea
                  value={correctContent}
                  onChange={e => setCorrectContent(e.target.value)}
                  placeholder="请填写正确的补充内容..."
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-xs text-red-700">
                  ⚠️ 请确保纠错信息准确，审核通过后可获得 +10 积分奖励。
                </p>
              </div>

              <button
                onClick={handleCorrectionSubmit}
                disabled={submitting}
                className="w-full py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    提交中...
                  </>
                ) : (
                  <>🔧 提交纠错</>
                )}
              </button>
            </div>
          )}

          {/* ➕ 补充内容 */}
          {activeTab === 'addition' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">选择补充对象</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setTargetType('disease'); setSelectedId(''); }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition ${
                      targetType === 'disease'
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}>
                    💊 适应证词条
                  </button>
                  <button
                    onClick={() => { setTargetType('literature'); setSelectedId(''); }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition ${
                      targetType === 'literature'
                        ? 'bg-purple-50 border-purple-300 text-purple-700'
                        : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}>
                    📚 文献词条
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">选择具体词条 <span className="text-red-500">*</span></label>
                <select
                  value={selectedId}
                  onChange={e => setSelectedId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">请选择词条...</option>
                  {(targetType === 'disease' ? diseases : literature).map(item => (
                    <option key={(item as any).id} value={(item as any).id}>
                      {(item as any).name || (item as any).title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">补充内容 <span className="text-red-500">*</span></label>
                <textarea
                  value={additionContent}
                  onChange={e => setAdditionContent(e.target.value)}
                  placeholder="请填写您希望补充的详细内容..."
                  rows={5}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                <p className="text-xs text-emerald-700">
                  ✨ 请确保补充内容有据可依，审核通过后可获得 +5 积分奖励。
                </p>
              </div>

              <button
                onClick={handleAdditionSubmit}
                disabled={submitting}
                className="w-full py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    提交中...
                  </>
                ) : (
                  <>➕ 提交补充</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}