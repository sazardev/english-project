# English Project - Logo System Documentation

## Overview

This document describes the complete logo system for the English Project learning platform. The design is minimalist, modern, and represents the educational nature of the project with clean SVG graphics.

## Logo Variants

### 1. Main Logo (`/public/logo.svg`)

- **Size**: 120x120px
- **Usage**: Large displays, home page, promotional materials
- **Features**:
  - Full circular design with blue gradient
  - Open book symbol representing education
  - "ENGLISH" text banner
  - Decorative elements suggesting community
  - Modern glassmorphism effects

### 2. Favicon (`/public/favicon.svg`)

- **Size**: 32x32px
- **Usage**: Browser tabs, bookmarks, PWA icon
- **Features**:
  - Simplified book icon optimized for small sizes
  - "EN" text badge for English focus
  - Same color scheme as main logo

### 3. Header Icon (`/public/icon-header.svg`)

- **Size**: 24x24px
- **Usage**: Website header navigation
- **Features**:
  - Ultra-minimalist book design
  - "EN" text badge
  - Optimized for inline use

## Design System

### Colors

- **Primary Blue**: `#3b82f6`
- **Secondary Blue**: `#1d4ed8`
- **White/Light**: `#ffffff` to `#f1f5f9`
- **Accent**: Gradients using primary colors

### Symbolism

- **Open Book**: Represents learning and education
- **"EN" Letters**: English language focus
- **Circular Shape**: Completeness and community
- **Text Lines**: Content and knowledge sharing

### Typography

- **Font**: System fonts (system-ui, sans-serif)
- **Weight**: Bold for brand text, medium for secondary text
- **Style**: Clean, modern, highly legible

## Implementation

### Header Component

The header uses the icon-header.svg file:

```astro
<img src="/icon-header.svg" alt="English Project Logo" width="24" height="24" />
```

### CSS Styling

```css
.brand-icon {
  display: flex;
  align-items: center;
  width: 24px;
  height: 24px;
  transition: transform var(--transition-normal);
}

.brand-icon svg,
.brand-icon img {
  width: 100%;
  height: 100%;
}

.brand-link:hover .brand-icon {
  transform: scale(1.1);
}
```

## Usage Guidelines

### Do's

✅ Use the appropriate logo variant for the context
✅ Maintain proper spacing around logos
✅ Keep the original aspect ratio
✅ Use on backgrounds that provide good contrast

### Don'ts

❌ Don't stretch or distort the logos
❌ Don't change the colors outside the design system
❌ Don't add effects that compromise readability
❌ Don't use on backgrounds with poor contrast

## File Structure

```
/public/
├── logo.svg          # Main logo (120x120)
├── favicon.svg       # Browser favicon (32x32)
└── icon-header.svg   # Header icon (24x24)
```

## Accessibility

- All logos include proper alt text
- High contrast ratios maintained
- SVG format ensures scalability
- Semantic markup used throughout

## Future Considerations

- Dark mode variants could be added
- Additional sizes for specific use cases
- Animation variants for loading states
- Brand guidelines for third-party usage

---

_Last updated: June 2025_
