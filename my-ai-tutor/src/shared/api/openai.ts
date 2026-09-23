import OpenAI from 'openai';
import type { AIStudyPackageResponse } from '../types/ai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const STUDY_PACKAGE_JSON_SCHEMA = {
  name: 'study_package',
  strict: true,
  schema: {
    type: 'object',
    properties: {
      summary: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          overview: { type: 'string' },
          keyPoints: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        required: ['title', 'overview', 'keyPoints'],
        additionalProperties: false,
      },
      flashcards: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            question: { type: 'string' },
            answer: { type: 'string' },
          },
          required: ['id', 'question', 'answer'],
          additionalProperties: false,
        },
      },
      quiz: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            question: { type: 'string' },
            options: {
              type: 'array',
              items: { type: 'string' },
            },
            correctAnswerIndex: { type: 'number' },
            explanation: { type: 'string' },
          },
          required: ['id', 'question', 'options', 'correctAnswerIndex', 'explanation'],
          additionalProperties: false,
        },
      },
    },
    required: ['summary', 'flashcards', 'quiz'],
    additionalProperties: false,
  },
} as const;

export class AIService {
  static async generateStudyPackage(content: string): Promise<AIStudyPackageResponse> {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Ви — професійний AI-викладач. Проаналізуйте наданий текст та згенеруйте конспект, флеш-картки та квіз.',
        },
        {
          role: 'user',
          content,
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: STUDY_PACKAGE_JSON_SCHEMA,
      },
      temperature: 0.2,
    });

    const resultText = response.choices[0]?.message?.content;
    if (!resultText) {
      throw new Error('Отримано порожню відповідь від OpenAI');
    }

    return JSON.parse(resultText) as AIStudyPackageResponse;
  }
}