import { useState, type FC } from 'react';
import { Layout } from '@/widgets/Layout/Layout';
import { StreakWidget } from '@/widgets/StreakWidget/ui/StreakWidget';
import { PdfUploader } from '@/features/upload-pdf/ui/PdfUploader';
import { Flashcard } from '@/features/flip-card/ui/Flashcard';
import { StreakTracker } from '@/features/analytics/lib/streakTracker';
import { useStudyStore } from '@/entities/study/model/useStudyStore';
import { AIService } from '@/shared/api/openai';
import { ExportService } from '@/shared/lib/export/exportService';

export const App: FC = () => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { summary, flashcards, setStudyData } = useStudyStore();
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
      setErrorMessage('Сталася помилка під час генерації матеріалів. Перевірте API ключ або спробуйте пізніше.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePdfExtracted = (extractedText: string) => {
    setInputText(extractedText);
    void handleGenerate(extractedText);
  };

  const sidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2>AI Tutor</h2>
      <StreakWidget progress={progress} />
      <nav>
        <p style={{ fontSize: '0.875rem', color: '#666' }}>Навігація</p>
      </nav>
    </div>
  );

  return (
    <Layout sidebarContent={sidebarContent}>
      <section style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <header>
          <h1>Генератор навчальних матеріалів</h1>
          <p>Введіть текст або завантажте PDF-файл для створення конспекту та флеш-карток.</p>
        </header>

        <PdfUploader onTextExtracted={handlePdfExtracted} onError={(err) => setErrorMessage(err)} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Або вставте ваш текст сюди..."
            rows={6}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
          <button
            type="button"
            onClick={() => void handleGenerate(inputText)}
            disabled={isLoading || !inputText.trim()}
            style={{ alignSelf: 'flex-start', padding: '10px 20px', cursor: 'pointer' }}
          >
            {isLoading ? 'Генеруємо...' : 'Згенерувати матеріали'}
          </button>
        </div>

        {errorMessage && (
          <div role="alert" style={{ color: 'red', padding: '12px', border: '1px solid red', borderRadius: '8px' }}>
            {errorMessage}
          </div>
        )}

        {summary && (
          <article>
            <h2>{summary.title}</h2>
            <p>{summary.overview}</p>
            <ul>
              {summary.keyPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        )}

        {flashcards.length > 0 && (
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2>Флеш-картки</h2>
              <button
                type="button"
                onClick={() => ExportService.exportToAnkiCsv(flashcards)}
                style={{ padding: '8px 16px', cursor: 'pointer' }}
              >
                Експорт в Anki (CSV)
              </button>
            </div>
            <Flashcard />
          </section>
        )}
      </section>
    </Layout>
  );
};