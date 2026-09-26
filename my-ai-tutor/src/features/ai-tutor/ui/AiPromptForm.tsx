import { useState, type FC, type FormEvent } from "react";
import { AIService } from "../api/AIService";

export const AiPromptForm: FC = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      const result = await AIService.generateStudyPackage(prompt);
      setResponse(JSON.stringify(result, null, 2));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Щось пішло не так";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Задайте питання AI..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !prompt.trim()}>
          {isLoading ? "Генерація..." : "Надіслати"}
        </button>
      </form>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {response && <pre>{response}</pre>}
    </div>
  );
};