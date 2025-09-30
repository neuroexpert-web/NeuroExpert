# 🎨 Альтернативы v0.app для генерации UI

## 1. **Cursor Composer** (Встроен в Cursor)
- ✅ Уже есть в вашем редакторе
- ✅ Генерация компонентов через AI
- ✅ Поддержка React, Tailwind, TypeScript
- 💡 Используйте Cmd+K для генерации компонентов

## 2. **GitHub Copilot Chat**
- 🔗 https://github.com/features/copilot
- ✅ Интеграция с VS Code/Cursor
- ✅ Генерация целых компонентов
- 💰 $10/месяц

## 3. **Galileo AI**
- 🔗 https://www.usegalileo.ai/
- ✅ Генерация UI из текстовых описаний
- ✅ Экспорт в Figma
- ✅ Поддержка React компонентов

## 4. **Uizard**
- 🔗 https://uizard.io/
- ✅ AI-генерация дизайнов
- ✅ Превращение скетчей в UI
- ✅ Экспорт кода

## 5. **Framer AI**
- 🔗 https://www.framer.com/ai
- ✅ No-code платформа с AI
- ✅ Генерация целых сайтов
- ✅ Экспорт React кода

## 6. **Builder.io**
- 🔗 https://www.builder.io/
- ✅ Visual development platform
- ✅ AI-powered design-to-code
- ✅ Интеграция с React/Next.js

## 7. **Locofy.ai**
- 🔗 https://www.locofy.ai/
- ✅ Figma to React/Next.js
- ✅ AI оптимизация кода
- ✅ Поддержка Tailwind CSS

## 8. **MakeReal by tldraw**
- 🔗 https://makereal.tldraw.com/
- ✅ Рисуете UI → получаете код
- ✅ Работает с OpenAI API
- ✅ Экспорт HTML/CSS/JS

## 9. **Screenshot to Code**
- 🔗 https://github.com/abi/screenshot-to-code
- ✅ Open source
- ✅ Скриншот → React/Tailwind код
- ✅ Поддержка GPT-4 Vision

## 10. **Penpot** (Open Source)
- 🔗 https://penpot.app/
- ✅ Бесплатная альтернатива Figma
- ✅ Плагины для генерации кода
- ✅ Самостоятельный хостинг

## 🚀 Рекомендация для NeuroExpert:

### Оптимальный стек:
1. **Cursor Composer** - для быстрой генерации компонентов
2. **Shadcn/ui** - готовые компоненты (уже подключен)
3. **Tailwind UI** - премиум компоненты
4. **Framer Motion** - анимации (уже используется)

### Workflow:
```bash
# 1. Генерация компонента в Cursor
Cmd+K → "Create a premium pricing card with glassmorphism effect"

# 2. Использование Shadcn компонентов
npx shadcn-ui@latest add card button dialog

# 3. Добавление анимаций
import { motion } from 'framer-motion'
```

## 📝 Шаблон промпта для генерации UI:

```
Create a [component name] with:
- Modern glassmorphism design
- Dark theme with #0b0f17 background
- Gradient accents (#667eea to #764ba2)
- Framer Motion animations
- Responsive design
- Tailwind CSS classes
- TypeScript interfaces
```