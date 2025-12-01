#!/bin/bash

# Rise - Launch Script
# This script prepares and deploys your app to production

set -e

echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║                                                                   ║"
echo "║              🚀 Rise - Launch Script 🚀                           ║"
echo "║                                                                   ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Validate dependencies
echo "📦 Step 1/5: Validating dependencies..."
npm run check-deps
if [ $? -ne 0 ]; then
    echo "❌ Dependency validation failed!"
    exit 1
fi
echo "✅ Dependencies are clean"
echo ""

# Step 2: Run linting
echo "🔍 Step 2/5: Running linting..."
npm run lint > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "⚠️  Linting found issues (non-blocking)"
else
    echo "✅ Linting passed"
fi
echo ""

# Step 3: Build application
echo "🏗️  Step 3/5: Building application..."
npm run build > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi
echo "✅ Build successful"
echo ""

# Step 4: Check git status
echo "📝 Step 4/5: Checking git status..."
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes:"
    git status --short
    echo ""
    read -p "Do you want to commit these changes? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter commit message: " commit_msg
        git add -A
        git commit -m "$commit_msg"
        echo "✅ Changes committed"
    fi
else
    echo "✅ No uncommitted changes"
fi
echo ""

# Step 5: Push to GitHub
echo "🚀 Step 5/5: Pushing to GitHub..."
COMMITS=$(git rev-list --count HEAD ^origin/master 2>/dev/null || echo "0")
echo "📊 Commits ready to push: $COMMITS"
echo ""

if [ "$COMMITS" = "0" ]; then
    echo "✅ Already up to date with remote"
else
    read -p "Push $COMMITS commits to GitHub? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git push origin master
        echo "✅ Pushed to GitHub successfully!"
        echo ""
        echo "🎉 Deployment initiated!"
        echo "📍 Netlify will automatically build and deploy your app"
        echo "⏱️  Expected deployment time: ~2 minutes"
        echo ""
        echo "Next steps:"
        echo "1. Check Netlify dashboard for build status"
        echo "2. Test your live site"
        echo "3. Share with users!"
    else
        echo "⏸️  Push cancelled"
    fi
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║                                                                   ║"
echo "║                    ✅ Launch Script Complete! ✅                  ║"
echo "║                                                                   ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
