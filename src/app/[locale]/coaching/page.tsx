"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import {
  ConsciousnessCoachingService,
  CoachingOption,
} from "@/lib/services/ConsciousnessCoachingService";
import { MBTIType, Language } from "@/lib/types";

interface CoachingPageProps {
  params: { locale: string };
}

export default function CoachingPage({
  params: { locale },
}: CoachingPageProps) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const searchParams = useSearchParams();

  const mbtiType = searchParams.get("mbtiType") as MBTIType;
  const methodology = searchParams.get("methodology");
  const primaryFocus = searchParams.get("focus");

  const [coachingOptions, setCoachingOptions] = useState<CoachingOption[]>([]);

  useEffect(() => {
    if (methodology === "sais" && mbtiType) {
      // Get consciousness coaching options
      const coachingService = ConsciousnessCoachingService.getInstance();
      // For now, get general coaching options (would need full consciousness profile for detailed recommendations)
      const defaultOptions: CoachingOption[] = [
        {
          id: "consciousness-development",
          title: "Consciousness Development Coaching",
          arabicTitle: "التدريب على تطوير الوعي",
          description:
            "Deep psychological coaching focused on expanding consciousness and inner awareness",
          arabicDescription:
            "تدريب نفسي عميق يركز على توسيع الوعي والإدراك الداخلي",
          focus: ["تطوير الوعي", "النمو النفسي", "التأمل العملي", "فهم الذات"],
          sessionType: "individual",
          duration: "60-90 دقيقة",
        },
        {
          id: "psychological-integration",
          title: "Psychological Integration Coaching",
          arabicTitle: "التدريب على التكامل النفسي",
          description:
            "Integration of personality patterns with spiritual and psychological growth",
          arabicDescription: "دمج أنماط الشخصية مع النمو الروحي والنفسي",
          focus: [
            "التكامل النفسي",
            "التطوير الروحي",
            "التوازن الداخلي",
            "الأصالة الشخصية",
          ],
          sessionType: "individual",
          duration: "90 دقيقة",
        },
        {
          id: "inner-work-guidance",
          title: "Inner Work Guidance",
          arabicTitle: "إرشاد العمل الداخلي",
          description:
            "Guidance for deep inner work and authentic self-expression practices",
          arabicDescription:
            "توجيه للعمل الداخلي العميق وممارسات التعبير الأصيل عن الذات",
          focus: [
            "العمل الداخلي",
            "التعبير الأصيل",
            "الشفاء النفسي",
            "التحول الشخصي",
          ],
          sessionType: "individual",
          duration: "75 دقيقة",
        },
      ];
      setCoachingOptions(defaultOptions);
    } else {
      // Standard coaching options
      const standardOptions: CoachingOption[] = [
        {
          id: "personality-coaching",
          title: "MBTI Personality Coaching",
          arabicTitle: "التدريب على الشخصية",
          description:
            "Professional coaching based on your MBTI personality type",
          arabicDescription: "تدريب مهني يعتمد على نمط شخصيتك حسب مؤشر MBTI",
          focus: ["نقاط القوة", "التطوير المهني", "العلاقات", "النمو الشخصي"],
          sessionType: "individual",
          duration: "60 دقيقة",
        },
      ];
      setCoachingOptions(standardOptions);
    }
  }, [methodology, mbtiType]);

  const handleBookSession = (option: CoachingOption) => {
    // For demo purposes, show an alert with booking info
    alert(
      `سيتم تحويلك لحجز جلسة ${option.arabicTitle}. هذه الميزة قيد التطوير.`
    );
  };

  const isConsciousnessCoaching = methodology === "sais";

  return (
    <div
      className={`min-h-screen ${
        isConsciousnessCoaching
          ? "bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50"
          : "bg-gradient-to-br from-blue-50 to-indigo-100"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Button
              onClick={() => router.back()}
              variant="ghost"
              size="sm"
              className="absolute top-4 left-4 text-gray-600 hover:text-gray-800"
            >
              ← العودة للنتائج
            </Button>

            <h1
              className={`text-3xl font-bold mb-4 ${
                isConsciousnessCoaching ? "text-purple-800" : "text-blue-800"
              }`}
            >
              {isConsciousnessCoaching
                ? "🧠 تطوير الوعي والإرشاد النفسي"
                : "💼 التدريب على الشخصية"}
            </h1>

            {mbtiType && (
              <p className="text-gray-600 mb-2">
                نمط شخصيتك: <span className="font-semibold">{mbtiType}</span>
                {isConsciousnessCoaching && " (منهجية الوعي العميق)"}
              </p>
            )}

            {primaryFocus && (
              <div className="bg-purple-100 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-purple-800 mb-2">
                  🎯 التركيز الأساسي للتطوير:
                </h3>
                <p className="text-purple-700">{primaryFocus}</p>
              </div>
            )}
          </div>

          {/* Coaching Options */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {coachingOptions.map((option) => (
              <div
                key={option.id}
                className="bg-white rounded-xl p-6 shadow-lg border hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {option.arabicTitle}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {option.arabicDescription}
                </p>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    التركيزات:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {option.focus.map((focus, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 text-xs rounded-full ${
                          isConsciousnessCoaching
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {focus}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  <p>⏱️ المدة: {option.duration}</p>
                  <p>👤 النوع: فردي</p>
                </div>

                <Button
                  onClick={() => handleBookSession(option)}
                  variant="primary"
                  size="sm"
                  className={`w-full ${
                    isConsciousnessCoaching
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  احجز جلسة
                </Button>
              </div>
            ))}
          </div>

          {/* Consciousness Development Path for SAIS users */}
          {isConsciousnessCoaching && (
            <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
              <h2 className="text-2xl font-bold text-purple-800 mb-6 text-center">
                🌱 مسار تطوير الوعي المخصص لك
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Inner Work Practices */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center">
                    <span className="ml-3">🧘</span>
                    ممارسات العمل الداخلي
                  </h3>
                  <ul className="space-y-3 text-green-700">
                    <li className="flex items-start">
                      <span className="text-green-500 ml-3">•</span>
                      التأمل اليومي للاتصال بالمركز الجذري
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 ml-3">•</span>
                      ممارسة الكتابة التأملية لاستكشاف الذات
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 ml-3">•</span>
                      تطوير البصيرة من خلال التأمل في الطبيعة
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 ml-3">•</span>
                      ممارسة الامتنان لتعزيز الوعي الإيجابي
                    </li>
                  </ul>
                </div>

                {/* Consciousness Expansion */}
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-purple-800 mb-4 flex items-center">
                    <span className="ml-3">✨</span>
                    توسيع الوعي
                  </h3>
                  <ul className="space-y-3 text-purple-700">
                    <li className="flex items-start">
                      <span className="text-purple-500 ml-3">•</span>
                      استكشاف تقاليد الحكمة المختلفة
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 ml-3">•</span>
                      تطوير الحدس والبصيرة الروحية
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 ml-3">•</span>
                      ممارسة الخدمة المجتمعية الواعية
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 ml-3">•</span>
                      تعلم فنون التعبير الأصيل عن الذات
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="bg-white rounded-xl p-6 text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              📞 للاستفسار والحجز
            </h3>
            <p className="text-gray-600 mb-4">
              {isConsciousnessCoaching
                ? "تواصل مع خبراء التطوير النفسي والوعي للحصول على جلسات مخصصة"
                : "تواصل مع مدربي الشخصية المعتمدين للحصول على استشارة مهنية"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline">📧 email@example.com</Button>
              <Button variant="outline">📱 +966 xx xxx xxxx</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
