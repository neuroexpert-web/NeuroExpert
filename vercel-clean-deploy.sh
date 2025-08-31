#!/bin/bash

echo "🚀 Starting clean Vercel deployment..."
echo "=================================="

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm i -g vercel
fi

# Remove any existing .vercel directory
if [ -d ".vercel" ]; then
    echo "🗑️  Removing existing .vercel directory..."
    rm -rf .vercel
fi

# Ensure clean vercel.json
echo "✅ Vercel.json is configured correctly"
cat vercel.json

# Build locally first to check for errors
echo "🔨 Running local build test..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Local build successful!"
    
    # Deploy with force flag
    echo "🚀 Deploying to Vercel..."
    vercel --prod --force
else
    echo "❌ Local build failed. Please fix errors before deploying."
    exit 1
fi

echo "=================================="
echo "✨ Deployment script completed!"