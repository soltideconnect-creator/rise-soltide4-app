#!/usr/bin/env node

/**
 * PWA Builder Requirements Verification Script
 * Checks if the PWA meets all requirements for PWABuilder
 */

const fs = require('fs');
const path = require('path');

console.log('\n╔══════════════════════════════════════════════════════════════════════╗');
console.log('║                                                                      ║');
console.log('║              PWA BUILDER REQUIREMENTS VERIFICATION                   ║');
console.log('║                                                                      ║');
console.log('╚══════════════════════════════════════════════════════════════════════╝\n');

let passedChecks = 0;
let totalChecks = 0;
const issues = [];
const warnings = [];

function checkPass(message) {
  console.log(`✅ ${message}`);
  passedChecks++;
  totalChecks++;
}

function checkFail(message, issue) {
  console.log(`❌ ${message}`);
  issues.push(issue);
  totalChecks++;
}

function checkWarn(message, warning) {
  console.log(`⚠️  ${message}`);
  warnings.push(warning);
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('STEP 1: CHECKING MANIFEST.JSON');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Check manifest.json exists
const manifestPath = path.join(__dirname, 'public', 'manifest.json');
if (!fs.existsSync(manifestPath)) {
  checkFail('manifest.json not found', 'manifest.json file is missing from public/ directory');
  process.exit(1);
}

checkPass('manifest.json exists');

// Read and parse manifest
let manifest;
try {
  const manifestContent = fs.readFileSync(manifestPath, 'utf8');
  manifest = JSON.parse(manifestContent);
  checkPass('manifest.json is valid JSON');
} catch (error) {
  checkFail('manifest.json is invalid JSON', `JSON parse error: ${error.message}`);
  process.exit(1);
}

// Check required manifest fields
const requiredFields = [
  { field: 'name', description: 'App name' },
  { field: 'short_name', description: 'Short app name' },
  { field: 'start_url', description: 'Start URL' },
  { field: 'display', description: 'Display mode' },
  { field: 'background_color', description: 'Background color' },
  { field: 'theme_color', description: 'Theme color' },
  { field: 'icons', description: 'App icons' }
];

requiredFields.forEach(({ field, description }) => {
  if (manifest[field]) {
    checkPass(`${description} (${field}) is present`);
  } else {
    checkFail(`${description} (${field}) is missing`, `manifest.json must have a "${field}" field`);
  }
});

// Check optional but recommended fields
const recommendedFields = [
  { field: 'description', description: 'App description' },
  { field: 'scope', description: 'App scope' },
  { field: 'orientation', description: 'Screen orientation' },
  { field: 'categories', description: 'App categories' },
  { field: 'screenshots', description: 'App screenshots' },
  { field: 'shortcuts', description: 'App shortcuts' }
];

recommendedFields.forEach(({ field, description }) => {
  if (manifest[field]) {
    checkPass(`${description} (${field}) is present (recommended)`);
  } else {
    checkWarn(`${description} (${field}) is missing (recommended)`, `Consider adding "${field}" to manifest.json`);
  }
});

// Check icons
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('STEP 2: CHECKING ICONS');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (manifest.icons && Array.isArray(manifest.icons)) {
  checkPass(`Found ${manifest.icons.length} icon entries`);
  
  // Check for required icon sizes
  const requiredSizes = ['192x192', '512x512'];
  const foundSizes = manifest.icons.map(icon => icon.sizes);
  
  requiredSizes.forEach(size => {
    if (foundSizes.includes(size)) {
      checkPass(`Icon size ${size} is present (required)`);
    } else {
      checkFail(`Icon size ${size} is missing`, `PWABuilder requires icons in ${size} size`);
    }
  });
  
  // Check for maskable icons
  const hasMaskable = manifest.icons.some(icon => icon.purpose && icon.purpose.includes('maskable'));
  if (hasMaskable) {
    checkPass('Maskable icons are present (recommended for Android)');
  } else {
    checkWarn('Maskable icons are missing', 'Consider adding maskable icons for better Android support');
  }
  
  // Check if icon files exist
  manifest.icons.forEach(icon => {
    const iconPath = path.join(__dirname, 'public', icon.src);
    if (fs.existsSync(iconPath)) {
      checkPass(`Icon file exists: ${icon.src}`);
    } else {
      checkFail(`Icon file missing: ${icon.src}`, `Icon file not found at ${iconPath}`);
    }
  });
} else {
  checkFail('No icons defined in manifest', 'manifest.json must have an "icons" array');
}

// Check Service Worker
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('STEP 3: CHECKING SERVICE WORKER');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const swPath = path.join(__dirname, 'public', 'sw.js');
if (fs.existsSync(swPath)) {
  checkPass('Service Worker file (sw.js) exists');
  
  const swContent = fs.readFileSync(swPath, 'utf8');
  
  // Check for essential service worker features
  if (swContent.includes('install')) {
    checkPass('Service Worker has install event');
  } else {
    checkWarn('Service Worker missing install event', 'Install event is recommended for caching');
  }
  
  if (swContent.includes('activate')) {
    checkPass('Service Worker has activate event');
  } else {
    checkWarn('Service Worker missing activate event', 'Activate event is recommended for cache cleanup');
  }
  
  if (swContent.includes('fetch')) {
    checkPass('Service Worker has fetch event (offline support)');
  } else {
    checkFail('Service Worker missing fetch event', 'Fetch event is required for offline functionality');
  }
} else {
  checkFail('Service Worker file (sw.js) not found', 'Service Worker is required for PWA');
}

// Check service worker registration
const mainTsxPath = path.join(__dirname, 'src', 'main.tsx');
if (fs.existsSync(mainTsxPath)) {
  const mainContent = fs.readFileSync(mainTsxPath, 'utf8');
  if (mainContent.includes('serviceWorker') && mainContent.includes('register')) {
    checkPass('Service Worker is registered in main.tsx');
  } else {
    checkFail('Service Worker not registered', 'Service Worker must be registered in the app');
  }
}

// Check screenshots
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('STEP 4: CHECKING SCREENSHOTS');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (manifest.screenshots && Array.isArray(manifest.screenshots)) {
  checkPass(`Found ${manifest.screenshots.length} screenshot entries`);
  
  if (manifest.screenshots.length >= 3) {
    checkPass('At least 3 screenshots provided (recommended)');
  } else {
    checkWarn('Less than 3 screenshots', 'PWABuilder recommends at least 3 screenshots');
  }
  
  // Check if screenshot files exist
  manifest.screenshots.forEach((screenshot, index) => {
    const screenshotPath = path.join(__dirname, 'public', screenshot.src);
    if (fs.existsSync(screenshotPath)) {
      checkPass(`Screenshot ${index + 1} exists: ${screenshot.src}`);
    } else {
      checkFail(`Screenshot ${index + 1} missing: ${screenshot.src}`, `Screenshot file not found at ${screenshotPath}`);
    }
  });
} else {
  checkWarn('No screenshots defined', 'Screenshots are recommended for app store listings');
}

// Check HTTPS requirement
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('STEP 5: CHECKING HTTPS REQUIREMENT');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('ℹ️  HTTPS is required for PWA (will be provided by Netlify)');
checkPass('HTTPS will be enabled on Netlify deployment');

// Check display mode
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('STEP 6: CHECKING DISPLAY MODE');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const validDisplayModes = ['fullscreen', 'standalone', 'minimal-ui', 'browser'];
if (manifest.display && validDisplayModes.includes(manifest.display)) {
  checkPass(`Display mode "${manifest.display}" is valid`);
  
  if (manifest.display === 'standalone' || manifest.display === 'fullscreen') {
    checkPass('Display mode is optimal for app-like experience');
  }
} else {
  checkFail('Invalid display mode', 'Display mode must be one of: fullscreen, standalone, minimal-ui, browser');
}

// Check start_url
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('STEP 7: CHECKING START URL');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (manifest.start_url) {
  checkPass(`Start URL is set to: ${manifest.start_url}`);
  
  if (manifest.scope) {
    checkPass(`Scope is set to: ${manifest.scope}`);
    
    // Check if start_url is within scope
    if (manifest.start_url.startsWith(manifest.scope)) {
      checkPass('Start URL is within scope');
    } else {
      checkWarn('Start URL may be outside scope', 'Ensure start_url is within the defined scope');
    }
  }
}

// Check colors
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('STEP 8: CHECKING COLORS');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const colorRegex = /^#[0-9A-Fa-f]{6}$/;

if (manifest.theme_color) {
  if (colorRegex.test(manifest.theme_color)) {
    checkPass(`Theme color is valid: ${manifest.theme_color}`);
  } else {
    checkWarn('Theme color format may be invalid', 'Use hex format: #RRGGBB');
  }
}

if (manifest.background_color) {
  if (colorRegex.test(manifest.background_color)) {
    checkPass(`Background color is valid: ${manifest.background_color}`);
  } else {
    checkWarn('Background color format may be invalid', 'Use hex format: #RRGGBB');
  }
}

// Check build output
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('STEP 9: CHECKING BUILD OUTPUT');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  checkPass('dist/ folder exists (production build ready)');
  
  const distIndexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(distIndexPath)) {
    checkPass('dist/index.html exists');
  } else {
    checkFail('dist/index.html missing', 'Run "npm run build" to create production build');
  }
  
  const distManifestPath = path.join(distPath, 'manifest.json');
  if (fs.existsSync(distManifestPath)) {
    checkPass('dist/manifest.json exists');
  } else {
    checkFail('dist/manifest.json missing', 'Manifest not copied to dist folder');
  }
  
  const distSwPath = path.join(distPath, 'sw.js');
  if (fs.existsSync(distSwPath)) {
    checkPass('dist/sw.js exists');
  } else {
    checkFail('dist/sw.js missing', 'Service Worker not copied to dist folder');
  }
} else {
  checkWarn('dist/ folder not found', 'Run "npm run build" before using PWABuilder');
}

