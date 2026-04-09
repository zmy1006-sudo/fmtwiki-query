import { useState, useMemo } from 'react';
import { hospitalMap, provinces, type FMTClinic } from './data/hospitalMap';

function ClinicCard({ clinic }: { clinic: FMTClinic }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-indigo-300 hover:shadow-md transition">
      {/* Card Header */}
      <button
        className="w-full text-left p-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-3">
          {/* Hospital Icon */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            clinic.insuranceReimburse ? 'bg-emerald-50' : 'bg-blue-50'
          }`}>
            <span className={`text-lg ${clinic.insuranceReimburse ? '' : ''}`}>🏥</span>
          </div>

          {/* Main Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-sm font-bold text-gray-900">{clinic.name}</h3>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">{clinic.city}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Fee tag */}
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                clinic.insuranceReimburse
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {clinic.insuranceReimburse ? '💚 可医保' : '💙 自费'}
              </span>
              {/* Fee range */}
              <span className="text-xs text-gray-500">{clinic.feeRange}</span>
            </div>
            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-2">
              {clinic.tags.slice(0, 3).map(tag => (
                <span key={tag} className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded text-xs">{tag}</span>
              ))}
            </div>
          </div>

          {/* Expand Icon */}
          <svg
            className={`w-4 h-4 text-gray-400 flex-shrink-0 mt-1 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-2">
          {/* Address */}
          <div className="flex gap-2">
            <span className="text-xs font-bold text-gray-400 w-12 flex-shrink-0 pt-0.5">地址</span>
            <span className="text-xs text-gray-600 leading-relaxed">{clinic.address}</span>
          </div>
          {/* Phone */}
          <div className="flex gap-2">
            <span className="text-xs font-bold text-gray-400 w-12 flex-shrink-0 pt-0.5">电话</span>
            <a href={`tel:${clinic.phone}`} className="text-xs text-blue-600 hover:underline">{clinic.phone}</a>
          </div>
          {/* Department */}
          <div className="flex gap-2">
            <span className="text-xs font-bold text-gray-400 w-12 flex-shrink-0 pt-0.5">科室</span>
            <span className="text-xs text-gray-600">{clinic.department}</span>
          </div>
          {/* Opening Hours */}
          <div className="flex gap-2">
            <span className="text-xs font-bold text-gray-400 w-12 flex-shrink-0 pt-0.5">出诊</span>
            <span className="text-xs text-gray-600">{clinic.openingHours}</span>
          </div>
          {/* Insurance Note */}
          <div className="bg-gray-50 rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`w-1.5 h-1.5 rounded-full ${clinic.insuranceReimburse ? 'bg-green-500' : 'bg-blue-500'}`} />
              <span className="text-xs font-semibold text-gray-600">
                {clinic.insuranceReimburse ? '医保可报销' : '自费项目'}
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">{clinic.insuranceNote}</p>
          </div>
          {/* Features */}
          <div className="flex gap-2">
            <span className="text-xs font-bold text-gray-400 w-12 flex-shrink-0 pt-0.5">特色</span>
            <div className="flex flex-wrap gap-1">
              {clinic.hasPediatric && (
                <span className="px-2 py-0.5 bg-pink-50 text-pink-600 rounded-full text-xs">🏥 儿科FMT</span>
              )}
              {clinic.hasCapsule && (
                <span className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full text-xs">💊 胶囊FMT</span>
              )}
            </div>
          </div>
          {/* Website */}
          {clinic.website && (
            <a href={clinic.website} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-full text-xs text-indigo-700 hover:bg-indigo-100 transition">
              访问官网
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function HospitalMapPanel() {
  const [query, setQuery] = useState('');
  const [activeProvince, setActiveProvince] = useState<string>('全部');

  const filteredHospitals = useMemo(() => {
    let result = hospitalMap;
    if (activeProvince !== '全部') {
      result = result.filter(h => h.province === activeProvince);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(h =>
        h.name.includes(q) ||
        h.city.includes(q) ||
        h.tags.some(t => t.toLowerCase().includes(q)) ||
        h.department.includes(q)
      );
    }
    return result;
  }, [query, activeProvince]);

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="搜索城市、医院名、科室、特色标签..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        />
      </div>

      {/* Province Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveProvince('全部')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition whitespace-nowrap ${
            activeProvince === '全部'
              ? 'bg-indigo-500 text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300'
          }`}
        >
          全部省份
        </button>
        {provinces.map(province => (
          <button
            key={province}
            onClick={() => setActiveProvince(province)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition whitespace-nowrap ${
              activeProvince === province
                ? 'bg-indigo-500 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300'
            }`}
          >
            {province}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <p className="text-xs text-gray-400">
        {filteredHospitals.length} 家医院
        {query && `（搜索："${query}"）`}
        {activeProvince !== '全部' && ` · ${activeProvince}`}
      </p>

      {/* Clinic Cards */}
      {filteredHospitals.length > 0 ? (
        <div className="space-y-2">
          {filteredHospitals.map(clinic => (
            <ClinicCard key={clinic.id} clinic={clinic} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-gray-500 text-sm">未找到符合条件的医院</p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 leading-relaxed">
        💡 信息由FMTWiki整理自各医院官网和公开资料，<strong>仅供参考</strong>。
        费用、医保政策、出诊时间可能随时变动，建议就诊前<strong>电话确认</strong>。
        如有错误，欢迎反馈更正。
      </div>
    </div>
  );
}
