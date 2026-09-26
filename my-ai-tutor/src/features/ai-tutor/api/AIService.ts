import type { AIStudyPackageResponse, FlashcardSchema, QuizQuestionSchema } from '@/shared/types/ai';

export class AIService {
  private static FREE_MODELS = [
    'openrouter/auto',
    'google/gemini-2.0-flash-lite-001',
    'deepseek/deepseek-r1:free',
    'qwen/qwen-2.5-72b-instruct:free',
    'mistralai/mistral-7b-instruct:free',
  ];

  private static getApiKey(): string {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error('Не вказано VITE_OPENROUTER_API_KEY у файлі .env');
    }
    return apiKey.trim();
  }

  private static async fetchOpenRouter(messages: Array<{ role: string; content: string }>): Promise<string> {
    const apiKey = this.getApiKey();
    let lastError: Error | null = null;

    for (const model of this.FREE_MODELS) {
      try {
        const response = await fetch('/api/openrouter/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'AI Study Prep App',
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: 0.2,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.warn(`[OpenRouter] Модель ${model} повернула status ${response.status}:`, errorText);
          lastError = new Error(`OpenRouter Error (${response.status}): ${errorText}`);
          continue;
        }

        const data = await response.json();
        const resultText = data.choices?.[0]?.message?.content;

        if (!resultText) {
          throw new Error('Порожня відповідь від моделі');
        }

        return resultText;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
      }
    }

    throw lastError || new Error('Жодна з безкоштовних моделей не відповіла успішно.');
  }

  static async generateStudyPackage(content: string): Promise<AIStudyPackageResponse> {
    const rawContent = await this.fetchOpenRouter([
      {
        role: 'system',
        content:
          'Ви — AI-викладач. Поверніть відповідь СУВОРО У ФОРМАТІ JSON без додаткового тексту, розмітки markdown чи ```json. ' +
          'Структура JSON: {\n' +
          '  "summary": { "title": "Заголовок", "overview": "Короткий огляд", "keyPoints": ["Ключова думка 1"] },\n' +
          '  "flashcards": [ { "question": "Питання...", "answer": "Відповідь..." } ],\n' +
          '  "quiz": [ { "question": "Питання...", "options": ["Варіант 1", "Варіант 2", "Варіант 3", "Варіант 4"], "correctAnswerIndex": 0, "explanation": "Пояснення..." } ]\n' +
          '}',
      },
      {
        role: 'user',
        content: `Згенеруй навчальний пакет для тексту:\n\n${content}`,
      },
    ]);

    const cleanedJson = rawContent.replace(/```json\s?|```/g, '').trim();
    const rawData = JSON.parse(cleanedJson);

    const rawCards = Array.isArray(rawData.flashcards) ? rawData.flashcards : [];
    const normalizedFlashcards: FlashcardSchema[] = rawCards.map((card: Record<string, string>, index: number) => ({
      id: card.id || `card-${Date.now()}-${index}`,
      question: card.question || card.front || '',
      answer: card.answer || card.back || '',
    }));

    const rawSummary = rawData.summary || {};
    const normalizedSummary = {
      title: rawSummary.title || 'Конспект',
      overview: typeof rawSummary === 'string' ? rawSummary : (rawSummary.overview || ''),
      keyPoints: Array.isArray(rawSummary.keyPoints) ? rawSummary.keyPoints : [],
    };

    const rawQuiz = Array.isArray(rawData.quiz) ? rawData.quiz : [];
    const normalizedQuiz: QuizQuestionSchema[] = rawQuiz.map((q: Record<string, unknown>, index: number) => ({
      id: String(q.id || `quiz-${Date.now()}-${index}`),
      question: String(q.question || ''),
      options: Array.isArray(q.options) ? q.options.map(String) : [],
      correctAnswerIndex: typeof q.correctAnswerIndex === 'number' 
        ? q.correctAnswerIndex 
        : (typeof q.correctIndex === 'number' ? q.correctIndex : 0),
      explanation: String(q.explanation || ''),
    }));

    return {
      summary: normalizedSummary,
      flashcards: normalizedFlashcards,
      quiz: normalizedQuiz,
    };
  }

  static async generateTextResponse(prompt: string): Promise<string> {
    return this.fetchOpenRouter([
      {
        role: 'system',
        content: 'Ви — досвідчений AI-репетитор з програмування та веб-розробки. Дайте чітку, зрозумілу та структуровану відповідь українською мовою з прикладами коду, якщо це доцільно.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);
  }

  static async generateQuizQuestions(topic: string): Promise<QuizQuestionSchema[]> {
    const rawContent = await this.fetchOpenRouter([
      {
        role: 'system',
        content:
          'Ви — AI-викладач. Поверніть відповідь СУВОРО У ФОРМАТІ JSON без додаткового тексту, розмітки markdown чи ```json. ' +
          'Структура JSON (масив об\'єктів): [\n' +
          '  {\n' +
          '    "question": "Текст питання...",\n' +
          '    "options": ["Варіант 1", "Варіант 2", "Варіант 3", "Варіант 4"],\n' +
          '    "correctAnswerIndex": 0,\n' +
          '    "explanation": "Пояснення правильної відповіді..."\n' +
          '  }\n' +
          ']',
      },
      {
        role: 'user',
        content: `Згенеруй 5 питань для тестування знань на тему: ${topic}`,
      },
    ]);

    const cleanedJson = rawContent.replace(/```json\s?|```/g, '').trim();
    const rawQuiz = JSON.parse(cleanedJson);

    if (!Array.isArray(rawQuiz)) {
      throw new Error('Невалідний формат даних від AI для квізу.');
    }

    return rawQuiz.map((q: Record<string, unknown>, index: number) => ({
      id: String(q.id || `quiz-${Date.now()}-${index}`),
      question: String(q.question || ''),
      options: Array.isArray(q.options) ? q.options.map(String) : [],
      correctAnswerIndex: typeof q.correctAnswerIndex === 'number' 
        ? q.correctAnswerIndex 
        : (typeof q.correctIndex === 'number' ? q.correctIndex : 0),
      explanation: String(q.explanation || ''),
    }));
  }
}