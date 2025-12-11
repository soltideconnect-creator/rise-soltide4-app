#!/usr/bin/env node

/**
 * Update Service Worker Bundle Names
 * 
 * This script automatically updates the service worker (public/sw.js) with the
 * correct bundle names after each build. This ensures the service worker always
 * caches the latest bundles for TWA cold start optimization.
 * 
 * Usage: node update-sw-bundles.js
 * Run after: npm run build
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, 'dist', 'assets');
const SW_PATH = path.join(__dirname, 'public', 'sw.js');

console.log('[Update SW] Starting bundle name update...');

// Read dist/assets directory to find bundle names
if (!fs.existsSync(DIST_DIR)) {
  console.error('[Update SW] Error: dist/assets directory not found. Run npm run build first.');
  process.exit(1);
}

const files = fs.readdirSync(DIST_DIR);
const jsBundle = files.find(f => f.startsWith('index-') && f.endsWith('.js'));
const cssBundle = files.find(f => f.startsWith('index-') && f.endsWith('.css'));

if (!jsBundle || !cssBundle) {
  console.error('[Update SW] Error: Could not find bundle files in dist/assets');
  console.error('[Update SW] Found files:', files);
  process.exit(1);
}

console.log('[Update SW] Found bundles:');
console.log('[Update SW]   JS:  /assets/' + jsBundle);
console.log('[Update SW]   CSS: /assets/' + cssBundle);

// Read service worker file
let swContent = fs.readFileSync(SW_PATH, 'utf8');

// Update bundle names in urlsToCache array
const urlsToCacheRegex = /const urlsToCache = \[([\s\S]*?)\];/;
const match = swContent.match(urlsToCacheRegex);

if (!match) {
  console.error('[Update SW] Error: Could not find urlsToCache array in sw.js');
  process.exit(1);
}

// Replace the urlsToCache array with updated bundle names
const newUrlsToCache = `const urlsToCache = [
  '/', // Cache root for instant load
  '/index.html',
  '/manifest.json',
  '/rise-icon.png',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/shortcut-icon-96.png',
  '/shortcut-icon-192.png',
  // Main JS/CSS bundles - automatically updated by update-sw-bundles.js
  '/assets/${cssBundle}',
  '/assets/${jsBundle}',
];`;

swContent = swContent.replace(urlsToCacheRegex, newUrlsToCache);

// Write updated service worker
fs.writeFileSync(SW_PATH, swContent, 'utf8');

console.log('[Update SW] ✅ Service worker updated successfully!');
console.log('[Update SW] Updated file: public/sw.js');
console.log('[Update SW] Next steps:');
console.log('[Update SW]   1. Commit changes: git add public/sw.js');
console.log('[Update SW]   2. Deploy to Netlify: git push');
console.log('[Update SW]   3. Rebuild Android .aab with updated bundles');
