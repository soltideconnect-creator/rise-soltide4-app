#!/bin/bash

# Deployment Script for Rise App
# This script will push changes to GitHub and trigger Netlify deployment

echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║                                                                      ║"
echo "║                  🚀 DEPLOYING CACHE FIX 🚀                           ║"
echo "║                                                                      ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in project directory"
    exit 1
fi

# Check git status
echo "📊 Checking git status..."
git status --short
echo ""

# Show commits to be pushed
echo "📦 Commits to be pushed:"
git log origin/master..HEAD --oneline
echo ""

# Confirm push
read -p "🔍 Push these commits to GitHub? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Pushing to GitHub..."
    git push origin master
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Successfully pushed to GitHub!"
        echo ""
        echo "📡 Netlify will automatically deploy in 1-2 minutes"
        echo "🌐 Check deployment: https://app.netlify.com"
        echo "🔗 Live site: https://rise-soltide-app.netlify.app/"
        echo ""
        echo "✅ Cache issue will be permanently fixed after deployment!"
    else
        echo ""
        echo "❌ Push failed. Please check your GitHub credentials."
        echo ""
        echo "💡 Alternative: Use GitHub Desktop or VS Code to push"
    fi
else
    echo "❌ Push cancelled"
fi
