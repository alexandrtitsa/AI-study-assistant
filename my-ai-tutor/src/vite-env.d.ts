/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENROUTER_API_KEY: string;
  readonly VITE_SITE_URL: string;
  readonly VITE_SITE_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.module.scss' {
  const classes: Record<string, string>;
  export default classes;
}