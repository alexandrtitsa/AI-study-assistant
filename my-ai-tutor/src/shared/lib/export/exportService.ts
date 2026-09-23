import type { FlashcardSchema } from '@/shared/types/ai';

export class ExportService {
  static exportToAnkiCsv(flashcards: FlashcardSchema[], filename = 'flashcards.csv'): void {
    if (flashcards.length === 0) return;

    const csvRows = flashcards.map((card) => {
      const q = `"${card.question.replace(/"/g, '""')}"`;
      const a = `"${card.answer.replace(/"/g, '""')}"`;
      return `${q},${a},"ai-tutor"`;
    });

    const csvContent = '\uFEFF' + csvRows.join('\n'); // UTF-8 BOM для підтримки кирилиці в Excel/Anki
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static printSummaryToPdf(): void {
    window.print();
  }
}