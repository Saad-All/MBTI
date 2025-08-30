"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScoringResult, Language, DimensionScore } from "@/lib/types";
import { ConsciousnessInsightsService } from "@/lib/services/ConsciousnessInsightsService";
import {
  MBTIContentService,
  MBTIPersonalityContent,
} from "@/lib/services/MBTIContentService";

interface EnhancedSAISResultsDisplayProps {
  results: ScoringResult;
  language: Language;
  className?: string;
}

export const EnhancedSAISResultsDisplay: React.FC<
  EnhancedSAISResultsDisplayProps
> = ({ results, language, className = "" }) => {
  const { t } = useTranslation();
  const [mbtiContent, setMbtiContent] = useState<MBTIPersonalityContent | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const insightsService = ConsciousnessInsightsService.getInstance();
  const contentService = MBTIContentService.getInstance();

  const insights = insightsService.getConsciousnessInsights(
    results.mbtiType,
    language
  );

  // Load MBTI comprehensive content
  useEffect(() => {
    const loadContent = async () => {
      try {
        await contentService.initialize();
        const content = contentService.getPersonalityContent(
          results.mbtiType,
          language
        );
        setMbtiContent(content);
      } catch (error) {
        console.error("Failed to load MBTI content:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadContent();
  }, [results.mbtiType, language, contentService]);

  // Calculate accurate SAIS percentages based on 15-point system
  const calculateSAISPercentages = (
    score: DimensionScore
  ): {
    optionA: { letter: string; percentage: number; points: number };
    optionB: { letter: string; percentage: number; points: number };
  } => {
    const totalPoints = 15; // 3 questions × 5 points each
    const [letterA, letterB] = score.dimension.split("/");

    // For SAIS, we need to properly map the scores to the correct letters
    let pointsA = 0;
    let pointsB = 0;

    // The rawScoreA and rawScoreB represent the actual distribution points
    if (score.preference === letterA) {
      pointsA = Math.round((score.confidence / 100) * totalPoints);
      pointsB = totalPoints - pointsA;
    } else {
      pointsB = Math.round((score.confidence / 100) * totalPoints);
      pointsA = totalPoints - pointsB;
    }

    return {
      optionA: {
        letter: letterA,
        percentage: Math.round((pointsA / totalPoints) * 100),
        points: pointsA,
      },
      optionB: {
        letter: letterB,
        percentage: Math.round((pointsB / totalPoints) * 100),
        points: pointsB,
      },
    };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-bold text-yellow-800 mb-2">
          {t("results.sais.contentUnavailable")}
        </h3>
        <p className="text-yellow-700">
          {t("results.sais.basicResultsOnly", { type: results.mbtiType })}
        </p>
      </div>
    );
  }

  const { consciousnessProfile } = results;

  return (
    <div className={`max-w-5xl mx-auto space-y-8 ${className}`}>
      {/* Enhanced Consciousness Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 p-8 md:p-12 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm mb-6">
              <span className="text-3xl font-bold">{results.mbtiType}</span>
            </div>
            <h1 className="text-4xl font-bold mb-3 text-white">
              {mbtiContent?.arabicTitle || insights.arabicTitle}
            </h1>
            <p className="text-xl opacity-90 mb-2 text-white">
              {mbtiContent?.arabicSubtitle || insights.arabicSubtitle}
            </p>
            <p className="text-lg opacity-80 max-w-2xl mx-auto text-white">
              {insights.consciousnessSignature}
            </p>
          </div>

          {/* SAIS Methodology Acknowledgment */}
          <div className="mt-8 p-6 bg-white/10 rounded-xl backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-3 flex items-center text-white">
              <span className="ml-2 ">✨</span>
              منهجية SAIS للوعي والإدراك العميق
            </h3>
            <p className="text-sm opacity-90 mb-4 text-white">
              تم تقييم شخصيتك باستخدام منهجية التوزيع الخماسي المتقدمة (SAIS)
              التي تقيس عمق تفضيلاتك النفسية عبر توزيع 5 نقاط لكل سؤال، مما يوفر
              دقة أكبر في فهم ميولك الحقيقية.
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white/10 rounded-lg p-3">
                <strong>إجمالي الأسئلة:</strong> 12 سؤالاً متخصصاً في الوعي
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <strong>نظام التقييم:</strong> 15 نقطة لكل بُعد (3 أسئلة × 5
                نقاط)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SAIS Dimension Scores with Accurate Percentages */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          🎯 تحليل دقيق لأبعاد شخصيتك بمنهجية SAIS
        </h2>
        <div className="space-y-6">
          {results.dimensionScores.map((score) => {
            const percentages = calculateSAISPercentages(score);
            const dimensionNames = {
              "E/I": "مصدر الطاقة والحيوية",
              "S/N": "طريقة استقبال المعلومات",
              "T/F": "مركز اتخاذ القرار",
              "J/P": "تنظيم العالم الخارجي",
            };

            return (
              <div
                key={score.dimension}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {
                    dimensionNames[
                      score.dimension as keyof typeof dimensionNames
                    ]
                  }
                </h3>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div
                    className={`p-4 rounded-lg ${
                      score.preference === percentages.optionA.letter
                        ? "bg-indigo-50 border-2 border-indigo-300"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-lg">
                        {percentages.optionA.letter}
                      </span>
                      <span className="text-2xl font-bold text-indigo-600">
                        {percentages.optionA.percentage}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {percentages.optionA.points} نقطة من 15
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-lg ${
                      score.preference === percentages.optionB.letter
                        ? "bg-indigo-50 border-2 border-indigo-300"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-lg">
                        {percentages.optionB.letter}
                      </span>
                      <span className="text-2xl font-bold text-indigo-600">
                        {percentages.optionB.percentage}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {percentages.optionB.points} نقطة من 15
                    </div>
                  </div>
                </div>

                {/* Visual Progress Bar */}
                <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                    style={{ width: `${percentages.optionA.percentage}%` }}
                  >
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-sm font-medium">
                      {percentages.optionA.letter}:{" "}
                      {percentages.optionA.percentage}%
                    </span>
                  </div>
                  <div
                    className="absolute right-0 top-0 h-full bg-gradient-to-l from-purple-500 to-pink-500"
                    style={{ width: `${percentages.optionB.percentage}%` }}
                  >
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-sm font-medium">
                      {percentages.optionB.letter}:{" "}
                      {percentages.optionB.percentage}%
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mt-3 text-center">
                  التفضيل الغالب:{" "}
                  <strong className="text-indigo-600">
                    {score.preference}
                  </strong>{" "}
                  بنسبة ثقة {score.confidence}%
                </p>
              </div>
            );
          })}
        </div>

        {/* Scoring Explanation */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">
            كيف تم حساب نتائجك؟
          </h4>
          <p className="text-sm text-blue-700">
            في منهجية SAIS، قمت بتوزيع 5 نقاط لكل سؤال من أسئلة الوعي الـ 12. كل
            بُعد من أبعاد شخصيتك يحتوي على 3 أسئلة، مما يعطي مجموع 15 نقطة لكل
            بُعد. النسب المئوية أعلاه تعكس توزيعك الفعلي للنقاط وتُظهر قوة
            تفضيلاتك النفسية بدقة.
          </p>
        </div>
      </div>

      {/* Comprehensive MBTI Content Integration */}
      {mbtiContent && (
        <div className="space-y-8">
          {/* Core Description */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="ml-3 text-3xl">🌟</span>
              جوهر شخصيتك
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {mbtiContent.coreDescription}
            </p>
          </div>

          {/* Relationship Insights */}
          <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-pink-800 mb-4 flex items-center">
              <span className="ml-3 text-3xl">💝</span>
              في العلاقات والتواصل
            </h2>
            <p className="text-lg text-pink-700 leading-relaxed">
              {mbtiContent.relationshipInsights}
            </p>
          </div>

          {/* Work Characteristics */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
              <span className="ml-3 text-3xl">💼</span>
              في العمل والمهنة
            </h2>
            <p className="text-lg text-blue-700 leading-relaxed">
              {mbtiContent.workCharacteristics}
            </p>
          </div>

          {/* Personal Growth - if available */}
          {mbtiContent.personalGrowth && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
                <span className="ml-3 text-3xl">🌱</span>
                النمو والتطور الشخصي
              </h2>
              <p className="text-lg text-green-700 leading-relaxed">
                {mbtiContent.personalGrowth}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Consciousness Domains with Enhanced Display */}
      <div className="grid md:grid-cols-2 gap-8">
        {consciousnessProfile && (
          <>
            <ConsciousnessDomainCard
              icon="⚡"
              title="مصدر الطاقة والحيوية"
              domain={consciousnessProfile.energySourcePattern}
              insights={insights.energySourcePattern}
              color="blue"
            />
            <ConsciousnessDomainCard
              icon="👁️"
              title="أسلوب الإدراك والوعي"
              domain={consciousnessProfile.awarenessStyle}
              insights={insights.awarenessStyle}
              color="purple"
            />
            <ConsciousnessDomainCard
              icon="💝"
              title="مركز اتخاذ القرار"
              domain={consciousnessProfile.decisionMakingCenter}
              insights={insights.decisionMakingCenter}
              color="pink"
            />
            <ConsciousnessDomainCard
              icon="🧭"
              title="تنظيم العالم الخارجي"
              domain={consciousnessProfile.lifeStructurePreference}
              insights={insights.lifeStructurePreference}
              color="green"
            />
          </>
        )}
      </div>

      {/* Inner Growth & Consciousness Expansion */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Inner Growth Recommendations */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
          <div className="flex items-center mb-4">
            <span className="text-2xl ml-3">🌱</span>
            <h3 className="text-xl font-bold text-green-800">
              توصيات النمو الداخلي
            </h3>
          </div>
          <div className="space-y-3">
            {insights.innerGrowthRecommendations.map(
              (recommendation, index) => (
                <div key={index} className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-green-700 text-sm font-medium ml-3">
                    {index + 1}
                  </span>
                  <p className="text-green-800 leading-relaxed">
                    {recommendation}
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Consciousness Expansion Practices */}
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100">
          <div className="flex items-center mb-4">
            <span className="text-2xl ml-3">✨</span>
            <h3 className="text-xl font-bold text-purple-800">
              ممارسات توسيع الوعي
            </h3>
          </div>
          <div className="space-y-3">
            {insights.consciousnessExpansion.map((practice, index) => (
              <div key={index} className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center text-purple-700 text-sm font-medium ml-3">
                  {index + 1}
                </span>
                <p className="text-purple-800 leading-relaxed">{practice}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Consciousness Domain Card Component
interface ConsciousnessDomainCardProps {
  icon: string;
  title: string;
  domain: any;
  insights: {
    domain: string;
    preference: string;
    description: string;
    consciousnessExample: string;
  };
  color: "blue" | "purple" | "pink" | "green";
}

const ConsciousnessDomainCard: React.FC<ConsciousnessDomainCardProps> = ({
  icon,
  title,
  domain,
  insights,
  color,
}) => {
  const colorClasses = {
    blue: "from-blue-50 to-cyan-50 border-blue-200 text-blue-800",
    purple: "from-purple-50 to-violet-50 border-purple-200 text-purple-800",
    pink: "from-pink-50 to-red-50 border-pink-200 text-pink-800",
    green: "from-green-50 to-emerald-50 border-green-200 text-green-800",
  };

  const bgColorClasses = {
    blue: "bg-blue-100",
    purple: "bg-purple-100",
    pink: "bg-pink-100",
    green: "bg-green-100",
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl border p-6 hover:shadow-lg transition-all duration-300`}
    >
      <div className="flex items-center mb-4">
        <span className="text-3xl ml-3">{icon}</span>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium opacity-80">التفضيل:</span>
          <span className="text-xl font-bold">
            {insights.preference} ({domain.percentage}%)
          </span>
        </div>

        {/* Enhanced percentage bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 mb-3 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${
              color === "blue"
                ? "from-blue-400 to-cyan-500"
                : color === "purple"
                ? "from-purple-400 to-violet-500"
                : color === "pink"
                ? "from-pink-400 to-red-500"
                : "from-green-400 to-emerald-500"
            } transition-all duration-500 flex items-center justify-center text-white text-xs font-medium`}
            style={{ width: `${domain.percentage}%` }}
          >
            {domain.percentage}%
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-semibold mb-1 opacity-80">
            الوصف الوعيي:
          </h4>
          <p className="text-sm leading-relaxed">{insights.description}</p>
        </div>

        <div className={`${bgColorClasses[color]} p-3 rounded-lg`}>
          <h4 className="text-xs font-semibold mb-1 uppercase opacity-80">
            مثال من الواقع:
          </h4>
          <p className="text-xs leading-relaxed">
            {insights.consciousnessExample}
          </p>
        </div>
      </div>
    </div>
  );
};
