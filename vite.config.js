import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  define: { 'process.env.NODE_ENV': '"production"' },
  build: {
    outDir: 'build', emptyOutDir: true, cssCodeSplit: false, minify: 'esbuild',
    lib: { entry: 'src/main.jsx', formats: ['iife'], name: 'MagmafySite', fileName: () => 'app.js' },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-dom/client', 'gsap'],
      output: { globals: { react: 'React', 'react-dom': 'ReactDOM', 'react-dom/client': 'ReactDOM', gsap: 'gsap' }, assetFileNames: 'app.[ext]' }
    }
  }
});
