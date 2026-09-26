export interface SummarySchema {
  title: string;
  overview: string;
  keyPoints: string[];
}

export interface FlashcardSchema {
  id: string;
  question: string;
  answer: string;
}

export interface QuizQuestionSchema {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export type QuizQuestion = QuizQuestionSchema;
export type Flashcard = FlashcardSchema;
export type Summary = SummarySchema;

export interface AIStudyPackageResponse {
  summary: SummarySchema;
  flashcards: FlashcardSchema[];
  quiz: QuizQuestionSchema[];
}

export type StudyPackage = AIStudyPackageResponse;