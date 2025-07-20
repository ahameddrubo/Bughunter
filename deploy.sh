#!/bin/bash

# BugHunter Lab - GitHub Pages Deployment Script
# Usage: ./deploy.sh

set -e

echo "🚀 BugHunter Lab GitHub Pages Deployment"
echo "========================================"

# Check if we're in the right directory
if [ ! -d "frontend" ]; then
    echo "❌ Error: frontend directory not found. Please run this script from the project root."
    exit 1
fi

# Navigate to frontend directory
cd frontend

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building the project..."
npm run build

echo "📤 Deploying to GitHub Pages..."
npm run deploy

echo "✅ Deployment completed!"
echo "🌐 Your site will be available at:"
echo "   https://yourusername.github.io/bughunter-lab"
echo ""
echo "Note: It may take a few minutes for the changes to be visible."
echo "📝 Don't forget to update the homepage URL in package.json with your actual GitHub username!"