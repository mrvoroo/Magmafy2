import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Normal website build: `npm run dev` / `npm run build` (output in dist/, ready for Netlify/Vercel).
export default defineConfig({
  plugins: [react()],
});
