"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAssessmentStore } from "@/lib/stores/assessment-store";
import { SAISResultsDisplay } from "@/components/results/SAISResultsDisplay";
import { Button } from "@/components/ui/Button";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/Card";
import { H2, H3, Text } from "@/components/ui/Typography";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ScoringResult, Language, MBTIResults } from "@/lib/types";
import { ConsciousnessCoachingService } from "@/lib/services/ConsciousnessCoachingService";

interface SAISResultsPageProps {
  params: { locale: string };
}

export default function SAISResultsPage({
  params: { locale },
}: SAISResultsPageProps) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const {
    sessionId,
    responses,
    selectedFormat,
    language,
    setCurrentStep,
    setCalculatedType,
    setConfidence,
    completeAssessment,
  } = useAssessmentStore();

  const [results, setResults] = useState<ScoringResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verify this is a SAIS assessment
    if (selectedFormat !== "sais") {
      console.error(
        "Not a SAIS assessment, redirecting to appropriate results"
      );
      router.push(`/${locale}/assessment/results`);
      return;
    }

    // Don't process if no session or no responses
    if (!sessionId || responses.length === 0) {
      console.error("No session ID or responses found, redirecting to home");
      router.push(`/${locale}`);
      return;
    }

    // Update current step to results
    setCurrentStep("results");

    // Calculate SAIS consciousness results
    const calculateSAISResults = async () => {
      try {
        console.log("Calculating SAIS consciousness results...");
        console.log("Total responses:", responses.length);
        console.log("Session ID:", sessionId);

        const response = await fetch("/api/assessment/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            responses,
            methodology: "sais",
            isInterim: false,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("SAIS results calculated:", data);

        if (!data.success || !data.data) {
          throw new Error(data.error || "Failed to calculate results");
        }

        const mbtiResults: MBTIResults = data.data;

        // Update store with calculated results
        setCalculatedType(mbtiResults.mbtiType);
        setConfidence(mbtiResults.overallConfidence);

        // Set results for display
        setResults(mbtiResults);

        // Mark assessment as complete
        completeAssessment();
        setLoading(false);
      } catch (err) {
        console.error("Error calculating SAIS results:", err);
        setError(
          err instanceof Error ? err.message : "حدث خطأ في حساب النتائج"
        );
        setLoading(false);
      }
    };

    calculateSAISResults();
  }, [
    sessionId,
    responses,
    selectedFormat,
    locale,
    router,
    setCurrentStep,
    setCalculatedType,
    setConfidence,
    completeAssessment,
  ]);

  const handleStartOver = () => {
    router.push(`/${locale}`);
  };

  const handleGoToCoaching = () => {
    // Get consciousness coaching recommendations with error handling
    try {
      if (results?.consciousnessProfile) {
        const coachingService = ConsciousnessCoachingService.getInstance();
        const recommendations =
          coachingService.getConsciousnessCoachingRecommendations(
            results.mbtiType,
            results.consciousnessProfile,
            language as Language
          );

        // Redirect to coaching page with consciousness context
        const coachingUrl = new URLSearchParams({
          mbtiType: results.mbtiType,
          methodology: "sais",
          focus: recommendations.primaryFocus,
        });
        router.push(`/${locale}/coaching?${coachingUrl.toString()}`);
      } else {
        // Fallback to general coaching
        router.push(
          `/${locale}/coaching?mbtiType=${results?.mbtiType}&methodology=sais`
        );
      }
    } catch (error) {
      console.error("Error getting coaching recommendations:", error);
      // Fallback to basic coaching page
      router.push(`/${locale}/coaching?mbtiType=${results?.mbtiType}`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <PageLayout containerSize="sm" centered className="bg-gradient-accent">
        <div className="text-center">
          <LoadingSpinner size="xl" color="white" />
          <H2 className="text-white mt-6 mb-2">
            جاري حساب نتائج الوعي...
          </H2>
          <Text className="text-white/90">
            يتم تحليل إجاباتك باستخدام منهجية SAIS
          </Text>
        </div>
      </PageLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <PageLayout containerSize="sm" centered>
        <Card className="p-8 text-center">
          <div className="text-error mb-4">
            <svg
              className="w-16 h-16 mx-auto"
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
          <H2 className="text-content-primary mb-2">
            خطأ في النتائج
          </H2>
          <Text className="text-content-secondary mb-6">{error}</Text>
          <Button onClick={handleStartOver} variant="primary">
            ابدأ من جديد
          </Button>
        </Card>
      </PageLayout>
    );
  }

  // Results display
  if (!results) {
    return (
      <PageLayout containerSize="sm" centered>
        <div className="text-center">
          <Text className="text-content-tertiary mb-4">لا توجد نتائج للعرض</Text>
          <Button onClick={handleStartOver}>
            ابدأ من جديد
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout containerSize="xl" className="bg-gradient-accent-subtle">
      <div className="py-8 md:py-12">
        {/* SAIS Consciousness Results Display */}
        <div className="animate-fade-in">
          <SAISResultsDisplay
            results={results}
            language={language as Language}
            className="mb-8"
          />
        </div>

        {/* Action Buttons */}
        <Card className="p-6 md:p-8 max-w-4xl mx-auto animate-fade-in animation-delay-200">
          <div className="text-center mb-6">
            <H3 className="text-content-primary mb-2">
              🌟 رحلة الوعي مستمرة
            </H3>
            <Text className="text-content-secondary">
              اكتشفت نمط شخصيتك من منظور الوعي العميق. ما هي خطوتك التالية؟
            </Text>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Coaching Integration */}
            <Button
              onClick={handleGoToCoaching}
              variant="accent"
              size="lg"
              className="shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              🧭 استكشف تطوير الوعي مع مدرب نفسي
            </Button>

            {/* Chat with AI Coach */}
            <Button
              onClick={() => {
                // Pass consciousness context to chat
                const chatUrl = new URLSearchParams({
                  mbtiType: results.mbtiType,
                  methodology: "sais",
                  consciousness: JSON.stringify(results.consciousnessProfile),
                });
                router.push(`/${locale}/chat?${chatUrl.toString()}`);
              }}
              variant="secondary"
              size="lg"
            >
              💬 تحدث مع مرشد الوعي الذكي
            </Button>

            {/* Start Over */}
            <Button
              onClick={handleStartOver}
              variant="ghost"
              size="lg"
            >
              🔄 ابدأ رحلة جديدة
            </Button>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
