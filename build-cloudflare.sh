#!/bin/bash

echo "🚀 Starting Cloudflare Pages build..."

# Проверка окружения
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Current directory: $(pwd)"

# Установка зависимостей
echo "📦 Installing dependencies..."
npm ci --production=false

# Сборка проекта
echo "🔨 Building Next.js project..."
npm run build

# Проверка результата сборки
if [ -d ".next" ]; then
    echo "✅ Build successful! .next directory found"
    ls -la .next/
else
    echo "❌ Build failed! .next directory not found"
    exit 1
fi

echo "🎉 Cloudflare Pages build completed!"