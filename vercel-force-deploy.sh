#!/bin/bash

# Vercel Force Deploy Script
echo "🚀 Starting force deployment to Vercel..."

# Method 1: Install Vercel CLI and deploy
echo "📦 Installing Vercel CLI..."
npm install -g vercel@latest

# Method 2: Login and deploy
echo "🔐 Starting Vercel deployment..."
npx vercel --prod --yes --force

echo "✅ Force deployment initiated!"
echo "🔍 Check https://vercel.com/dashboard for deployment status"