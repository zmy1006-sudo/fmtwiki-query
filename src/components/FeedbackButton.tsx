import React, { useState } from 'react';
import { usePointsStore } from '../store/pointsStore';
import { diseases } from '../data/diseases';
import { literature } from '../data/literature';

type FeedbackType = 'error_report' | 'clarification' | 'addition';

interface FeedbackButtonProps {
  targetId?: string;
  targetTitle?: string;
}

export default function FeedbackButton({ targetId, targetTitle }: FeedbackButtonProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { submitFeedback } = usePointsStore();

  const [feedbackType, setFeedbackType] = useState<FeedbackType>('error_report');
  const [content, setContent] = useState('');
  const [selectedTargetId, setSelectedTargetId] = useState(targetId || '');
  const [selectedTargetTitle, setSelectedTargetTitle] = useState(targetTitle || '');

  const feedbackTypes: { key: FeedbackType; label: string; icon: string; color: string; desc: string }[] = [
    { key: 'error_report', label: '错误报告', icon: '❌', color: 'red', desc: '发现内容有误' },
    { key: 'clarification', label: '内容澄清', icon: '❓', color: 'blue', desc: '描述不清楚' },
    { key: 'addition', label: '补充建议', icon: '💡', color: 'emerald', desc: '补充完善内容' },
  ];

  function handleSubmit() {
    if (!content.trim()) { alert('请填写反馈内容'); return; }
    setSubmitting(true);
    setTimeout(() => {
      submitFeedback({
        userId: 'user_001',
        username: '热心用户',
        type: feedbackType,
        targetId: selectedTargetId || 'general',
        targetTitle: selectedTargetTitle || '通用反馈',
        content: content.trim(),
      });
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  }

  function resetForm() {
    setContent('');
    setSubmitted(false);
    setOpen(false);
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
        title="反馈问题"
      >
        <span className="text-xl group-hover:scale-110 transition-transform">💬</span>
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-20" />
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            {submitted ? (
              /* Success State */
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">✅</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">反馈已提交！</h3>
                <p className="text-sm text-gray-500 mb-6">感谢您的反馈，我们会尽快处理。</p>
                <button
                  onClick={resetForm}
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition"
                >
                  关闭
                </button>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💬</span>
                    <div>
                      <h2 className="text-sm font-bold">问题反馈</h2>
                      <p className="text-xs text-blue-200">帮助我们改进内容质量</p>
                    </div>
                  </div>
                  <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition p-1">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Body */}
                <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
                  {/* 反馈类型 */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">反馈类型</label>
                    <div className="grid grid-cols-3 gap-2">
                      {feedbackTypes.map(ft => (
                        <button
                          key={ft.key}
                          onClick={() => setFeedbackType(ft.key)}
                          className={`py-2.5 rounded-xl text-xs font-medium border transition flex flex-col items-center gap-1 ${
                            feedbackType === ft.key
                              ? `bg-${ft.color}-50 border-${ft.color}-300 text-${ft.color}-700`
                              : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
                          }`}
                        >
                          <span className="text-lg">{ft.icon}</span>
                          <span>{ft.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 目标词条（可选） */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                      针对词条 <span className="text-gray-300 font-normal">(可选)</span>
                    </label>
                    <select
                      value={selectedTargetId}
                      onChange={e => {
                        setSelectedTargetId(e.target.value);
                        const d = diseases.find(x => x.id === e.target.value);
                        const l = literature.find(x => x.id === e.target.value);
                        setSelectedTargetTitle(d ? (d as any).name : l ? (l as any).title : '');
                      }}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">不指定词条</option>
                      <optgroup label="💊 适应证">
                        {diseases.map(d => (
                          <option key={d.id} value={d.id}>{(d as any).name}</option>
                        ))}
                      </optgroup>
                      <optgroup label="📚 文献">
                        {literature.map(l => (
                          <option key={l.id} value={l.id}>{(l as any).title?.slice(0, 40)}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  {/* 反馈内容 */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      反馈内容 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={content}
                      onChange={e => setContent(e.target.value)}
                      placeholder={
                        feedbackType === 'error_report' ? '请描述具体错误内容...' :
                        feedbackType === 'clarification' ? '请描述哪些地方描述不清楚...' :
                        '请描述您希望补充的内容...'
                      }
                      rows={4}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        提交中...
                      </>
                    ) : (
                      <>📤 提交反馈</>
                    )}
                  </button>

                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                    <p className="text-xs text-gray-400 leading-relaxed">
                      💡 反馈会被记录并优先处理，感谢您帮助我们改进内容质量！
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}