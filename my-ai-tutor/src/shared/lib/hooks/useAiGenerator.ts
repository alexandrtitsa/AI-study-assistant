import { useState, useCallback } from 'react';

export interface UseAiGeneratorReturn<T, P extends unknown[]> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  execute: (...args: P) => Promise<T | null>;
  reset: () => void;
}

export const useAiGenerator = <T, P extends unknown[] = [string]>(
  apiFn: (...args: P) => Promise<T>
): UseAiGeneratorReturn<T, P> => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: P): Promise<T | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await apiFn(...args);
        setData(result);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Виникла невідома помилка під час запиту до AI';
        setError(errorMessage);
        setData(null);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [apiFn]
  );

  const reset = useCallback(() => {
    setData(null);
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    data,
    isLoading,
    error,
    execute,
    reset,
  };
};