"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { ScoringResult, ConsciousnessProfile, Language } from "@/lib/types";
import { ConsciousnessInsightsService } from "@/lib/services/ConsciousnessInsightsService";

interface SAISResultsDisplayProps {
  results: ScoringResult;
  language: Language;
  className?: string;
}

export const SAISResultsDisplay: React.FC<SAISResultsDisplayProps> = ({
  results,
  language,
  className = "",
}) => {
  const { t } = useTranslation();
  const insightsService = ConsciousnessInsightsService.getInstance();
  const insights = insightsService.getConsciousnessInsights(
    results.mbtiType,
    language
  );

  if (!insights) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <div className="text-yellow-600 mb-4">
          <svg
            className="w-12 h-12 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-yellow-800 mb-2">
          نتائج MBTI متاحة
        </h3>
        <p className="text-yellow-700 mb-4">
          تم حساب نمط شخصيتك {results.mbtiType} بنجاح، لكن المحتوى الوعيي غير
          متاح حالياً.
        </p>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">
            نتائجك الأساسية:
          </h4>
          <p className="text-yellow-700">نمط الشخصية: {results.mbtiType}</p>
          <p className="text-yellow-700">
            مستوى الثقة: {results.overallConfidence}%
          </p>
        </div>
      </div>
    );
  }

  if (!results.consciousnessProfile) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-bold text-blue-800 mb-2">نتائج MBTI</h3>
        <p className="text-blue-700 mb-4">
          نمط شخصيتك: {results.mbtiType} - {insights.arabicTitle}
        </p>
        <p className="text-blue-600 text-sm">
          ⚠️ ملف الوعي غير متاح - يتم عرض النتائج الأساسية
        </p>
      </div>
    );
  }

  const { consciousnessProfile } = results;

  return (
    <div className={`max-w-4xl mx-auto space-y-8 ${className}`}>
      {/* Consciousness Header with Depth Theme */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-4">
              <span className="text-2xl font-bold">{results.mbtiType}</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">{insights.arabicTitle}</h1>
          <p className="text-lg opacity-90 mb-2">{insights.arabicSubtitle}</p>
          <p className="text-sm opacity-80">
            {insights.consciousnessSignature}
          </p>

          {/* Consciousness Assessment Acknowledgment */}
          <div className="mt-6 px-4 py-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <p className="text-sm">
              ✨ تم تقييم شخصيتك باستخدام منهجية الوعي والإدراك العميق (SAIS)
            </p>
          </div>
        </div>

        {/* Depth-themed decorative elements */}
        <div className="absolute top-4 right-4 opacity-30">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z" />
          </svg>
        </div>
        <div className="absolute bottom-4 left-4 opacity-20">
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fillRule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </div>
      </div>

      {/* Consciousness Domains Display */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Energy Source Pattern */}
        <ConsciousnessDomainCard
          icon="🌱"
          title="مصدر الطاقة والحيوية"
          domain={consciousnessProfile.energySourcePattern}
          insights={insights.energySourcePattern}
        />

        {/* Awareness Style */}
        <ConsciousnessDomainCard
          icon="👁️"
          title="أسلوب الإدراك والوعي"
          domain={consciousnessProfile.awarenessStyle}
          insights={insights.awarenessStyle}
        />

        {/* Decision Making Center */}
        <ConsciousnessDomainCard
          icon="💝"
          title="مركز اتخاذ القرار"
          domain={consciousnessProfile.decisionMakingCenter}
          insights={insights.decisionMakingCenter}
        />

        {/* Life Structure Preference */}
        <ConsciousnessDomainCard
          icon="🧭"
          title="تنظيم العالم الخارجي"
          domain={consciousnessProfile.lifeStructurePreference}
          insights={insights.lifeStructurePreference}
        />
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

      {/* Dimension Scores with Consciousness Percentages */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
          🎯 مؤشرات الوعي والتفضيلات النفسية
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {results.dimensionScores.map((score) => (
            <DimensionScoreCard key={score.dimension} score={score} />
          ))}
        </div>
      </div>
    </div>
  );
};

interface ConsciousnessDomainCardProps {
  icon: string;
  title: string;
  domain: any; // ConsciousnessDimension type
  insights: {
    domain: string;
    preference: string;
    description: string;
    consciousnessExample: string;
  };
}

const ConsciousnessDomainCard: React.FC<ConsciousnessDomainCardProps> = ({
  icon,
  title,
  domain,
  insights,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center mb-4">
        <span className="text-2xl ml-3">{icon}</span>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">التفضيل:</span>
          <span className="text-lg font-bold text-indigo-600">
            {domain.percentage}% {insights.preference}
          </span>
        </div>

        {/* Consciousness percentage bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${domain.percentage}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-1">
            الوصف الوعيي:
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {insights.description}
          </p>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="text-xs font-semibold text-blue-800 mb-1 uppercase">
            مثال من الواقع:
          </h4>
          <p className="text-xs text-blue-700 leading-relaxed">
            {insights.consciousnessExample}
          </p>
        </div>
      </div>
    </div>
  );
};

interface DimensionScoreCardProps {
  score: any; // DimensionScore with consciousness enhancements
}

const DimensionScoreCard: React.FC<DimensionScoreCardProps> = ({ score }) => {
  const getDimensionDisplay = (dimension: string) => {
    const displays = {
      "E/I": { ar: "الطاقة", icon: "⚡" },
      "S/N": { ar: "الإدراك", icon: "👁️" },
      "T/F": { ar: "القرار", icon: "💝" },
      "J/P": { ar: "التنظيم", icon: "🧭" },
    };
    return (
      displays[dimension as keyof typeof displays] || {
        ar: dimension,
        icon: "🔹",
      }
    );
  };

  const display = getDimensionDisplay(score.dimension);

  return (
    <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
      <div className="text-2xl mb-2">{display.icon}</div>
      <h4 className="text-sm font-semibold text-gray-700 mb-1">{display.ar}</h4>
      <div className="text-lg font-bold text-indigo-600 mb-1">
        {score.preference}
      </div>
      <div className="text-xs text-gray-500 mb-2">
        {score.consciousnessPercentage}% وعي تفضيلي
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-indigo-400 to-purple-400 h-2 rounded-full"
          style={{ width: `${score.consciousnessPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};
