import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

import { miaodaDevPlugin } from "miaoda-sc-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr({
      svgrOptions: {
        icon: true, exportType: 'named', namedExport: 'ReactComponent', }, }), miaodaDevPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    // Force single React instance to prevent "Cannot read properties of null" errors
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    // Force React to be included in optimization to prevent multiple instances
    include: ['react', 'react-dom', 'react/jsx-runtime'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined, // Single bundle for faster TWA cold start
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove console.* statements in production
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  server: {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable', // Aggressive caching for assets
    },
  },
});
