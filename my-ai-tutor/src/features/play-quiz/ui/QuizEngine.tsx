import type { FC } from "react";
import { useState } from "react";
import cn from "classnames";
import { useStudyStore } from "@/entities/study/model/useStudyStore";
import type { QuizQuestionSchema } from "@/shared/types";
import styles from "./QuizEngine.module.scss";

interface QuizEngineProps {
  questions?: QuizQuestionSchema[];
}

export const QuizEngine: FC<QuizEngineProps> = ({ questions: questionsProp }) => {
  const storeQuiz = useStudyStore((state) => state.quiz);
  
  const quiz = questionsProp ?? storeQuiz;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  // 1. Перевірка на порожній масив
  if (!quiz || quiz.length === 0) {
    return <div className={styles.empty}>Квіз порожній або не завантажений</div>;
  }

  // 2. Перевірка на завершення
  const isCompleted = currentIndex >= quiz.length;

  if (isCompleted) {
    return (
      <div className={styles.resultContainer}>
        <h2>Квіз завершено!</h2>
        <p>
          Ваш результат: <strong>{score}</strong> з {quiz.length}
        </p>
      </div>
    );
  }

  // 3. Гарантуємо, що currentQuestion існує
  const currentQuestion = quiz[currentIndex];

  if (!currentQuestion) {
    return null;
  }

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentQuestion.correctAnswerIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentIndex((prev) => prev + 1);
  };

  // Безпечне вилучення CSS-класів для уникнення undefined в ключах об'єкта
  const correctClass = styles.correct ?? "correct";
  const wrongClass = styles.wrong ?? "wrong";

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span>
          Питання {currentIndex + 1} з {quiz.length}
        </span>
      </div>

      <h3 className={styles.question}>{currentQuestion.question}</h3>

      <div className={styles.optionsGrid}>
        {currentQuestion.options.map((option, idx) => {
          const isCorrect = idx === currentQuestion.correctAnswerIndex;
          const isSelected = idx === selectedOption;

          return (
            <button
              key={idx}
              type="button"
              disabled={isAnswered}
              onClick={() => handleSelectOption(idx)}
              className={cn(styles.optionButton, {
                [correctClass]: isAnswered && isCorrect,
                [wrongClass]: isAnswered && isSelected && !isCorrect,
              })}
            >
              {option}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className={styles.explanation}>
          <p>{currentQuestion.explanation}</p>
          <button type="button" onClick={handleNext} className={styles.nextButton}>
            {currentIndex + 1 === quiz.length ? "Завершити" : "Наступне питання"}
          </button>
        </div>
      )}
    </div>
  );
};