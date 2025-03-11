# Edunéxia Communication Module Design System

This document provides an overview of the design system for the Edunéxia Communication Module, featuring a blue, black, and white color palette with modern gradients for depth and visual appeal.

## Color Palette

The color system is based on a primary blue palette, complemented by neutral tones and semantic colors for specific UI states.

### Primary Colors
- Primary Blue: `#0072ff` (Main brand color)
- Secondary Blue: `#00c3ff` (Complementary color)

### Neutral Colors
- White: `#ffffff`
- Light Gray: `#f8f9fa` to `#e9ecef`
- Medium Gray: `#adb5bd` to `#6c757d`
- Dark Gray: `#495057` to `#343a40`
- Black: `#212529`

### Semantic Colors
- Success: `#10b981`
- Warning: `#f59e0b`
- Error: `#ef4444`
- Info: `#3b82f6`

### Accent Colors
- Purple: `#6e56cf`
- Indigo: `#4263eb`
- Cyan: `#0dcaf0`

## Typography

The typography system uses a clean, modern sans-serif font stack with carefully defined sizes, weights, and line heights for optimal readability.

### Font Family
- Primary: Inter, system-ui, sans-serif
- Monospace: Consolas, Monaco, monospace

### Font Sizes
- Heading 1: 2.25rem (36px)
- Heading 2: 1.875rem (30px)
- Heading 3: 1.5rem (24px)
- Heading 4: 1.25rem (20px)
- Body Large: 1.125rem (18px)
- Body: 1rem (16px)
- Body Small: 0.875rem (14px)
- Caption: 0.75rem (12px)

### Font Weights
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

## Gradients

Gradients are used strategically to add depth and modern aesthetics to UI elements.

### Primary Gradient
- `linear-gradient(135deg, #0072ff 0%, #00c3ff 100%)`

### Dark Gradient
- `linear-gradient(135deg, #212529 0%, #343a40 100%)`

### Card Gradient
- `linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)`

### Accent Gradient
- `linear-gradient(135deg, #0072ff 0%, #6e56cf 100%)`

## Components

### Buttons
- Primary: Solid blue with hover state
- Secondary: Lighter blue with hover state
- Outline: Transparent with blue border
- Ghost: Transparent with hover state

### Cards
- Basic: White background with subtle shadow
- Gradient: Subtle gradient background
- Interactive: With hover effects
- Featured: With accent border or header

### Navigation
- Main Header: With logo and navigation links
- Sidebar: Vertical navigation for desktop layouts
- Breadcrumbs: For page hierarchy
- Tabs: For switching between related content

### Forms
- Text Inputs: With labels and validation states
- Select Dropdowns: For choosing from options
- Checkboxes and Radio Buttons: For selections
- Toggle Switches: For binary options

### Icons
- UI Icons: For common actions
- Navigation Icons: For navigation elements
- Communication Icons: For communication features
- Status Icons: For indicating status

## Layout System

### Dashboard Layout
- Sidebar navigation with main content area

### Content Layout
- Header with main content area

### Card Grid Layout
- For displaying multiple cards in a grid

### Split Layout
- For side-by-side content

## Responsive Design

The design system is built to be fully responsive, adapting to different screen sizes:

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Dark Mode Support

All components support both light and dark modes, with carefully selected color mappings to ensure readability and visual harmony in both themes.

## Usage Guidelines

1. Maintain consistent spacing using the spacing scale
2. Use the defined color palette for all UI elements
3. Follow typography guidelines for text hierarchy
4. Apply gradients sparingly for emphasis
5. Ensure all interactive elements have clear hover/focus states
6. Support both light and dark modes

## Implementation

The design system is implemented using:

- Tailwind CSS for utility classes
- CSS variables for theming
- React components for UI elements
- Next.js for application framework

Custom CSS files:
- `colors.ts`: Color definitions
- `gradients.css`: Gradient utilities
- `navigation.css`: Navigation styles
- `theme.css`: Theme variables
- `design-system.css`: Combined styles

## Design Tokens

Design tokens are implemented as CSS variables for consistent theming:

```css
:root {
  --color-primary-500: #0072ff;
  --color-secondary-500: #00c3ff;
  --color-neutral-900: #212529;
  --color-neutral-100: #f8f9fa;
  /* ... other tokens */
}
```

These tokens are used throughout the application to maintain visual consistency.
