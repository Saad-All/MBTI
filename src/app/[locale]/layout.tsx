import type { Metadata, Viewport } from "next";
import "../globals.css";
import { getFontClass, getFontFamily } from "@/lib/utils/fonts";
import { I18nProvider } from "@/components/providers/I18nProvider";

export const metadata: Metadata = {
  title: "MBTI Coaching Platform",
  description: "Comprehensive MBTI assessment and coaching platform",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#4F46E5' },
    { media: '(prefers-color-scheme: dark)', color: '#1E1B4B' },
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function RootLayout({
  children,
  params: { locale },
}: RootLayoutProps) {
  const direction = locale === "ar" ? "rtl" : "ltr";
  const fontClass = getFontClass(locale);
  const fontFamily = getFontFamily(locale);

  return (
    <html lang={locale} dir={direction} className={fontClass}>
      <body className={fontFamily}>
        <I18nProvider locale={locale}>
          <div id="root">{children}</div>
        </I18nProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}
