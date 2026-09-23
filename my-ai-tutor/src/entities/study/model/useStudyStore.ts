import { create } from 'zustand';
import type { FlashcardSchema, QuizQuestionSchema, SummarySchema } from '@/shared/types/ai';

interface StudyState {
  summary: SummarySchema | null;
  flashcards: FlashcardSchema[];
  quiz: QuizQuestionSchema[];
  currentCardIndex: number;
  isFlipped: boolean;
  setStudyData: (data: { summary: SummarySchema; flashcards: FlashcardSchema[]; quiz: QuizQuestionSchema[] }) => void;
  nextCard: () => void;
  prevCard: () => void;
  toggleFlip: () => void;
}

export const useStudyStore = create<StudyState>((set) => ({
  summary: null,
  flashcards: [],
  quiz: [],
  currentCardIndex: 0,
  isFlipped: false,

  setStudyData: ({ summary, flashcards, quiz }) =>
    set({ summary, flashcards, quiz, currentCardIndex: 0, isFlipped: false }),

  nextCard: () =>
    set((state) => ({
      currentCardIndex: Math.min(state.currentCardIndex + 1, state.flashcards.length - 1),
      isFlipped: false,
    })),

  prevCard: () =>
    set((state) => ({
      currentCardIndex: Math.max(state.currentCardIndex - 1, 0),
      isFlipped: false,
    })),

  toggleFlip: () => set((state) => ({ isFlipped: !state.isFlipped })),
}));