import { useState, useCallback, type FC, type FormEvent } from "react";
import { AIService } from "@/features/ai-tutor/api/AIService";
import { useAiGenerator } from "@/shared/lib/hooks/useAiGenerator";
import styles from "./AiTutorPanel.module.scss";

export const AiTutorPanel: FC = () => {
  const [prompt, setPrompt] = useState("");

  const fetchTextResponse = useCallback(
    (promptText: string) => AIService.generateTextResponse(promptText),
    []
  );

  const { data, isLoading, error, execute, reset } = useAiGenerator<
    string,
    [string]
  >(fetchTextResponse);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || isLoading) return;

    void execute(trimmedPrompt);
  };

  const handleClear = () => {
    setPrompt("");
    reset();
  };

  return (
    <section className={styles.panel} aria-labelledby="ai-tutor-heading">
      <header className={styles.header}>
        <h2 id="ai-tutor-heading" className={styles.title}>
          AI-навчальний репетитор
        </h2>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <textarea
          className={styles.textarea}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Запитайте що завгодно про тему, яка викликає складнощі..."
          disabled={isLoading}
        />

        <div className={styles.actions}>
          {(prompt || data) && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={handleClear}
              disabled={isLoading}
            >
              Очистити
            </button>
          )}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? "AI думає..." : "Надіслати запит"}
          </button>
        </div>
      </form>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {data && (
        <article className={styles.responseBox}>
          <h3 className={styles.responseTitle}>Пояснення від AI:</h3>
          <div className={styles.responseContent}>{data}</div>
        </article>
      )}
    </section>
  );
};