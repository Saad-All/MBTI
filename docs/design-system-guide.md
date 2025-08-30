# MBTI Platform Design System Guide

This guide documents the design system implementation and provides usage guidelines for maintaining visual consistency across the MBTI assessment platform.

## Table of Contents
1. [Color System](#color-system)
2. [Typography](#typography)
3. [Spacing & Layout](#spacing--layout)
4. [Components](#components)
5. [Animation System](#animation-system)
6. [Responsive Design](#responsive-design)
7. [Dark Mode](#dark-mode)
8. [RTL/LTR Support](#rtlltr-support)
9. [Best Practices](#best-practices)

## Color System

### Primary Colors
- **Primary Blue (#2563eb)**: Main brand color for CTAs, links, and MBTI type highlights
- **Secondary Dark (#0f172a)**: Headers, body text, professional emphasis
- **Accent Purple (#8b5cf6)**: Interactive elements, format selection highlights

### Semantic Colors
```css
/* Success States */
--success: #059669;  /* Positive feedback, completion states */

/* Warning States */
--warning: #d97706;  /* Important notices, attention states */

/* Error States */
--error: #dc2626;    /* Validation failures, errors */

/* Neutral Grays */
--neutral-50 to --neutral-950;  /* Text hierarchy, backgrounds */
```

### Usage Examples
```tsx
// Button with primary color
<Button variant="primary">Continue Assessment</Button>

// Success message
<Text className="text-success-600">Assessment saved successfully!</Text>

// Error state
<Card variant="error">Please select exactly 5 points</Card>
```

## Typography

### Font Stack
- **Latin Text**: Inter (primary), system fonts (fallback)
- **Arabic Text**: IBM Plex Sans Arabic, Noto Sans Arabic
- **MBTI Codes**: JetBrains Mono (always LTR)

### Type Scale
```tsx
// Heading hierarchy
<H1>Assessment Title</H1>           // 36px, weight 700
<H2>Section Header</H2>             // 30px, weight 600
<H3>Question Title</H3>             // 24px, weight 600

// Body text
<Text>Regular body text</Text>      // 16px, weight 400
<Text variant="small">Helper</Text> // 14px, weight 400

// MBTI Type Display (always LTR)
<MBTICode code="INTJ" size="large" />
```

### Arabic Typography
```tsx
// Automatic font switching based on language
<div className={language === 'ar' ? 'font-arabic' : 'font-sans'}>
  <Text>{content}</Text>
</div>
```

## Spacing & Layout

### 4px Base Unit System
```css
spacing-1: 4px
spacing-2: 8px
spacing-4: 16px
spacing-6: 24px
spacing-8: 32px
spacing-12: 48px
spacing-16: 64px
```

### Layout Components
```tsx
// Page layout with consistent spacing
<PageLayout containerSize="lg" centered>
  <Card className="p-8 md:p-10">
    <H2 className="mb-8">Question</H2>
    <div className="space-y-4">
      {/* Content */}
    </div>
  </Card>
</PageLayout>

// Grid layouts
<div className="grid md:grid-cols-3 gap-4">
  {/* Format selection cards */}
</div>
```

## Components

### Core UI Components

#### Button
```tsx
// Variants
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Cancel</Button>
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>

// States
<Button disabled>Disabled</Button>
<Button loading>Loading...</Button>
<Button fullWidth>Full Width</Button>
```

#### Card
```tsx
// Variants
<Card>Default card</Card>
<Card variant="interactive" onClick={handleClick}>Clickable</Card>
<Card variant="selected">Selected state</Card>

// With consistent padding
<Card className="p-6 md:p-8">
  {/* Content */}
</Card>
```

#### Progress Bar
```tsx
<ProgressBar 
  current={currentQuestion}
  total={totalQuestions}
  showLabel
  labelText="Assessment Progress"
/>
```

### Assessment Components

#### Question Card
```tsx
<QuestionCard 
  question="How do you prefer to work?"
  questionIndex={currentIndex}
>
  <BinaryChoice
    optionA="Independently"
    optionB="In a team"
    onSelect={handleSelection}
  />
</QuestionCard>
```

#### SAIS Distribution
```tsx
<SAISDistribution
  optionA="Focus on details"
  optionB="See the big picture"
  optionATendency="S"
  optionBTendency="N"
  onDistribute={(a, b) => handleDistribution(a, b)}
/>
```

## Animation System

### Animation Timings (from spec)
```typescript
const ANIMATION_TIMINGS = {
  questionTransition: 300,  // ms, ease-out
  pointAllocation: 150,     // ms, ease-in-out
  progressUpdate: 400,      // ms, ease-in-out
  resultsReveal: 2000,      // ms, ease-in-out
  formatSelection: 200,     // ms, ease-out
}
```

### Usage Examples
```tsx
// Question transitions
<div className="animate-slide-in-right">
  <QuestionCard>{/* ... */}</QuestionCard>
</div>

// Format selection feedback
<Card className="transition-all duration-200 hover:scale-105">
  {/* Format option */}
</Card>

// Results reveal
<AnimatedReveal duration={2000}>
  <TypeReveal type="INTJ" />
</AnimatedReveal>
```

### Respecting User Preferences
```tsx
// Animations automatically disabled when prefers-reduced-motion
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Responsive Design

### Breakpoints
```css
mobile:  320px - 767px     /* Smartphones */
tablet:  768px - 1023px    /* iPads, tablets */
desktop: 1024px - 1439px   /* Laptops */
wide:    1440px+           /* Large monitors */
```

### Mobile-First Approach
```tsx
// Base mobile styles, enhanced for larger screens
<div className="p-4 md:p-6 lg:p-8">
  <H2 className="text-h3 md:text-h2">Responsive Heading</H2>
</div>

// Touch-friendly targets
<Button className="min-h-[44px] touch-target">
  Mobile Optimized
</Button>
```

## Dark Mode

### Implementation
```tsx
// Automatic dark mode support in components
<Card className="bg-white dark:bg-dark-card">
  <Text className="text-neutral-900 dark:text-dark-text-primary">
    Content adapts to theme
  </Text>
</Card>

// Using semantic color classes
<div className="bg-surface-primary dark:bg-surface-secondary">
  <p className="text-content-primary dark:text-content-primary-dark">
    Semantic colors maintain proper contrast
  </p>
</div>
```

## RTL/LTR Support

### Directional Utilities
```tsx
// Start/End utilities for padding and margins
<div className="ps-4 pe-6">  // padding-start/end
  <span className="ms-2">Icon</span>  // margin-start
</div>

// RTL-aware borders
<div className="border-start-2 border-primary">
  Sidebar content
</div>

// MBTI codes always LTR
<span dir="ltr" className="font-mono">
  ENFP
</span>
```

### Arabic Layout Patterns
```tsx
// Automatic RTL for Arabic
<div className={language === 'ar' ? 'rtl' : 'ltr'}>
  <Card className="flex items-center gap-4 rtl:flex-row-reverse">
    <Icon />
    <Text>{content}</Text>
  </Card>
</div>
```

## Best Practices

### 1. Component Consistency
- Always use design system components instead of custom implementations
- Apply consistent spacing using the 4px grid system
- Use semantic color variables for maintainability

### 2. Typography Guidelines
- Use the established type hierarchy (H1, H2, H3, Text)
- Ensure MBTI codes are always displayed in LTR with monospace font
- Apply proper line heights for readability

### 3. Interactive States
- Provide clear hover, focus, and active states
- Ensure 44px minimum touch targets on mobile
- Use consistent transition durations (200-300ms)

### 4. Performance Considerations
- Use CSS animations instead of JavaScript when possible
- Respect prefers-reduced-motion settings
- Optimize images and lazy load non-critical assets

### 5. Accessibility
- Maintain WCAG 2.1 AA color contrast ratios
- Provide proper ARIA labels for screen readers
- Ensure keyboard navigation works correctly

### 6. Testing Checklist
- [ ] Components render correctly in light/dark modes
- [ ] RTL layout works properly for Arabic content
- [ ] Animations perform at 60fps on mobile
- [ ] Touch targets meet 44px minimum
- [ ] Color contrast passes accessibility checks
- [ ] Responsive breakpoints work as expected

## Component Testing Examples

```tsx
// Testing responsive behavior
it('should adapt layout for mobile screens', () => {
  render(<FormatSelector />)
  
  // Mobile: stacked layout
  expect(screen.getByRole('grid')).toHaveClass('grid-cols-1')
  
  // Desktop: 3-column layout
  window.resizeTo(1024, 768)
  expect(screen.getByRole('grid')).toHaveClass('md:grid-cols-3')
})

// Testing RTL support
it('should flip layout for Arabic', () => {
  const { rerender } = render(<QuestionCard language="en" />)
  expect(container).not.toHaveClass('rtl')
  
  rerender(<QuestionCard language="ar" />)
  expect(container).toHaveClass('rtl')
})
```

## Migration Guide

When updating existing components to use the design system:

1. Replace hardcoded colors with design tokens
2. Update spacing to use the 4px grid system
3. Apply proper typography components
4. Add dark mode support
5. Ensure RTL compatibility
6. Test responsive behavior

Example migration:
```tsx
// Before
<div style={{ padding: '20px', color: '#333' }}>
  <h2 style={{ fontSize: '24px' }}>Title</h2>
</div>

// After
<Card className="p-5">
  <H2 className="text-content-primary">Title</H2>
</Card>
```

## Resources

- Design System Specification: `/docs/front-end-spec.md`
- Component Examples: `/src/components/ui/`
- Tailwind Config: `/tailwind.config.ts`
- Global Styles: `/src/app/globals.css`