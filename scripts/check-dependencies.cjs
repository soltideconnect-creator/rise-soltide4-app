#!/usr/bin/env node

/**
 * Dependency Validation Script
 * 
 * This script checks for common dependency issues that can cause
 * deployment failures in CI/CD environments like Netlify.
 * 
 * Checks performed:
 * 1. No duplicate packages in dependencies and devDependencies
 * 2. Lockfile specifiers match package.json versions
 * 3. No version conflicts
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkDuplicateDependencies() {
  log('\n📦 Checking for duplicate dependencies...', 'blue');
  
  const pkgPath = path.join(process.cwd(), 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  
  const deps = Object.keys(pkg.dependencies || {});
  const devDeps = Object.keys(pkg.devDependencies || {});
  const duplicates = deps.filter(d => devDeps.includes(d));
  
  if (duplicates.length > 0) {
    log('❌ DUPLICATE DEPENDENCIES FOUND:', 'red');
    duplicates.forEach(dep => {
      log(`   - ${dep}`, 'red');
      log(`     dependencies: ${pkg.dependencies[dep]}`, 'yellow');
      log(`     devDependencies: ${pkg.devDependencies[dep]}`, 'yellow');
    });
    return false;
  }
  
  log('✅ No duplicate dependencies found', 'green');
  return true;
}

function checkLockfileMatch() {
  log('\n🔒 Checking lockfile matches package.json...', 'blue');
  
  const pkgPath = path.join(process.cwd(), 'package.json');
  const lockfilePath = path.join(process.cwd(), 'pnpm-lock.yaml');
  
  if (!fs.existsSync(lockfilePath)) {
    log('⚠️  pnpm-lock.yaml not found', 'yellow');
    return true; // Not an error, just no lockfile yet
  }
  
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const lockfile = fs.readFileSync(lockfilePath, 'utf8');
  
  let hasIssues = false;
  
  // Check all dependencies
  const allDeps = {
    ...pkg.dependencies,
    ...pkg.devDependencies
  };
  
  for (const [depName, depVersion] of Object.entries(allDeps)) {
    // Find the specifier in lockfile - match exact package name with word boundaries
    const escapedName = depName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`^\\s+${escapedName}:\\s*\\n\\s+specifier:\\s+([^\\n]+)`, 'gm');
    const match = regex.exec(lockfile);
    
    if (match) {
      const lockfileSpecifier = match[1].trim();
      
      if (lockfileSpecifier !== depVersion) {
        if (!hasIssues) {
          log('❌ LOCKFILE MISMATCHES FOUND:', 'red');
          hasIssues = true;
        }
        log(`   - ${depName}`, 'red');
        log(`     package.json: ${depVersion}`, 'yellow');
        log(`     pnpm-lock.yaml: ${lockfileSpecifier}`, 'yellow');
      }
    }
  }
  
  if (!hasIssues) {
    log('✅ Lockfile matches package.json', 'green');
  }
  
  return !hasIssues;
}

function checkVersionConsistency() {
  log('\n🔍 Checking version consistency...', 'blue');
  
  const pkgPath = path.join(process.cwd(), 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  
  const allDeps = {
    ...pkg.dependencies,
    ...pkg.devDependencies
  };
  
  // Check for common issues
  let hasIssues = false;
  
  for (const [depName, depVersion] of Object.entries(allDeps)) {
    // Check for invalid version formats
    if (!depVersion || depVersion.trim() === '') {
      if (!hasIssues) {
        log('❌ VERSION ISSUES FOUND:', 'red');
        hasIssues = true;
      }
      log(`   - ${depName}: Empty version`, 'red');
    }
  }
  
  if (!hasIssues) {
    log('✅ All versions are valid', 'green');
  }
  
  return !hasIssues;
}

function main() {
  log('\n╔═══════════════════════════════════════════════════════════════╗', 'bold');
  log('║         Dependency Validation Check                          ║', 'bold');
  log('╚═══════════════════════════════════════════════════════════════╝', 'bold');
  
  const checks = [
    checkDuplicateDependencies(),
    checkLockfileMatch(),
    checkVersionConsistency()
  ];
  
  const allPassed = checks.every(check => check);
  
  log('\n' + '═'.repeat(65), 'bold');
  
  if (allPassed) {
    log('✅ ALL CHECKS PASSED - Dependencies are valid!', 'green');
    log('═'.repeat(65) + '\n', 'bold');
    process.exit(0);
  } else {
    log('❌ SOME CHECKS FAILED - Please fix the issues above', 'red');
    log('═'.repeat(65) + '\n', 'bold');
    log('💡 To fix lockfile issues, run: pnpm install', 'yellow');
    process.exit(1);
  }
}

main();
