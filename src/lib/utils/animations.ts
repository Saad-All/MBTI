/**
 * Animation utility functions and constants
 * Based on design system specifications from front-end-spec.md
 */

// Animation timing constants from specification
export const ANIMATION_TIMINGS = {
  questionTransition: 300, // ms, ease-out
  pointAllocation: 150,    // ms, ease-in-out
  progressUpdate: 400,     // ms, ease-in-out
  resultsReveal: 2000,     // ms, ease-in-out
  formatSelection: 200,    // ms, ease-out
  default: 300,            // ms, default timing
} as const

// Animation easing functions
export const ANIMATION_EASINGS = {
  easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.6, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  spring: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
} as const

// CSS transition values
export const TRANSITIONS = {
  questionTransition: `all ${ANIMATION_TIMINGS.questionTransition}ms ${ANIMATION_EASINGS.easeOut}`,
  pointAllocation: `all ${ANIMATION_TIMINGS.pointAllocation}ms ${ANIMATION_EASINGS.easeInOut}`,
  progressUpdate: `all ${ANIMATION_TIMINGS.progressUpdate}ms ${ANIMATION_EASINGS.easeInOut}`,
  resultsReveal: `all ${ANIMATION_TIMINGS.resultsReveal}ms ${ANIMATION_EASINGS.easeInOut}`,
  formatSelection: `all ${ANIMATION_TIMINGS.formatSelection}ms ${ANIMATION_EASINGS.easeOut}`,
} as const

// Check if user prefers reduced motion
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Animation duration based on user preference
export const getAnimationDuration = (duration: number): number => {
  return prefersReducedMotion() ? 0 : duration
}

// CSS transition value based on user preference
export const getTransition = (transition: string): string => {
  return prefersReducedMotion() ? 'none' : transition
}

// Haptic feedback for mobile devices
export const triggerHapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  if ('vibrate' in navigator) {
    const patterns = {
      light: 10,
      medium: 20,
      heavy: 30,
    }
    navigator.vibrate(patterns[type])
  }
}

// RTL-aware animation directions
export const getSlideDirection = (isRTL: boolean, direction: 'next' | 'prev') => {
  const multiplier = direction === 'next' ? 1 : -1
  const rtlMultiplier = isRTL ? -1 : 1
  return multiplier * rtlMultiplier
}

// Animation class names for Tailwind
export const ANIMATION_CLASSES = {
  fadeIn: 'animate-fade-in',
  fadeOut: 'animate-fade-out',
  slideInLeft: 'animate-slide-in-left',
  slideInRight: 'animate-slide-in-right',
  slideOutLeft: 'animate-slide-out-left',
  slideOutRight: 'animate-slide-out-right',
  scaleIn: 'animate-scale-in',
  scaleOut: 'animate-scale-out',
  spin: 'animate-spin',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce',
} as const

// Performance monitoring for animations
export const monitorAnimationPerformance = (callback: () => void, targetFPS = 60) => {
  let lastTime = performance.now()
  let frameCount = 0
  let fps = 0
  
  const frame = (currentTime: number) => {
    frameCount++
    const deltaTime = currentTime - lastTime
    
    if (deltaTime >= 1000) {
      fps = Math.round((frameCount * 1000) / deltaTime)
      frameCount = 0
      lastTime = currentTime
      
      if (fps < targetFPS * 0.9) {
        console.warn(`Animation performance degraded: ${fps} FPS`)
      }
    }
    
    callback()
    requestAnimationFrame(frame)
  }
  
  requestAnimationFrame(frame)
  
  return () => {
    // Cleanup if needed
  }
}

// Stagger animation delays for lists
export const getStaggerDelay = (index: number, baseDelay = 50): number => {
  return prefersReducedMotion() ? 0 : index * baseDelay
}

// Spring animation parameters
export const springAnimation = {
  type: "spring",
  stiffness: 300,
  damping: 30,
} as const