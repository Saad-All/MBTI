import type { Metadata } from "next";
import "../globals.css";
import { getFontClass, inter } from "@/lib/utils/fonts";

export const metadata: Metadata = {
  title: "MBTI Coaching Platform",
  description: "Comprehensive MBTI assessment and coaching platform",
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

  return (
    <html lang={locale} dir={direction} className={fontClass}>
      <body className={locale === "ar" ? "font-arabic" : "font-sans"}>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}
