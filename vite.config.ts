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
      // Force all React imports to use the same instance
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    },
    // Force single React instance to prevent "Cannot read properties of null" errors
    dedupe: ['react', 'react-dom', 'react/jsx-runtime'],
  },
  optimizeDeps: {
    // Force React to be included in optimization to prevent multiple instances
    include: ['react', 'react-dom', 'react/jsx-runtime'],
    // Force Vite to use a single React instance
    force: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined, // Single bundle for faster TWA cold start
      },
    },
    minify: 'esbuild', // Use esbuild for faster builds (default minifier)
    // Note: esbuild doesn't support drop_console, but it's faster and doesn't require extra dependencies
  },
  server: {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable', // Aggressive caching for assets
    },
  },
});
