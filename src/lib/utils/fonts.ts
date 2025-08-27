import { Inter } from 'next/font/google'

// Latin fonts
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

// For now, we'll use Google Fonts for Arabic until custom fonts are added
// Future: Replace with local font files when available
// export const ibmPlexArabic = localFont({ ... })
// export const notoSansArabic = localFont({ ... })

// Font class helper
export function getFontClass(locale: string): string {
  // For Arabic, we'll rely on CSS font-family fallbacks defined in globals.css
  // Future: Return custom font variables when local fonts are added
  return inter.variable
}
