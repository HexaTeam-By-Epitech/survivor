# JEB Incubator

A modern, responsive web application for JEB Incubator built with Vue 3, TypeScript, and Vite. Features a dark theme with pink-to-violet gradients, adaptive navigation, and production-ready architecture.

## 🚀 Features

- **Responsive Design**: Adaptive navigation (bottom/side/top nav) based on screen size
- **Modern UI**: Dark theme with pink-to-violet gradients matching the brand
- **Accessibility**: WCAG AA compliant with keyboard navigation and screen reader support
- **Performance**: Optimized images, lazy loading, and code splitting
- **Type Safety**: Strict TypeScript implementation throughout
- **Testing**: Unit tests with Vitest and E2E tests with Playwright

## 🛠️ Tech Stack

- **Framework**: Vue 3 with Composition API
- **Language**: TypeScript (strict mode)
- **Build Tool**: Vite
- **Routing**: Vue Router
- **State Management**: Pinia
- **Icons**: Lucide Vue Next
- **Testing**: Vitest + Playwright
- **Linting**: ESLint + Prettier

## 📱 Responsive Breakpoints

- **Mobile** (≤639px): Bottom navigation with compact cards
- **Tablet** (640px-1023px): Side navigation with 2-column grid
- **Desktop** (≥1024px): Top navigation with 3-column grid

## 🎨 Design System

The application uses a comprehensive design token system defined in `src/styles/tokens.css`. All colors, spacing, typography, and other design properties are centralized for easy maintenance and theming.

### Color Palette
- **Background**: Dark theme (#0f0f14)
- **Primary**: Purple gradient (#c084fc to #9350f4)  
- **Accent**: Pink gradient (#f472b6 to #e11d74)
- **Surfaces**: Layered dark surfaces with gradients

### Typography
- **Font**: Inter (Google Fonts)
- **Scales**: Consistent type scale from --fs-xs (12px) to --fs-3xl (36px)
- **Line Heights**: --lh-tight (1.15) for headings, --lh-base (1.5) for body

### Spacing
- **System**: 8px base grid from --space-1 (4px) to --space-12 (48px)
- **Borders**: Rounded corners using --radius-sm to --radius-xl

## 📁 Project Structure

```
src/
├── app/                 # Application core
│   ├── layouts/         # Layout components
│   ├── router.ts        # Vue Router configuration
│   └── store/           # Pinia store modules
├── components/          # UI components (Atomic Design)
│   ├── atoms/           # Basic building blocks
│   ├── molecules/       # Simple combinations
│   └── organisms/       # Complex components
├── pages/               # Route components
├── composables/         # Vue composables
├── types/               # TypeScript definitions
├── styles/              # Global styles & design tokens
└── assets/              # Static assets
```

## 🚦 Getting Started

### Prerequisites
- Node.js 16+ 
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd jeb-incubator

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:ui` - Run tests with UI
- `npm run test:e2e` - Run E2E tests  
- `npm run lint` - Lint and fix code
- `npm run typecheck` - Type checking

## 🎯 Key Pages

- **Home** (`/`): Hero mission section with featured companies
- **Discover** (`/discover`): Browse all companies with filtering
- **Search** (`/search`): Search companies by name, tags, or description
- **Profile** (`/profile`): User profile and portfolio

## ♿ Accessibility

- **Keyboard Navigation**: Full tab support with visible focus indicators
- **Screen Readers**: Semantic HTML with ARIA labels and descriptions
- **Color Contrast**: WCAG AA compliant contrast ratios
- **Motion**: Respects `prefers-reduced-motion` for animations
- **Skip Links**: Direct navigation to main content

## 🎨 Customizing the Theme

To customize the design tokens, edit `src/styles/tokens.css`:

```css
:root {
  /* Update colors */
  --color-primary-500: #your-color;
  --gradient-hero: linear-gradient(135deg, #color1 0%, #color2 100%);
  
  /* Update spacing */
  --space-4: 20px; /* Change from default 16px */
  
  /* Update typography */
  --font-sans: "Your Font", system-ui, sans-serif;
}
```

The entire application will automatically update to reflect your changes.

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests  
```bash
npm run test:e2e
```

Tests cover:
- Component rendering and props
- Navigation functionality
- Search filtering
- Accessibility compliance

## 📈 Performance

- **Lighthouse Score**: Targets ≥90 in all categories
- **Image Optimization**: Responsive images with `srcset` and lazy loading
- **Code Splitting**: Route-based splitting for optimal loading
- **Tree Shaking**: Unused code elimination in production builds

## 🌐 Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- Mobile browsers with equivalent engine versions

## 🤝 Contributing

1. Follow the established code style (ESLint + Prettier)
2. Write tests for new features
3. Ensure accessibility compliance
4. Update documentation as needed

## 📄 License

This project is licensed under the MIT License.