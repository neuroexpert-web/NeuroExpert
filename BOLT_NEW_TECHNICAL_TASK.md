# Technical Task: NeuroExpert AI Business Platform

## Project Overview
Create a modern AI-powered business automation platform with premium dark theme design, AI assistant integration, and ROI calculator.

## Core Technologies
- Next.js 14 with App Router
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion for animations
- Google Gemini API for AI assistant

## Key Features

### 1. Landing Page with Hero Section
- Premium dark gradient background (#0A051A to #1E293B)
- Animated neural network background effect
- Main headline: "NeuroExpert - AI для вашего бизнеса"
- Subheadline: "Увеличьте продажи на 40% за 3 месяца с помощью ИИ"
- CTA buttons: "Рассчитать ROI" and "Попробовать AI"
- Smooth scroll animations on appear

### 2. AI Assistant (Floating Chat)
- Floating chat bubble in bottom-right corner
- Chat interface with message history
- Integration with Google Gemini API
- Typing effect for AI responses
- Quick action buttons:
  - "Как увеличить продажи?"
  - "Автоматизация процессов"
  - "Расчет экономии"
- Store chat history in localStorage

### 3. ROI Calculator Component
- Interactive form with fields:
  - Business size (dropdown): Small/Medium/Large
  - Industry (dropdown): Retail/Services/IT/Manufacturing/Other
  - Current revenue (number input)
- Calculate button with hover effects
- Animated results display showing:
  - ROI percentage (with color coding: green if positive)
  - Estimated savings
  - Payback period
  - Revenue growth projection
- Results appear with slide-in animation

### 4. Features Section
- Grid layout with 6 feature cards
- Each card with:
  - Icon (use lucide-react icons)
  - Title
  - Description
  - Hover effect (lift and glow)
- Features to include:
  - "AI Аналитика" - Real-time business insights
  - "Автоматизация" - Process automation
  - "CRM Интеграция" - Customer management
  - "Отчетность" - Automated reporting
  - "Прогнозирование" - AI predictions
  - "24/7 Поддержка" - Round-the-clock assistance

### 5. Pricing Section
- 3 pricing tiers in card layout
- Starter: $299/month
- Professional: $799/month
- Enterprise: Custom pricing
- Each card with:
  - Features list with checkmarks
  - "Choose Plan" button
  - Most popular badge on Professional

### 6. Contact Form
- Fields: Name, Email, Phone, Message
- Animated submit button
- Success message with confetti animation
- Form validation with error messages

## Design Requirements

### Color Palette
```css
--background: #0A051A
--card-bg: #1A1F2E
--card-border: #2A2F3E
--primary: #3B82F6
--primary-hover: #2563EB
--accent: #10B981
--text-primary: #F3F4F6
--text-secondary: #9CA3AF
```

### Typography
- Font: Inter for headings, system font for body
- Heading sizes: 4rem, 2.5rem, 1.75rem, 1.25rem
- Body text: 1rem with 1.5 line height

### Animations
- All sections fade in on scroll
- Hover effects on all interactive elements
- Smooth transitions (0.3s ease)
- Loading states with skeleton screens
- Parallax scrolling for background elements

### Responsive Design
- Mobile-first approach
- Breakpoints: 640px, 768px, 1024px, 1280px
- Touch-friendly interface for mobile
- Hamburger menu for mobile navigation

## Technical Specifications

### API Routes
- `/api/assistant` - POST request to Gemini API
- `/api/contact` - POST request to save form data
- `/api/calculate-roi` - POST request for ROI calculations

### State Management
- Use React Context for global state
- Local state with useState for components
- Form handling with react-hook-form

### Performance Optimization
- Lazy load components with dynamic imports
- Optimize images with next/image
- Implement proper SEO with next/head
- Enable PWA capabilities

### Environment Variables
```
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

## Additional Requirements

### Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

### Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

### Deployment
- Optimized for Vercel deployment
- Environment variables configuration
- Proper error boundaries
- 404 and error pages

## Sample Code Structure
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── api/
│       ├── assistant/route.ts
│       └── contact/route.ts
├── components/
│   ├── Hero.tsx
│   ├── AIAssistant.tsx
│   ├── ROICalculator.tsx
│   ├── Features.tsx
│   ├── Pricing.tsx
│   └── ContactForm.tsx
├── lib/
│   ├── gemini.ts
│   └── utils.ts
└── types/
    └── index.ts
```

## Success Criteria
- Page loads in under 2 seconds
- Lighthouse score > 90
- Fully responsive on all devices
- Smooth animations at 60fps
- AI assistant responds within 3 seconds
- Form submissions work correctly
- ROI calculator provides accurate results

## Delivery
Single-page application ready for production deployment with all features fully functional and tested.