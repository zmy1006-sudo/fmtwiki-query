import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, Contribution, Feedback, PointsRecord, PointsSource, Level } from '../data/pointsStore';
import { POINTS_RULES, DEFAULT_USER, generateId, getLevel } from '../data/pointsStore';

interface PointsState {
  // 当前用户
  currentUser: UserProfile;
  // 所有贡献记录
  contributions: Contribution[];
  // 所有反馈记录
  feedbacks: Feedback[];
  // 积分历史
  pointsHistory: PointsRecord[];
  // 所有用户（管理用）
  users: UserProfile[];

  // 积分操作
  addPoints: (userId: string, amount: number, reason: string, source?: PointsRecord['source']) => void;
  deductPoints: (userId: string, amount: number, reason: string, source?: PointsRecord['source']) => void;
  
  // 每日登录积分
  recordDailyLogin: (userId: string) => boolean; // 返回是否已领取

  // 浏览词条扣积分
  browseEntry: (userId: string, entryTitle: string) => void;

  // 下载PDF扣积分
  downloadPDF: (userId: string, docTitle: string) => void;

  // 提交贡献
  submitContribution: (contribution: Omit<Contribution, 'id' | 'status' | 'submittedAt' | 'pointsAwarded'>) => string;

  // 审核贡献
  reviewContribution: (contributionId: string, status: 'approved' | 'rejected', reviewerId: string, reviewerNote?: string) => void;

  // 提交反馈
  submitFeedback: (feedback: Omit<Feedback, 'id' | 'status' | 'submittedAt'>) => string;

  // 获取用户贡献列表
  getUserContributions: (userId: string) => Contribution[];
  getUserFeedbacks: (userId: string) => Feedback[];
  getUserPointsHistory: (userId: string) => PointsRecord[];

  // 更新用户名
  updateUsername: (userId: string, newName: string) => void;

  // 重置用户（测试用）
  resetUser: () => void;
}

