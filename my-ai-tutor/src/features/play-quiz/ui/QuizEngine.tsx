import { useState, type FC } from 'react';
import cn from 'classnames';
import type { QuizQuestionSchema } from '@/shared/types/ai';
import styles from './QuizEngine.module.scss';

interface QuizEngineProps {
  questions: QuizQuestionSchema[];
}

export const QuizEngine: FC<QuizEngineProps> = ({ questions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentQuestion = questions[currentIndex];

  if (!currentQuestion) return null;

  const handleSelectOption = (index: number) => {
    if (isSubmitted) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null || isSubmitted) return;
    
    if (selectedAnswer === currentQuestion.correctAnswerIndex) {
      setScore((prev) => prev + 1);
    }
    setIsSubmitted(true);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <section className={styles.quizWrapper} aria-labelledby="quiz-heading">
      <h2 id="quiz-heading" className={styles.title}>
        Питання {currentIndex + 1} з {questions.length}
      </h2>

      {/* ARIA live region сповіщає скрінрідер про стан відповіді */}
      <div className={styles.ariaFeedback} aria-live="polite" aria-atomic="true">
        {isSubmitted && (
          <span>
            {selectedAnswer === currentQuestion.correctAnswerIndex
              ? 'Правильна відповідь!'
              : `Неправильно. ${currentQuestion.explanation}`}
          </span>
        )}
      </div>

      <p className={styles.questionText}>{currentQuestion.question}</p>

      <fieldset className={styles.optionsList}>
        <legend className={styles.srOnly}>Оберіть один з варіантів відповіді:</legend>
        {currentQuestion.options.map((option, index) => {
          const isCorrect = index === currentQuestion.correctAnswerIndex;
          const isSelected = index === selectedAnswer;

          return (
            <label
              key={option}
              className={cn(styles.optionCard, {
                [styles.isSelected]: isSelected,
                [styles.isCorrect]: isSubmitted && isCorrect,
                [styles.isWrong]: isSubmitted && isSelected && !isCorrect,
              })}
            >
              <input
                type="radio"
                name="quiz-option"
                checked={isSelected}
                disabled={isSubmitted}
                onChange={() => handleSelectOption(index)}
                className={styles.radioInput}
              />
              <span>{option}</span>
            </label>
          );
        })}
      </fieldset>

      <div className={styles.controls}>
        {!isSubmitted ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className={styles.submitBtn}
          >
            Відповісти
          </button>
        ) : (
          <button type="button" onClick={handleNext} className={styles.nextBtn}>
            {currentIndex + 1 < questions.length ? 'Наступне питання' : 'Завершити тест'}
          </button>
        )}
      </div>
    </section>
  );
};