// Final summary
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('VERIFICATION SUMMARY');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log(`✅ Passed: ${passedChecks}/${totalChecks} checks`);
console.log(`❌ Failed: ${issues.length} critical issues`);
console.log(`⚠️  Warnings: ${warnings.length} recommendations\n`);

if (issues.length > 0) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('CRITICAL ISSUES (Must Fix)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  issues.forEach((issue, index) => {
    console.log(`${index + 1}. ${issue}`);
  });
  console.log('');
}

if (warnings.length > 0) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('RECOMMENDATIONS (Optional)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  warnings.forEach((warning, index) => {
    console.log(`${index + 1}. ${warning}`);
  });
  console.log('');
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('PWABUILDER READINESS');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (issues.length === 0) {
  console.log('🎉 SUCCESS! Your PWA is ready for PWABuilder!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Deploy to Netlify: npm run build && netlify deploy --prod');
  console.log('2. Visit https://www.pwabuilder.com');
  console.log('3. Enter your deployed URL');
  console.log('4. Generate app packages for stores');
  console.log('');
  process.exit(0);
} else {
  console.log('❌ FAILED: Fix critical issues before using PWABuilder');
  console.log('');
  console.log('Fix the issues listed above and run this script again.');
  console.log('');
  process.exit(1);
}
