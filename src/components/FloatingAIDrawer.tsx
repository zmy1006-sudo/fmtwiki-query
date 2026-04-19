import { useState } from 'react';
import { AISearchPanelContent } from '../AISearchPanel';

interface FloatingAIDrawerProps {
  portal: 'doctor' | 'patient';
}

/**
 * 浮动AI助手按钮 + 侧边抽屉
 * 固定定位右下角，点击展开侧边搜索面板
 */
export default function FloatingAIDrawer({ portal }: FloatingAIDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 浮动按钮 */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 z-50 flex items-center justify-center text-white"
        style={{ boxShadow: '0 4px 20px rgba(99, 102, 241, 0.5)' }}
        aria-label="打开AI助手"
      >
        <span className="text-2xl leading-none select-none">🤖</span>
      </button>

      {/* 侧边抽屉 */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
          {/* 背景遮罩 */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* 抽屉面板 — 滑入动画 */}
          <div
            className="relative w-full max-w-md bg-white shadow-2xl flex flex-col overflow-hidden"
            style={{
              height: '100vh',
              animation: 'slideInRight 0.3s ease-out',
            }}
          >
            <style>{`
              @keyframes slideInRight {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
              }
            `}</style>

            {/* 顶部栏 */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm">
                  🤖
                </div>
                <span className="text-sm font-bold text-gray-800">
                  {portal === 'doctor' ? '医生AI助手' : '患者AI助手'}
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-lg transition"
                aria-label="关闭"
              >
                ✕
              </button>
            </div>

            {/* AI搜索面板内容 */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                <AISearchPanelContent portal={portal} onClose={() => setOpen(false)} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
