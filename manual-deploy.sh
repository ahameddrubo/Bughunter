#!/bin/bash

# BugHunter Lab - Manual GitHub Pages Deployment
# Use this if GitHub Actions is not working

set -e

echo "🚨 Manual GitHub Pages Deployment"
echo "================================="

# Check if we're in the right directory
if [ ! -d "frontend" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

echo "📦 Installing dependencies..."
cd frontend
npm install

echo "🔨 Building the project..."
npm run build

echo "📁 Copying files to root for GitHub Pages..."
cd ..

# Create a temporary directory for GitHub Pages files
mkdir -p gh-pages-temp

# Copy all dist files to temp directory
cp -r frontend/dist/* gh-pages-temp/

# Create or update .nojekyll file
touch gh-pages-temp/.nojekyll

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: This is not a git repository. Please run 'git init' first."
    exit 1
fi

# Check if gh-pages branch exists
if git show-ref --verify --quiet refs/heads/gh-pages; then
    echo "📤 Updating existing gh-pages branch..."
    git checkout gh-pages
else
    echo "🌟 Creating new gh-pages branch..."
    git checkout --orphan gh-pages
fi

# Clear the gh-pages branch
git rm -rf . 2>/dev/null || true

# Copy files from temp directory
cp -r gh-pages-temp/* .
cp gh-pages-temp/.nojekyll .

# Clean up temp directory
rm -rf gh-pages-temp

# Add and commit files
git add .
git commit -m "Deploy BugHunter Lab to GitHub Pages"

echo "📤 Pushing to GitHub..."
git push -u origin gh-pages

# Switch back to main branch
git checkout main

echo "✅ Manual deployment completed!"
echo "🌐 Your site should be available at:"
echo "   https://$(git config remote.origin.url | sed 's/.*github\.com[:/]\([^.]*\)\.git/\1/' | tr '[:upper:]' '[:lower:]' | sed 's/\//.github.io\//')"
echo ""
echo "Note: It may take 5-10 minutes for changes to be visible."
echo "📝 Go to Repository Settings > Pages and ensure Source is set to 'gh-pages branch'"