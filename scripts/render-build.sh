#!/bin/bash

echo "🚀 Starting Render build process..."

# Проверка версии Node.js
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Очистка кэша npm если нужно
echo "📦 Cleaning npm cache..."
npm cache clean --force

# Установка зависимостей
echo "📦 Installing dependencies..."
npm ci --production=false

# Проверка установки next
echo "🔍 Checking Next.js installation..."
if [ -f "node_modules/.bin/next" ]; then
    echo "✅ Next.js found at node_modules/.bin/next"
else
    echo "❌ Next.js not found, trying to install..."
    npm install next@latest
fi

# Сборка проекта
echo "🔨 Building Next.js project..."
npm run build

# Проверка результата
if [ -d ".next" ]; then
    echo "✅ Build successful!"
    ls -la .next/
else
    echo "❌ Build failed - .next directory not found"
    exit 1
fi

echo "🎉 Render build completed successfully!"