import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExportService } from './exportService';
import type { FlashcardSchema } from '@/shared/types/ai';

describe('ExportService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('повинен правильно форматувати та викликати скачування CSV з UTF-8 BOM', () => {
    const mockCards: FlashcardSchema[] = [
      { id: '1', question: 'Що таке React?', answer: 'Бібліотека для UI' },
    ];

    const createObjectURLMock = vi.fn().mockReturnValue('blob:http://localhost/test');
    const revokeObjectURLMock = vi.fn();
    
    global.URL.createObjectURL = createObjectURLMock;
    global.URL.revokeObjectURL = revokeObjectURLMock;

    const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node);
    const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node);

    ExportService.exportToAnkiCsv(mockCards, 'test.csv');

    expect(createObjectURLMock).toHaveBeenCalledOnce();
    expect(appendChildSpy).toHaveBeenCalledOnce();
    expect(removeChildSpy).toHaveBeenCalledOnce();
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:http://localhost/test');
  });
});