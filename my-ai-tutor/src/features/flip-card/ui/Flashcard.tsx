import type { FC } from "react";
import cn from "classnames";
import { useStudyStore } from "@/entities/study/model/useStudyStore";
import styles from "./Flashcard.module.scss";

export const Flashcard: FC = () => {
  const {
    flashcards,
    currentCardIndex,
    isFlipped,
    toggleFlip,
    nextCard,
    prevCard,
  } = useStudyStore();
  const currentCard = flashcards[currentCardIndex];

  if (!currentCard) return null;

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.cardContainer}
        onClick={toggleFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleFlip();
          }
        }}
        aria-label="Флеш-картка. Натисніть для перевертання"
      >
        <div className={cn(styles.card, isFlipped && styles.isFlipped)}>
          <div className={styles.cardFace}>
            <p>
              {currentCard.question ||
                (currentCard as unknown as { front: string }).front}
            </p>
          </div>
          <div className={cn(styles.cardFace, styles.cardFaceBack)}>
            <p>
              {currentCard.answer ||
                (currentCard as unknown as { back: string }).back}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <button
          onClick={prevCard}
          disabled={currentCardIndex === 0}
          type="button"
        >
          Назад
        </button>
        <span>
          {currentCardIndex + 1} / {flashcards.length}
        </span>
        <button
          onClick={nextCard}
          disabled={currentCardIndex === flashcards.length - 1}
          type="button"
        >
          Вперед
        </button>
      </div>
    </div>
  );
};
