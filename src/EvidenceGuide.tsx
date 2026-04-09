import { useState } from 'react';

interface EvidenceGuideProps {
  onBack?: () => void;
  inline?: boolean; // true=内嵌卡片模式，false=独立页面
}

export function EvidenceGuide({ onBack, inline = false }: EvidenceGuideProps) {
  const [activeTab, setActiveTab] = useState<'oxford' | 'grade' | 'combination'>('oxford');

  const Content = () => (
    <div className="space-y-6">
      {/* 两栏总览 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="text-xs font-bold text-blue-700 mb-1">研究设计分级</div>
          <div className="text-lg font-bold text-blue-900">Oxford CEBM</div>
          <div className="text-xs text-blue-600 mt-1">回答：这个研究怎么做出来的？</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="text-xs font-bold text-green-700 mb-1">结论质量信心</div>
          <div className="text-lg font-bold text-green-900">GRADE</div>
          <div className="text-xs text-green-600 mt-1">回答：我对这个结论有多大信心？</div>
        </div>
      </div>

      {/* Tab切换 */}
      <div className="flex gap-2">
        {(['oxford', 'grade', 'combination'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
            {tab === 'oxford' ? 'Oxford分级' : tab === 'grade' ? 'GRADE分级' : '组合逻辑'}
          </button>
        ))}
      </div>

      {/* Oxford分级 */}
      {activeTab === 'oxford' && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600 leading-relaxed">
            <strong>Oxford Centre for Evidence-Based Medicine（CEBM）</strong>分级，根据研究设计类型回答"这个结论有多强？"。
          </p>
          <div className="space-y-2">
            {[
              { level: '1a', desc: 'RCT 系统综述', color: 'bg-green-100 text-green-700', eg: '多项FMT-RCDI的Meta分析' },
              { level: '1b', desc: '单项随机对照试验（RCT）', color: 'bg-green-100 text-green-700', eg: 'van Nood NEJM 2013 (PMID 23323867)' },
              { level: '2b', desc: '队列研究 / Pilot RCT', color: 'bg-blue-100 text-blue-700', eg: 'Sokol Microbiome 2020 pilot RCT n=17' },
              { level: '3b', desc: '病例对照研究', color: 'bg-amber-100 text-amber-700', eg: 'FMT治疗某疾病回顾性对照' },
              { level: '4', desc: '病例系列 / 专家意见', color: 'bg-orange-100 text-orange-700', eg: 'Kang Microbiome 2017 开放试验 n=18' },
              { level: '5', desc: '机制推理 / 动物实验', color: 'bg-red-100 text-red-700', eg: 'Sampson Cell 2016 小鼠PD模型' },
            ].map(item => (
              <div key={item.level} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                <span className={`px-2 py-1 rounded text-xs font-bold flex-shrink-0 ${item.color}`}>{item.level}</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.desc}</p>
                  <p className="text-xs text-gray-400 mt-0.5">例如：{item.eg}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GRADE分级 */}
      {activeTab === 'grade' && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600 leading-relaxed">
            <strong>GRADE系统</strong>（Grading of Recommendations Assessment, Development and Evaluation）评估"对结论有多大信心"，综合研究质量和一致性。
          </p>
          <div className="space-y-2">
            {[
              { grade: 'A', color: 'bg-green-100 text-green-700 border-green-300',
                label: '高', confidence: '非常确信真实效应接近估计效应',
                example: 'rCDI FMT（A级推荐）：van Nood NEJM 2013，治愈率81%，高质量RCT支持' },
              { grade: 'B', color: 'bg-blue-100 text-blue-700 border-blue-300',
                label: '中', confidence: '真实效应可能接近估计效应，但有可能不同',
                example: 'UC FMT（B级推荐）：Paramsothy Lancet 2017，多供体RCT，样本量适中' },
              { grade: 'C', color: 'bg-amber-100 text-amber-700 border-amber-300',
                label: '低', confidence: '真实效应可能与估计效应有显著差别',
                example: '帕金森/NAFLD等探索性适应证：小型试验，结论不确定性大' },
              { grade: 'D', color: 'bg-red-100 text-red-700 border-red-300',
                label: '极低', confidence: '结论非常不确定，几乎没有直接证据',
                example: '超适应证FMT，个案报告或专家意见，尚无系统研究' },
            ].map(item => (
              <div key={item.grade} className={`flex items-start gap-3 p-3 bg-white rounded-lg border ${item.color}`}>
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 bg-white border ${item.color}`}>{item.grade}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-800">{item.label}</span>
                    <span className="text-xs text-gray-400">— {item.confidence}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">典型案例：{item.example}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 组合逻辑 */}
      {activeTab === 'combination' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            FMTWiki 采用 <strong>Oxford + GRADE 双标签系统</strong>：Oxford 描述研究设计，GRADE 描述综合质量信心。两者维度不同，组合使用。
          </p>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="grid grid-cols-4 gap-0 text-xs font-bold bg-gray-50 p-3">
              <div className="col-span-2">场景</div>
              <div>Oxford</div>
              <div>GRADE</div>
            </div>
            {[
              { disease: 'rCDI（复发性艰难梭菌）', oxford: '1b', oxfordColor: 'bg-green-100 text-green-700', grade: 'A', gradeColor: 'bg-green-100 text-green-700', reason: '高质量多中心RCT' },
              { disease: 'UC（溃疡性结肠炎）', oxford: '1b', oxfordColor: 'bg-green-100 text-green-700', grade: 'B', gradeColor: 'bg-blue-100 text-blue-700', reason: 'RCT但样本量有限' },
              { disease: 'CD（克罗恩病）', oxford: '2b', oxfordColor: 'bg-blue-100 text-blue-700', grade: 'C', gradeColor: 'bg-amber-100 text-amber-700', reason: 'Pilot RCT，质量偏低' },
              { disease: 'ASD（自闭症）', oxford: '4', oxfordColor: 'bg-orange-100 text-orange-700', grade: 'C', gradeColor: 'bg-amber-100 text-amber-700', reason: '开放试验，无对照' },
              { disease: '帕金森病', oxford: '5', oxfordColor: 'bg-red-100 text-red-700', grade: 'D', gradeColor: 'bg-red-100 text-red-700', reason: '临床前动物研究，不可外推人类' },
              { disease: '超适应证FMT', oxford: '5', oxfordColor: 'bg-red-100 text-red-700', grade: 'D', gradeColor: 'bg-red-100 text-red-700', reason: '个案报告，无系统证据' },
            ].map(row => (
              <div key={row.disease} className="grid grid-cols-4 gap-0 p-3 border-t border-gray-100 text-xs">
                <div className="col-span-2 text-gray-700 font-medium">{row.disease}</div>
                <div><span className={`px-1.5 py-0.5 rounded text-xs font-bold ${row.oxfordColor}`}>{row.oxford}</span></div>
                <div><span className={`px-1.5 py-0.5 rounded text-xs font-bold ${row.gradeColor}`}>{row.grade}</span></div>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs font-bold text-amber-700 mb-1">💡 降级因素（可能导致高研究设计级别→低GRADE）</p>
            <ul className="text-xs text-amber-800 space-y-1">
              <li>• 偏倚风险高（无盲法、选择性报告）</li>
              <li>• 样本量小（pilot RCT通常n&lt;30）</li>
              <li>• 结果不一致（多项研究结论矛盾）</li>
              <li>• 间接性（替代终点，非硬终点）</li>
              <li>• 发表偏倚（阴性结果未发表）</li>
            </ul>
          </div>
        </div>
      )}

      {/* 底部免责 */}
      <div className="bg-gray-100 rounded-xl p-3 text-xs text-gray-400 leading-relaxed">
        <strong>说明：</strong>证据等级是帮助临床决策的工具，不是绝对判断。具体患者是否适合FMT，需结合病情、合并症、患者意愿和当地资源综合评估。本知识库参考 Oxford CEBM 2011版 及 GRADE Working Group 标准。
      </div>
    </div>
  );

  if (inline) return <Content />;

  // 独立页面
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={onBack} className="text-white/70 hover:text-white">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold">📊 证据等级说明</h1>
            <p className="text-xs text-white/60">Oxford + GRADE 双标签系统解读</p>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-5">
        <Content />
      </div>
    </div>
  );
}
