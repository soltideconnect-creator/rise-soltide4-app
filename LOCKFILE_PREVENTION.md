# 🔒 Lockfile Conflict Prevention Guide

**CRITICAL: Follow these rules to NEVER have lockfile conflicts again**

---

## 🚨 The Golden Rules

### Rule #1: NEVER Manually Edit pnpm-lock.yaml
**NEVER, EVER, UNDER ANY CIRCUMSTANCES edit pnpm-lock.yaml manually.**

- ❌ Don't open it in your editor
- ❌ Don't copy/paste from other projects
- ❌ Don't try to "fix" merge conflicts manually
- ✅ Let pnpm manage it automatically

### Rule #2: Always Use `pnpm install` After Changing package.json
**Every time you modify package.json, run `pnpm install` immediately.**

```bash
# After adding a dependency
pnpm add <package>
# pnpm-lock.yaml is automatically updated ✅

# After removing a dependency
pnpm remove <package>
# pnpm-lock.yaml is automatically updated ✅

# After manually editing package.json
pnpm install
# pnpm-lock.yaml is automatically updated ✅
```

### Rule #3: Always Commit Both Files Together
**Never commit package.json without pnpm-lock.yaml, and vice versa.**

```bash
# ✅ CORRECT: Commit both files together
git add package.json pnpm-lock.yaml
git commit -m "Add new dependency"

# ❌ WRONG: Commit only package.json
git add package.json
git commit -m "Add new dependency"  # Missing pnpm-lock.yaml!
```

### Rule #4: Use --frozen-lockfile in CI/CD
**Always use `--frozen-lockfile` flag in production builds.**

```bash
# ✅ In CI/CD pipelines
pnpm install --frozen-lockfile

# ✅ In Netlify build command
pnpm install --frozen-lockfile && pnpm run build
```

### Rule #5: Verify Before Committing
**Always run verification before committing.**

```bash
# Run lockfile verification
npm run verify-lockfile

# Run full pre-commit checks
npm run precommit
```

### Rule #6: Resolve Merge Conflicts Properly
**When you get merge conflicts in pnpm-lock.yaml:**

```bash
# ❌ WRONG: Manually edit pnpm-lock.yaml
# ❌ WRONG: Accept theirs or yours blindly

# ✅ CORRECT: Let pnpm regenerate it
git checkout --theirs package.json  # or --ours, depending on which is correct
git checkout --ours pnpm-lock.yaml  # temporarily accept one version
pnpm install  # regenerate lockfile
git add package.json pnpm-lock.yaml
git commit
```

### Rule #7: Keep pnpm Version Consistent
**Use the same pnpm version across all environments.**

```bash
# Check your pnpm version
pnpm --version

# If different from lockfileVersion 9.0, update pnpm
npm install -g pnpm@latest
```

---

## 🛠️ Automated Protection Systems

### 1. Pre-Commit Hook
**Location:** `.husky/pre-commit`

Automatically runs before every commit:
- ✅ Verifies lockfile integrity
- ✅ Checks if lockfile matches package.json
- ✅ Runs linting
- ❌ Blocks commit if checks fail

### 2. Lockfile Verification Script
**Location:** `scripts/verify-lockfile.cjs`

Run manually or in CI/CD:
```bash
npm run verify-lockfile
```

Checks:
- ✅ Files exist
- ✅ Lockfile is in sync
- ✅ No duplicate dependencies
- ✅ Correct lockfile version

### 3. Package.json Scripts

```json
{
  "verify-lockfile": "node scripts/verify-lockfile.cjs",
  "precommit": "node scripts/verify-lockfile.cjs && npm run lint",
  "prebuild": "node scripts/fix-duplicate-deps.cjs || true"
}
```

---

## 📋 Daily Workflow

### Adding a New Dependency

```bash
# 1. Add the dependency
pnpm add <package-name>

# 2. Verify lockfile (automatic check)
npm run verify-lockfile

# 3. Test your changes
npm run dev

# 4. Commit both files
git add package.json pnpm-lock.yaml
git commit -m "Add <package-name> dependency"
```

### Removing a Dependency

```bash
# 1. Remove the dependency
pnpm remove <package-name>

# 2. Verify lockfile (automatic check)
npm run verify-lockfile

# 3. Test your changes
npm run dev

# 4. Commit both files
git add package.json pnpm-lock.yaml
git commit -m "Remove <package-name> dependency"
```

### Updating Dependencies

```bash
# 1. Update dependencies
pnpm update

# 2. Verify lockfile
npm run verify-lockfile

# 3. Test thoroughly
npm run dev
npm run build

# 4. Commit both files
git add package.json pnpm-lock.yaml
git commit -m "Update dependencies"
```

### Before Pushing to Production

```bash
# 1. Verify lockfile
npm run verify-lockfile

# 2. Run full checks
npm run precommit

# 3. Build production
npm run build

# 4. If all pass, push
git push
```

---

## 🚀 CI/CD Configuration

### Netlify Build Settings

**Build command:**
```bash
pnpm install --frozen-lockfile && pnpm run build
```

**Why `--frozen-lockfile`?**
- Ensures lockfile matches package.json exactly
- Fails fast if there's a mismatch
- Prevents silent dependency changes in production

### GitHub Actions Example

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Verify lockfile
        run: npm run verify-lockfile
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Build
        run: pnpm run build
