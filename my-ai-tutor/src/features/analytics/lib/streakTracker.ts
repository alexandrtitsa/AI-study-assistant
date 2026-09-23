export interface UserProgress {
  streakCount: number;
  lastActiveDate: string | null; // ISO YYYY-MM-DD
  completedCardsCount: number;
}

const STORAGE_KEY = 'ai_tutor_user_progress';

const getTodayDateString = (): string => new Date().toISOString().split('T')[0] ?? '';

export class StreakTracker {
  static getProgress(): UserProgress {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return { streakCount: 0, lastActiveDate: null, completedCardsCount: 0 };
    }
    return JSON.parse(data) as UserProgress;
  }

  static recordActivity(): UserProgress {
    const current = this.getProgress();
    const today = getTodayDateString();

    if (current.lastActiveDate === today) {
      return current;
    }

    let newStreak = current.streakCount;

    if (current.lastActiveDate) {
      const lastDate = new Date(current.lastActiveDate);
      const currentDate = new Date(today);
      const diffInDays = Math.floor(
        (currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffInDays === 1) {
        newStreak += 1;
      } else if (diffInDays > 1) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    const updatedProgress: UserProgress = {
      ...current,
      streakCount: newStreak,
      lastActiveDate: today,
      completedCardsCount: current.completedCardsCount + 1,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProgress));
    return updatedProgress;
  }
}