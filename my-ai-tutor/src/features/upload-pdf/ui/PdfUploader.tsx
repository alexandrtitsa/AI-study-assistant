import { useState, useRef, type FC, type DragEvent, type ChangeEvent } from 'react';
import cn from 'classnames';
import { extractTextFromPdf } from '@/shared/lib/pdf/extractTextFromPdf';
import styles from './PdfUploader.module.scss';

interface PdfUploaderProps {
  onTextExtracted: (text: string) => void;
  onError?: (error: string) => void;
}

export const PdfUploader: FC<PdfUploaderProps> = ({ onTextExtracted, onError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      onError?.('Будь ласка, завантажте файл у форматі PDF');
      return;
    }

    try {
      setIsLoading(true);
      const extractedText = await extractTextFromPdf(file);
      onTextExtracted(extractedText);
    } catch {
      onError?.('Не вдалося прочитати PDF-файл');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      void processFile(file);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void processFile(file);
    }
  };

  return (
    <div
      className={cn(styles.uploadArea, {
        [styles.isDragging]: isDragging,
        [styles.isLoading]: isLoading,
      })}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          fileInputRef.current?.click();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Завантажити PDF файл"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className={styles.fileInput}
        onChange={handleFileChange}
        tabIndex={-1}
      />
      <p className={styles.title}>
        {isLoading ? 'Парсинг PDF...' : 'Перетягніть PDF сюди або натисніть для вибору'}
      </p>
      <span className={styles.subtitle}>Максимальний розмір файлу: 10 МБ</span>
    </div>
  );
};