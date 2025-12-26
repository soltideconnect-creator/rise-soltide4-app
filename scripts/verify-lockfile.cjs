#!/usr/bin/env node

/**
 * Lockfile Integrity Checker
 * 
 * This script ensures pnpm-lock.yaml is always in sync with package.json
 * Run this before committing or deploying to catch lockfile issues early.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔒 Lockfile Integrity Checker\n');

// Check if files exist
const packageJsonPath = path.join(process.cwd(), 'package.json');
const lockfilePath = path.join(process.cwd(), 'pnpm-lock.yaml');

if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ package.json not found!');
  process.exit(1);
}

if (!fs.existsSync(lockfilePath)) {
  console.error('❌ pnpm-lock.yaml not found!');
  console.log('💡 Run: pnpm install');
  process.exit(1);
}

console.log('✅ Files found');
console.log(`   package.json: ${fs.statSync(packageJsonPath).size} bytes`);
console.log(`   pnpm-lock.yaml: ${fs.statSync(lockfilePath).size} bytes\n`);

// Check lockfile sync
console.log('🔍 Checking lockfile sync...');
try {
  execSync('pnpm install --frozen-lockfile', { 
    stdio: 'pipe',
    encoding: 'utf-8'
  });
  console.log('✅ Lockfile is in sync with package.json\n');
} catch (error) {
  console.error('❌ Lockfile is OUT OF SYNC with package.json!\n');
  console.error('Error:', error.message);
  console.log('\n📝 To fix this issue:');
  console.log('   1. Run: pnpm install');
  console.log('   2. Commit the updated pnpm-lock.yaml');
  console.log('   3. Never manually edit pnpm-lock.yaml\n');
  process.exit(1);
}

// Check for duplicate dependencies
console.log('🔍 Checking for duplicate dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const deps = packageJson.dependencies || {};
  const devDeps = packageJson.devDependencies || {};
  
  const duplicates = Object.keys(deps).filter(dep => devDeps[dep]);
  
  if (duplicates.length > 0) {
    console.warn('⚠️  Warning: Found duplicate dependencies:');
    duplicates.forEach(dep => {
      console.warn(`   - ${dep}: ${deps[dep]} (deps) and ${devDeps[dep]} (devDeps)`);
    });
    console.log('');
  } else {
    console.log('✅ No duplicate dependencies found\n');
  }
} catch (error) {
  console.error('❌ Error checking duplicates:', error.message);
}

// Check lockfile version
console.log('🔍 Checking lockfile version...');
try {
  const lockfileContent = fs.readFileSync(lockfilePath, 'utf-8');
  const versionMatch = lockfileContent.match(/lockfileVersion:\s*['"]?(\d+\.?\d*)/);
  
  if (versionMatch) {
    const version = versionMatch[1];
    console.log(`✅ Lockfile version: ${version}\n`);
    
    if (version !== '9.0') {
      console.warn('⚠️  Warning: Expected lockfile version 9.0');
      console.warn('   Your pnpm version might be different\n');
    }
  }
} catch (error) {
  console.error('❌ Error checking lockfile version:', error.message);
}

console.log('═══════════════════════════════════════════════════════════');
console.log('✅ ALL LOCKFILE CHECKS PASSED!');
console.log('═══════════════════════════════════════════════════════════\n');

process.exit(0);
