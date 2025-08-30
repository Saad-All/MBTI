import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Design System Color Palette
      colors: {
        // Primary Brand Colors
        primary: {
          DEFAULT: '#2563eb',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Secondary Colors
        secondary: {
          DEFAULT: '#0f172a',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Accent Colors
        accent: {
          DEFAULT: '#8b5cf6',
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        // Semantic Colors
        success: {
          DEFAULT: '#059669',
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        warning: {
          DEFAULT: '#d97706',
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        error: {
          DEFAULT: '#dc2626',
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Neutral Colors
        neutral: {
          DEFAULT: '#64748b',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Dark Mode Specific
        dark: {
          background: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          text: {
            primary: '#f1f5f9',
            secondary: '#cbd5e1',
            muted: '#94a3b8',
          }
        },
        // Keep legacy variables for backward compatibility
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // Border colors
        border: {
          DEFAULT: 'var(--border)',
          primary: 'var(--border)',
          secondary: 'var(--border)',
        },
        // Surface colors for components
        surface: {
          primary: 'var(--background)',
          secondary: 'var(--card)',
          tertiary: 'var(--muted)',
        },
        // Content colors for text
        content: {
          primary: 'var(--foreground)',
          secondary: 'var(--muted-foreground)',
          tertiary: 'var(--muted-foreground)',
        },
      },
      // Typography System
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        arabic: ['IBM Plex Sans Arabic', 'Noto Sans Arabic', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        // Type Scale with line heights
        'h1': ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }], // 36px
        'h2': ['1.875rem', { lineHeight: '1.3', fontWeight: '600' }], // 30px
        'h3': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }], // 24px
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }], // 16px
        'small': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }], // 14px
        'xs': ['0.75rem', { lineHeight: '1.5', fontWeight: '400' }], // 12px
      },
      // Spacing System (4px base)
      spacing: {
        '0': '0px',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
        '32': '128px',
        '40': '160px',
        '48': '192px',
        '56': '224px',
        '64': '256px',
        'rtl-safe': '0.25rem',
      },
      // Responsive Breakpoints
      screens: {
        'mobile': '320px',     // Smartphones
        'tablet': '768px',     // iPads, tablets
        'desktop': '1024px',   // Laptops, desktops
        'wide': '1440px',      // Large monitors
      },
      // Animation System
      animation: {
        'question-transition': 'slideIn 300ms ease-out',
        'point-feedback': 'pulse 150ms ease-in-out',
        'progress-update': 'progress 400ms ease-in-out',
        'results-reveal': 'fadeInScale 2000ms ease-in-out',
        'format-selection': 'scaleIn 200ms ease-out',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'spin': 'spin 1s linear infinite',
        'fade-in': 'fadeIn 300ms ease-out',
        'fade-out': 'fadeOut 300ms ease-in',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8', transform: 'scale(0.98)' },
        },
        progress: {
          '0%': { width: 'var(--from-width, 0%)' },
          '100%': { width: 'var(--to-width, 100%)' },
        },
        fadeInScale: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '50%': { opacity: '0.5', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      // Border Radius
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',     // 2px
        'DEFAULT': '0.25rem', // 4px
        'md': '0.375rem',     // 6px
        'lg': '0.5rem',       // 8px
        'xl': '0.75rem',      // 12px
        '2xl': '1rem',        // 16px
        '3xl': '1.5rem',      // 24px
        'full': '9999px',
      },
      // Box Shadow
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'none': 'none',
        // Dark mode shadows
        'dark-sm': '0 1px 2px 0 rgb(0 0 0 / 0.3)',
        'dark-md': '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
        'dark-lg': '0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
      },
      // Transition Timing
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '2000': '2000ms',
      },
      transitionTimingFunction: {
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'out': 'cubic-bezier(0, 0, 0.2, 1)',
        'in': 'cubic-bezier(0.4, 0, 1, 1)',
        'spring': 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
      },
    },
  },
  plugins: [
    // RTL/LTR Utilities Plugin
    function({ addUtilities, theme }: any) {
      const rtlUtilities: Record<string, Record<string, string>> = {
        // Direction utilities
        '.rtl-flip': {
          transform: 'scaleX(-1)',
        },
        '.ltr-flip': {
          transform: 'scaleX(1)',
        },
        // Text alignment
        '.text-start': {
          'text-align': 'start',
        },
        '.text-end': {
          'text-align': 'end',
        },
        // Borders
        '.border-start': {
          'border-inline-start': '1px solid',
        },
        '.border-end': {
          'border-inline-end': '1px solid',
        },
        '.border-start-2': {
          'border-inline-start': '2px solid',
        },
        '.border-end-2': {
          'border-inline-end': '2px solid',
        },
      }

      // Generate padding utilities
      const spacingValues = theme('spacing')
      Object.entries(spacingValues).forEach(([key, value]) => {
        rtlUtilities[`.ps-${key}`] = {
          'padding-inline-start': value as string,
        }
        rtlUtilities[`.pe-${key}`] = {
          'padding-inline-end': value as string,
        }
        rtlUtilities[`.ms-${key}`] = {
          'margin-inline-start': value as string,
        }
        rtlUtilities[`.me-${key}`] = {
          'margin-inline-end': value as string,
        }
      })

      // Touch target utilities
      rtlUtilities['.touch-target'] = {
        'min-height': '44px',
        'min-width': '44px',
      }

      // Safe area utilities
      rtlUtilities['.safe-top'] = {
        'padding-top': 'env(safe-area-inset-top)',
      }
      rtlUtilities['.safe-bottom'] = {
        'padding-bottom': 'env(safe-area-inset-bottom)',
      }

      // No select utility
      rtlUtilities['.no-select'] = {
        '-webkit-user-select': 'none',
        '-moz-user-select': 'none',
        '-ms-user-select': 'none',
        'user-select': 'none',
      }

      addUtilities(rtlUtilities)
    },
  ],
}

export default config