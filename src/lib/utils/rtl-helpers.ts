/**
 * RTL (Right-to-Left) utility functions for Arabic language support
 */

export const isRTL = (locale: string): boolean => {
  return locale === 'ar'
}

export const getTextDirection = (locale: string): 'ltr' | 'rtl' => {
  return isRTL(locale) ? 'rtl' : 'ltr'
}

export const getTextAlignment = (locale: string): 'left' | 'right' | 'start' | 'end' => {
  return isRTL(locale) ? 'right' : 'left'
}

export const getFlexDirection = (locale: string, defaultDirection: 'row' | 'column' = 'row'): string => {
  if (defaultDirection === 'column') return 'flex-col'
  return isRTL(locale) ? 'flex-row-reverse' : 'flex-row'
}

export const getPaddingClass = (locale: string, side: 'start' | 'end', size: string = '4'): string => {
  const prefix = side === 'start' ? 'ps' : 'pe'
  return `${prefix}-${size}`
}

export const getMarginClass = (locale: string, side: 'start' | 'end', size: string = '4'): string => {
  const prefix = side === 'start' ? 'ms' : 'me'
  return `${prefix}-${size}`
}

export const getBorderClass = (locale: string, side: 'start' | 'end'): string => {
  return side === 'start' ? 'border-start' : 'border-end'
}

export const getIconFlipClass = (locale: string): string => {
  return isRTL(locale) ? 'rtl-flip' : 'ltr-flip'
}

// Convert Arabic-Indic numerals to Arabic numerals and vice versa
export const formatNumber = (num: number, locale: string): string => {
  if (isRTL(locale)) {
    // Use Arabic-Indic numerals for Arabic locale
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
    return num.toString().replace(/[0-9]/g, (digit) => arabicNumerals[parseInt(digit)])
  }
  return num.toString()
}

// Progress bar and slider helpers for RTL
export const getProgressDirection = (locale: string): 'normal' | 'reverse' => {
  return isRTL(locale) ? 'reverse' : 'normal'
}

// Form field helpers
export const getInputTextAlign = (locale: string): string => {
  return isRTL(locale) ? 'text-right' : 'text-left'
}

export const getLabelPosition = (locale: string): 'right' | 'left' => {
  return isRTL(locale) ? 'right' : 'left'
}

// Animation direction helpers
export const getSlideDirection = (locale: string, direction: 'in' | 'out'): string => {
  const isRtl = isRTL(locale)
  
  if (direction === 'in') {
    return isRtl ? 'slide-in-right' : 'slide-in-left'
  } else {
    return isRtl ? 'slide-out-right' : 'slide-out-left'
  }
}

// CSS custom properties for RTL support
export const getRTLCustomProperties = (locale: string): Record<string, string> => {
  const isRtl = isRTL(locale)
  
  return {
    '--text-direction': isRtl ? 'rtl' : 'ltr',
    '--text-align': isRtl ? 'right' : 'left',
    '--flex-direction': isRtl ? 'row-reverse' : 'row',
    '--transform-scale': isRtl ? '-1' : '1',
  }
}

// Component-specific RTL classes
export const getCardRTLClasses = (locale: string): string => {
  const isRtl = isRTL(locale)
  return isRtl 
    ? 'text-right' 
    : 'text-left'
}

export const getButtonRTLClasses = (locale: string, hasIcon: boolean = false): string => {
  const isRtl = isRTL(locale)
  if (!hasIcon) return ''
  
  return isRtl 
    ? 'flex-row-reverse' 
    : 'flex-row'
}

export const getNavigationRTLClasses = (locale: string): string => {
  const isRtl = isRTL(locale)
  return isRtl 
    ? 'space-x-reverse' 
    : ''
}