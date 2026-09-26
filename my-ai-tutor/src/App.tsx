import { useState, type FC } from "react";
import { useStudyStore } from "@/entities/study";
import { StreakTracker } from "@/features/analytics";
import { Flashcard } from "@/features/flip-card";
import { PdfUploader } from "@/features/upload-pdf";
import { AIService } from "@/features/ai-tutor";
import { ExportService } from "@/shared/lib";
import { Button } from "@/shared/ui";
import { Layout } from "@/widgets/Layout";
import { StreakWidget } from "@/widgets/StreakWidget";

export const App: FC = () => {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { summary, flashcards = [], setStudyData } = useStudyStore();
  const progress = StreakTracker.getProgress();

  const handleGenerate = async (textToProcess: string) => {
    if (!textToProcess.trim()) return;

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const studyPackage = await AIService.generateStudyPackage(textToProcess);
      setStudyData(studyPackage);
      StreakTracker.recordActivity();
    } catch {
      setErrorMessage(
        "Сталася помилка під час генерації матеріалів. Перевірте API ключ або спробуйте пізніше.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePdfExtracted = (extractedText: string) => {
    setInputText(extractedText);
    void handleGenerate(extractedText);
  };

  const sidebarContent = (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <h2>AI Tutor</h2>
      <StreakWidget progress={progress} />
      <nav>
        <p style={{ fontSize: "0.875rem", color: "#666" }}>Навігація</p>
      </nav>
    </div>
  );

  return (
    <Layout sidebarContent={sidebarContent}>
      <section
        style={{ display: "flex", flexDirection: "column", gap: "32px" }}
      >
        <header>
          <h1>Генератор навчальних матеріалів</h1>
          <p>
            Введіть текст або завантажте PDF-файл для створення конспекту та
            флеш-карток.
          </p>
        </header>

        <PdfUploader
          onTextExtracted={handlePdfExtracted}
          onError={(err) => setErrorMessage(err)}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Або вставте ваш текст сюди..."
            rows={6}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <Button
            type="button"
            onClick={() => void handleGenerate(inputText)}
            disabled={isLoading || !inputText.trim()}
          >
            {isLoading ? "Генеруємо..." : "Згенерувати матеріали"}
          </Button>
        </div>

        {errorMessage && (
          <div
            role="alert"
            style={{
              color: "red",
              padding: "12px",
              border: "1px solid red",
              borderRadius: "8px",
            }}
          >
            {errorMessage}
          </div>
        )}

        {summary && (
          <article>
            <h2>{summary.title || "Конспект"}</h2>
            {summary.overview && <p>{summary.overview}</p>}
            {Array.isArray(summary.keyPoints) && summary.keyPoints.length > 0 && (
              <ul>
                {summary.keyPoints.map((point: string, index: number) => (
                  <li key={`${point}-${index}`}>{point}</li>
                ))}
              </ul>
            )}
          </article>
        )}

        {Array.isArray(flashcards) && flashcards.length > 0 && (
          <section>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h2>Флеш-картки</h2>
              <Button
                type="button"
                onClick={() => ExportService.exportToAnkiCsv(flashcards)}
              >
                Експорт в Anki (CSV)
              </Button>
            </div>
            <Flashcard />
          </section>
        )}
      </section>
    </Layout>
  );
};