import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import '@/app/styles/index.scss';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Не знайдено кореневий елемент #root для монтування React-додатка');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);