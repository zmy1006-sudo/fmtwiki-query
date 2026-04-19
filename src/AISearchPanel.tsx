/**
 * AISearchPanel — 全屏AI搜索面板
 * 支持 onClose (FloatingAIDrawer) 和 onBack (App.tsx) 两种关闭回调
 */
import AISearchPage from './AISearchPage';

export function AISearchPanel({
  portal,
  onBack,
  onClose,
}: {
  portal: 'doctor' | 'patient';
  onBack?: () => void;
  onClose?: () => void;
  onResultClick?: (record: any) => void;
}) {
  return <AISearchPage portal={portal} onBack={onBack || onClose || (() => {})} />;
}

export const AISearchPanelContent = AISearchPanel;
export default AISearchPanel;
