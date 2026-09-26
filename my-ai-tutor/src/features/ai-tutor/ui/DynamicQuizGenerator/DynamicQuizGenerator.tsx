import { useState, useCallback, type FC, type FormEvent } from "react";
import { AIService } from "@/features/ai-tutor/api/AIService";
import { QuizEngine } from "@/features/play-quiz";
import { useAiGenerator } from "@/shared/lib/hooks/useAiGenerator";
import type { QuizQuestion } from "@/shared/types";
import styles from "./DynamicQuizGenerator.module.scss";

export const DynamicQuizGenerator: FC = () => {
  const [topic, setTopic] = useState("");

  const fetchQuizQuestions = useCallback(
    (topicText: string) => AIService.generateQuizQuestions(topicText),
    []
  );

  const {
    data: questions,
    isLoading,
    error,
    execute: generateQuiz,
  } = useAiGenerator<QuizQuestion[], [string]>(fetchQuizQuestions);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedTopic = topic.trim();
    if (!trimmedTopic || isLoading) return;

    void generateQuiz(trimmedTopic);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Генератор AI-вікторин</h2>
        <p className={styles.description}>
          Вкажіть тему, і штучний інтелект створить персональний інтерактивний тест.
        </p>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            className={styles.input}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Наприклад: React Hooks, TypeScript Generics, CSS Grid..."
            disabled={isLoading}
          />
          <button
            type="submit"
            className={styles.generateBtn}
            disabled={isLoading || !topic.trim()}
          >
            {isLoading ? "Збережіть терпіння..." : "Згенерувати тест"}
          </button>
        </div>
      </form>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {Array.isArray(questions) && questions.length > 0 && (
        <div className={styles.quizContainer}>
          <QuizEngine questions={questions} />
        </div>
      )}
    </div>
  );
};