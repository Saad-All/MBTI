import { Inter } from 'next/font/google'

// Latin fonts
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

// IBM Plex Arabic from Google Fonts
import { IBM_Plex_Sans_Arabic } from 'next/font/google'

export const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-arabic',
})

// Font class helper
export function getFontClass(locale: string): string {
  if (locale === 'ar') {
    return `${inter.variable} ${ibmPlexArabic.variable}`
  }
  return inter.variable
}

export function getFontFamily(locale: string): string {
  return locale === 'ar' ? 'font-arabic' : 'font-sans'
}
