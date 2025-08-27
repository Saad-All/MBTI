interface HomeProps {
  params: { locale: string };
}

export default function Home({ params: { locale } }: HomeProps) {
  const isArabic = locale === "ar";

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold text-center">
          {isArabic ? "منصة التدريب MBTI" : "MBTI Coaching Platform"}
        </h1>
      </div>

      <div className="relative flex place-items-center">
        <p className="text-center text-lg">
          {isArabic
            ? "مرحباً بك في منصة التدريب MBTI - قريباً"
            : "Welcome to MBTI Coaching Platform - Coming Soon"}
        </p>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-2 lg:text-left">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
          <h2 className="mb-3 text-2xl font-semibold">
            {isArabic ? "ابدأ التقييم" : "Start Assessment"}
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            {isArabic
              ? "اكتشف نوع شخصيتك من خلال تقييم MBTI الشامل"
              : "Discover your personality type through comprehensive MBTI assessment"}
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
          <h2 className="mb-3 text-2xl font-semibold">
            {isArabic ? "جلسة التدريب" : "Coaching Session"}
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            {isArabic
              ? "احصل على جلسة تدريب شخصية مع مدرب معتمد"
              : "Get personalized coaching session with certified coach"}
          </p>
        </div>
      </div>
    </main>
  );
}