export const usePointsStore = create<PointsState>()(
  persist(
    (set, get) => ({
      currentUser: { ...DEFAULT_USER },
      contributions: [],
      feedbacks: [],
      pointsHistory: [],
      users: [{ ...DEFAULT_USER }],

      addPoints: (userId: string, amount: number, reason: string, source: PointsSource = 'contribution') => {
        const user = get().currentUser;
        if (user.userId !== userId) return;

        const newPoints = Math.max(0, user.points + amount);
        const newLevel = getLevel(newPoints);

        // 添加积分记录
        const record: PointsRecord = {
          id: generateId(),
          userId,
          amount,
          reason,
          timestamp: new Date().toISOString(),
          source,
        };

        set(state => ({
          currentUser: {
            ...state.currentUser,
            points: newPoints,
            level: newLevel,
          },
          pointsHistory: [record, ...state.pointsHistory],
          users: state.users.map(u =>
            u.userId === userId ? { ...u, points: newPoints, level: newLevel } : u
          ),
        }));
      },

      deductPoints: (userId: string, amount: number, reason: string, source: PointsSource = 'download') => {
        const user = get().currentUser;
        if (user.userId !== userId) return;

        const newPoints = Math.max(0, user.points - Math.abs(amount));
        const newLevel = getLevel(newPoints);

        const record: PointsRecord = {
          id: generateId(),
          userId,
          amount: -Math.abs(amount),
          reason,
          timestamp: new Date().toISOString(),
          source,
        };

        set(state => ({
          currentUser: {
            ...state.currentUser,
            points: newPoints,
            level: newLevel,
          },
          pointsHistory: [record, ...state.pointsHistory],
          users: state.users.map(u =>
            u.userId === userId ? { ...u, points: newPoints, level: newLevel } : u
          ),
        }));
      },

      recordDailyLogin: (userId) => {
        const user = get().currentUser;
        if (user.userId !== userId) return false;

        const today = new Date().toISOString().split('T')[0];
        if (user.lastLoginDate === today) return false; // 已领取

        // 领取每日积分
        const record: PointsRecord = {
          id: generateId(),
          userId,
          amount: POINTS_RULES.DAILY_LOGIN,
          reason: '每日登录奖励',
          timestamp: new Date().toISOString(),
          source: 'login',
        };

        const newPoints = user.points + POINTS_RULES.DAILY_LOGIN;
        const newLevel = getLevel(newPoints);

        set(state => ({
          currentUser: {
            ...state.currentUser,
            points: newPoints,
            level: newLevel,
            lastLoginDate: today,
          },
          pointsHistory: [record, ...state.pointsHistory],
          users: state.users.map(u =>
            u.userId === userId ? { ...u, points: newPoints, level: newLevel, lastLoginDate: today } : u
          ),
        }));

        return true;
      },

      browseEntry: (userId, entryTitle) => {
        get().deductPoints(userId, Math.abs(POINTS_RULES.BROWSE_COST), `浏览词条：${entryTitle}`, 'browse');
      },

      downloadPDF: (userId, docTitle) => {
        get().deductPoints(userId, Math.abs(POINTS_RULES.DOWNLOAD_COST), `下载文献：${docTitle}`, 'download');
      },

      submitContribution: (contribution) => {
        const id = generateId();
        const newContribution: Contribution = {
          ...contribution,
          id,
          status: 'pending',
          submittedAt: new Date().toISOString(),
        };

        // 增加贡献计数
        set(state => ({
          contributions: [newContribution, ...state.contributions],
          currentUser: {
            ...state.currentUser,
            contributionsCount: state.currentUser.contributionsCount + 1,
          },
        }));

        return id;
      },

      reviewContribution: (contributionId, status, reviewerId, reviewerNote) => {
        const now = new Date().toISOString();
        let pointsAwarded = 0;

        set(state => {
          const contribution = state.contributions.find(c => c.id === contributionId);
          if (!contribution) return state;

          if (status === 'approved') {
            if (contribution.type === 'literature') pointsAwarded = POINTS_RULES.CONTRIBUTION_ADOPTED;
            else if (contribution.type === 'correction') pointsAwarded = POINTS_RULES.CORRECTION_ADOPTED;
            else if (contribution.type === 'addition') pointsAwarded = POINTS_RULES.ADDITION_ADOPTED;
          }

          const userId = contribution.userId;
          const newPoints = contribution.userId === state.currentUser.userId
            ? state.currentUser.points + pointsAwarded
            : state.currentUser.points;

          const newLevel = getLevel(newPoints);

          return {
            contributions: state.contributions.map(c =>
              c.id === contributionId
                ? { ...c, status, reviewedAt: now, reviewer: reviewerId, reviewerNote, pointsAwarded: status === 'approved' ? pointsAwarded : undefined }
                : c
            ),
            currentUser: contribution.userId === state.currentUser.userId
              ? {
                  ...state.currentUser,
                  points: newPoints,
                  level: newLevel,
                  contributionsCount: status === 'approved' ? state.currentUser.contributionsCount + 1 : state.currentUser.contributionsCount,
                }
              : state.currentUser,
          };
        });

        // 如果被采纳，给用户加分
        if (status === 'approved' && pointsAwarded > 0) {
          const contribution = get().contributions.find(c => c.id === contributionId);
          if (contribution) {
            const reason = contribution.type === 'literature' ? '文献贡献被采纳' :
                           contribution.type === 'correction' ? '纠错被采纳' : '补充内容被采纳';
            
            const record: PointsRecord = {
              id: generateId(),
              userId: contribution.userId,
              amount: pointsAwarded,
              reason,
              timestamp: now,
              source: contribution.type === 'literature' ? 'contribution' :
                      contribution.type === 'correction' ? 'correction' : 'addition',
            };

            set(state => ({
              pointsHistory: [record, ...state.pointsHistory],
              users: state.users.map(u =>
                u.userId === contribution.userId
                  ? { ...u, points: u.points + pointsAwarded }
                  : u
              ),
            }));
          }
        }
      },

      submitFeedback: (feedback) => {
        const id = generateId();
        const newFeedback: Feedback = {
          ...feedback,
          id,
          status: 'pending',
          submittedAt: new Date().toISOString(),
        };

        set(state => ({
          feedbacks: [newFeedback, ...state.feedbacks],
        }));

        return id;
      },

      getUserContributions: (userId) => {
        return get().contributions.filter(c => c.userId === userId);
      },

      getUserFeedbacks: (userId) => {
        return get().feedbacks.filter(f => f.userId === userId);
      },

      getUserPointsHistory: (userId) => {
        return get().pointsHistory.filter(r => r.userId === userId);
      },

      updateUsername: (userId, newName) => {
        set(state => ({
          currentUser: state.currentUser.userId === userId
            ? { ...state.currentUser, username: newName }
            : state.currentUser,
          users: state.users.map(u =>
            u.userId === userId ? { ...u, username: newName } : u
          ),
        }));
      },

      resetUser: () => {
        set({
          currentUser: { ...DEFAULT_USER },
          contributions: [],
          feedbacks: [],
          pointsHistory: [],
          users: [{ ...DEFAULT_USER }],
        });
      },
    }),
    {
      name: 'fmtwiki-points',
    }
  )
);