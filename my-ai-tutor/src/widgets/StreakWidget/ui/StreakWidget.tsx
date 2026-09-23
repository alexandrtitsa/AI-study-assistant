import type { FC } from 'react';
import type { UserProgress } from '@/features/analytics/lib/streakTracker';
import styles from './StreakWidget.module.scss';

interface StreakWidgetProps {
  progress: UserProgress;
}

export const StreakWidget: FC<StreakWidgetProps> = ({ progress }) => {
  const { streakCount, completedCardsCount } = progress;

  return (
    <div className={styles.widgetContainer} aria-label="Статистика активності">
      <div className={styles.statCard}>
        <span className={styles.statIcon} role="img" aria-label="Вогонь">
          🔥
        </span>
        <div>
          <div className={styles.statValue}>{streakCount}</div>
          <div className={styles.statLabel}>Днів поспіль</div>
        </div>
      </div>

      <div className={styles.divider} role="separator" />

      <div className={styles.statCard}>
        <span className={styles.statIcon} role="img" aria-label="Картки">
          🧠
        </span>
        <div>
          <div className={styles.statValue}>{completedCardsCount}</div>
          <div className={styles.statLabel}>Вивчено карток</div>
        </div>
      </div>
    </div>
  );
};