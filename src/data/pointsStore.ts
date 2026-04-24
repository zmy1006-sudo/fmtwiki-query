// 积分规则常量
export const POINTS_RULES = {
  INITIAL: 100,
  DAILY_LOGIN: 5,
  CONTRIBUTION_ADOPTED: 20,
  CORRECTION_ADOPTED: 10,
  ADDITION_ADOPTED: 5,
  BROWSE_COST: -1,
  DOWNLOAD_COST: -5,
} as const;

// 贡献者等级
export type Level = '初阶' | '中阶' | '高阶' | '专家';

export const LEVEL_THRESHOLDS = {
  '初阶': 0,
  '中阶': 50,
  '高阶': 200,
  '专家': Infinity,
} as const;

export const LEVEL_CONFIG = {
  '初阶': {
    points: 0,
    color: 'bg-gray-100 text-gray-600 border-gray-200',
    description: '浏览 + 下载',
  },
  '中阶': {
    points: 50,
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    description: '+ 提交审核 + 参与讨论',
  },
  '高阶': {
    points: 200,
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    description: '+ 加急审核通道',
  },
  '专家': {
    points: -1, // 管理员邀请
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    description: '审核他人贡献',
  },
} as const;

export interface UserProfile {
  userId: string;
  username: string;
  role: 'reader' | 'contributor' | 'expert';
  points: number;
  level: Level;
  joinDate: string;
  contributionsCount: number;
  correctionsCount: number;
  lastLoginDate?: string;
}

export interface Contribution {
  id: string;
  userId: string;
  username: string;
  type: 'literature' | 'correction' | 'addition';
  content: string;
  targetId?: string;
  targetTitle?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewer?: string;
  reviewerNote?: string;
  pointsAwarded?: number;
}

export interface Feedback {
  id: string;
  userId: string;
  username: string;
  type: 'error_report' | 'clarification' | 'addition';
  targetId: string;
  targetTitle?: string;
  content: string;
  status: 'pending' | 'reviewed' | 'resolved';
  submittedAt: string;
}

export type PointsSource = 'login' | 'browse' | 'download' | 'contribution' | 'correction' | 'addition' | 'initial';

export interface PointsRecord {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  timestamp: string;
  source?: PointsSource;
}

// 获取等级
export function getLevel(points: number): Level {
  if (points >= 200) return '高阶';
  if (points >= 50) return '中阶';
  return '初阶';
}

// 获取等级颜色
export function getLevelColor(level: Level): string {
  return LEVEL_CONFIG[level].color;
}

// Mock 默认用户
export const DEFAULT_USER: UserProfile = {
  userId: 'user_001',
  username: '热心用户',
  role: 'reader',
  points: POINTS_RULES.INITIAL,
  level: getLevel(POINTS_RULES.INITIAL),
  joinDate: new Date().toISOString().split('T')[0],
  contributionsCount: 0,
  correctionsCount: 0,
};

// 生成ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}