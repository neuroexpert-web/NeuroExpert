#!/bin/bash

# Скрипт для сборки на Vercel с правильными настройками

echo "🚀 Starting Vercel build..."

# Удаляем старые lock файлы
rm -f package-lock.json
rm -f yarn.lock
rm -f pnpm-lock.yaml

# Устанавливаем зависимости с legacy peer deps
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Запускаем сборку
echo "🔨 Building project..."
npm run build

echo "✅ Build completed!"