```

---

## 🔍 Troubleshooting

### Problem: "Lockfile is out of sync"

**Solution:**
```bash
# 1. Delete node_modules and lockfile
rm -rf node_modules pnpm-lock.yaml

# 2. Reinstall
pnpm install

# 3. Verify
npm run verify-lockfile

# 4. Commit the new lockfile
git add pnpm-lock.yaml
git commit -m "Regenerate lockfile"
```

### Problem: "Merge conflict in pnpm-lock.yaml"

**Solution:**
```bash
# 1. Accept one version of package.json (the correct one)
git checkout --theirs package.json  # or --ours

# 2. Discard lockfile conflict
git checkout --ours pnpm-lock.yaml

# 3. Regenerate lockfile
pnpm install

# 4. Verify
npm run verify-lockfile

# 5. Commit
git add package.json pnpm-lock.yaml
git commit -m "Resolve merge conflict"
```

### Problem: "Different lockfile version"

**Solution:**
```bash
# 1. Check pnpm version
pnpm --version

# 2. Update pnpm to match lockfile version
npm install -g pnpm@9

# 3. Regenerate lockfile
rm pnpm-lock.yaml
pnpm install

# 4. Verify
npm run verify-lockfile
```

### Problem: "Duplicate dependencies"

**Solution:**
```bash
# 1. Run fix script
npm run fix-deps

# 2. Verify
npm run verify-lockfile

# 3. Commit if changes were made
git add package.json pnpm-lock.yaml
git commit -m "Fix duplicate dependencies"
```

---

## ✅ Verification Checklist

Before every commit:
- [ ] Ran `npm run verify-lockfile`
- [ ] Both package.json and pnpm-lock.yaml are staged
- [ ] No manual edits to pnpm-lock.yaml
- [ ] All tests pass
- [ ] Build succeeds

Before every deploy:
- [ ] Ran `npm run verify-lockfile`
- [ ] Ran `npm run build`
- [ ] Tested in production-like environment
- [ ] Verified `--frozen-lockfile` works
- [ ] All CI/CD checks pass

---

## 📊 Monitoring

### Check Lockfile Status

```bash
# Quick check
npm run verify-lockfile

# Detailed check
pnpm install --frozen-lockfile

# Check for outdated packages
pnpm outdated
```

### Regular Maintenance

**Weekly:**
- [ ] Run `npm run verify-lockfile`
- [ ] Check for outdated dependencies
- [ ] Review dependency security alerts

**Monthly:**
- [ ] Update dependencies: `pnpm update`
- [ ] Regenerate lockfile: `rm pnpm-lock.yaml && pnpm install`
- [ ] Full regression testing

---

## 🎯 Success Metrics

**You're doing it right when:**
- ✅ No lockfile conflicts in the last 30 days
- ✅ CI/CD builds pass consistently
- ✅ `--frozen-lockfile` never fails
- ✅ No manual lockfile edits
- ✅ All team members follow the same workflow

**Red flags:**
- ❌ Frequent lockfile conflicts
- ❌ CI/CD builds fail due to lockfile issues
- ❌ Manual lockfile edits in git history
- ❌ Different pnpm versions across team
- ❌ Committing package.json without pnpm-lock.yaml

---

## 🔐 Security

### Why Lockfile Integrity Matters

1. **Reproducible Builds:** Same dependencies every time
2. **Security:** Prevents supply chain attacks
3. **Stability:** No surprise dependency changes
4. **Debugging:** Easier to track down issues
5. **Team Collaboration:** Everyone uses same versions

### Best Practices

- ✅ Always commit lockfile
- ✅ Use `--frozen-lockfile` in production
- ✅ Verify lockfile before deploying
- ✅ Keep pnpm version consistent
- ✅ Review dependency changes in PRs
- ✅ Use automated checks (pre-commit hooks)
- ✅ Monitor for security vulnerabilities

---

## 📚 Additional Resources

### Commands Reference

```bash
# Verify lockfile
npm run verify-lockfile

# Pre-commit checks
npm run precommit

# Install with frozen lockfile
pnpm install --frozen-lockfile

# Fix duplicate dependencies
npm run fix-deps

# Check dependencies
npm run check-deps

# Update dependencies
pnpm update

# Check outdated packages
pnpm outdated
```

### Files to Never Edit Manually

- ❌ `pnpm-lock.yaml` - Managed by pnpm
- ❌ `node_modules/` - Generated by pnpm
- ⚠️ `package.json` - Edit carefully, run `pnpm install` after

### Files to Always Commit Together

- ✅ `package.json` + `pnpm-lock.yaml`
- ✅ Never commit one without the other

---

## 🎉 Summary

**Follow these 7 golden rules and you'll NEVER have lockfile conflicts again:**

1. ✅ Never manually edit pnpm-lock.yaml
2. ✅ Always run `pnpm install` after changing package.json
3. ✅ Always commit both files together
4. ✅ Use `--frozen-lockfile` in CI/CD
5. ✅ Verify before committing
6. ✅ Resolve merge conflicts properly
7. ✅ Keep pnpm version consistent

**Automated protection:**
- ✅ Pre-commit hook verifies lockfile
- ✅ Verification script catches issues early
- ✅ CI/CD fails fast on mismatches

**Result:**
- 🎯 Zero lockfile conflicts
- 🚀 Reliable deployments
- 😊 Happy developers

---

**Last Updated:** 2025-12-26  
**Status:** ✅ PRODUCTION READY  
**Lockfile Version:** 9.0
