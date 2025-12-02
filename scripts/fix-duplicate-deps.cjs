#!/usr/bin/env node

/**
 * Automatic Duplicate Dependency Fixer
 * 
 * This script automatically fixes duplicate dependencies in package.json
 * by removing them from devDependencies if they exist in dependencies.
 * 
 * Runs automatically during:
 * - postinstall (after npm/pnpm install)
 * - precommit (before git commit)
 * - prebuild (before build)
 */

const fs = require('fs');
const path = require('path');

const PACKAGE_JSON_PATH = path.join(__dirname, '..', 'package.json');

// Known packages that should ONLY be in dependencies
const DEPENDENCIES_ONLY = [
  'miaoda-sc-plugin',
  'miaoda-auth-react',
];

function fixDuplicateDependencies() {
  console.log('\n🔧 Checking for duplicate dependencies...\n');

  // Read package.json
  const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
  
  let fixed = false;
  const fixes = [];

  // Check for duplicates
  if (packageJson.dependencies && packageJson.devDependencies) {
    for (const pkg of DEPENDENCIES_ONLY) {
      if (packageJson.dependencies[pkg] && packageJson.devDependencies[pkg]) {
        console.log(`❌ Found duplicate: ${pkg}`);
        console.log(`   dependencies: ${packageJson.dependencies[pkg]}`);
        console.log(`   devDependencies: ${packageJson.devDependencies[pkg]}`);
        
        // Remove from devDependencies
        delete packageJson.devDependencies[pkg];
        fixed = true;
        fixes.push(pkg);
        
        console.log(`✅ Removed ${pkg} from devDependencies\n`);
      }
    }
  }

  if (fixed) {
    // Write back to package.json
    fs.writeFileSync(
      PACKAGE_JSON_PATH,
      JSON.stringify(packageJson, null, 2) + '\n',
      'utf8'
    );
    
    console.log('✅ Fixed duplicate dependencies:');
    fixes.forEach(pkg => console.log(`   - ${pkg}`));
    console.log('\n📝 Updated package.json');
    console.log('⚠️  Please run: pnpm install\n');
    
    return true;
  } else {
    console.log('✅ No duplicate dependencies found\n');
    return false;
  }
}

// Run the fix
try {
  const wasFixed = fixDuplicateDependencies();
  process.exit(wasFixed ? 1 : 0); // Exit with 1 if fixes were made (to trigger reinstall)
} catch (error) {
  console.error('❌ Error fixing duplicate dependencies:', error.message);
  process.exit(1);
}
