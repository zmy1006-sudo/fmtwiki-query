import { useState } from 'react';
import AISearchPage from '../AISearchPage';

interface FloatingAIDrawerProps {
  portal: 'doctor' | 'patient';
  /** 控制抽屉是否打开（外部控制模式） */
  open?: boolean;
  /** 外部关闭回调（与 open 配合使用） */
  onOpenChange?: (open: boolean) => void;
}

/**
 * 浮动AI助手按钮 + 侧边抽屉
 * 两种模式：
 * 1. 默认模式：组件内部管理开关状态
 * 2. 受控模式：传入 open + onOpenChange，由父组件控制
 */
export default function FloatingAIDrawer({ portal, open: controlledOpen, onOpenChange }: FloatingAIDrawerProps) {
  const isControlled = controlledOpen !== undefined && onOpenChange !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);

  const isOpen = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled
    ? onOpenChange!
    : (v: boolean) => setInternalOpen(v);

  return (
    <>
      {/* 浮动按钮 — 始终显示 */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 z-50 flex items-center justify-center text-white"
        style={{ boxShadow: '0 4px 20px rgba(16, 185, 129, 0.45)' }}
        aria-label="打开AI助手"
      >
        <span className="text-2xl leading-none select-none">🤖</span>
      </button>

      {/* 侧边抽屉 — 遮罩 + 面板 */}
      {isOpen && (
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
            style={{ height: '100vh', animation: 'slideInRight 0.3s ease-out' }}
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
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm">
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

            {/* AI搜索页面 — 共享全功能 AI 搜索体验 */}
            <div className="flex-1 overflow-y-auto">
              <AISearchPage portal={portal} onBack={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}