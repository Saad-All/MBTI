"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAssessmentStore } from "@/lib/stores/assessment-store";
import { useAssessmentPersistence } from "@/lib/hooks/useAssessmentPersistence";
import { QuestionCard } from "@/components/assessment/QuestionCard";
import { BinaryChoice } from "@/components/assessment/BinaryChoice";
import { ProgressBar } from "@/components/assessment/ProgressBar";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { coreQuestions } from "@/data/core-questions";
import { QuestionResponse } from "@/lib/types";

interface CoreAssessmentProps {
  params: { locale: string };
}

export default function CoreAssessment({
  params: { locale },
}: CoreAssessmentProps) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<"A" | "B" | null>(null);

  // Use persistence hook instead of direct store access
  const {
    sessionId,
    language,
    setLanguage,
    addResponse,
    responses,
    setProgress,
    setCurrentStep,
  } = useAssessmentPersistence();

  // Initialize language on mount
  useEffect(() => {
    setLanguage(locale as "ar" | "en");
    setCurrentStep("questions");
  }, [locale, setLanguage, setCurrentStep]);

  // Redirect if no session
  useEffect(() => {
    if (!sessionId) {
      router.push(`/${locale}`);
    }
  }, [sessionId, locale, router]);

  // Update progress
  useEffect(() => {
    const progress = ((currentQuestionIndex + 1) / coreQuestions.length) * 100;
    setProgress(progress);
  }, [currentQuestionIndex, setProgress]);

  // Check if current question was already answered
  useEffect(() => {
    const currentQuestion = coreQuestions[currentQuestionIndex];
    const existingResponse = responses.find(
      (r) => r.questionId === currentQuestion.id
    );
    if (existingResponse) {
      setSelectedOption(existingResponse.selectedOption as "A" | "B");
    } else {
      setSelectedOption(null);
    }
  }, [currentQuestionIndex, responses]);

  const currentQuestion = coreQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === coreQuestions.length - 1;

  const handleOptionSelect = (option: "A" | "B") => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (!selectedOption || !sessionId) return;

    // Create response
    const response: QuestionResponse = {
      responseId: `resp_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      sessionId,
      questionId: currentQuestion.id,
      questionType: "core",
      responseType: "binary",
      selectedOption: selectedOption,
      mbtiDimension: currentQuestion.dimension,
      score: 0,
      timestamp: new Date(),
      tendency:
        selectedOption === "A"
          ? currentQuestion.optionATendency
          : currentQuestion.optionBTendency,
    };

    // Add response to store
    addResponse(response);

    // Navigate to next question or interim results
    if (isLastQuestion) {
      console.log("Last question completed. Navigating to interim results...");

      // Small delay to ensure state is properly updated
      setTimeout(() => {
        router.push(`/${locale}/assessment/interim`);
      }, 100);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (!sessionId) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="absolute top-0 right-0 p-6">
        <LanguageToggle />
      </header>

      <div className="container mx-auto px-4 py-8 md:py-16 max-w-3xl safe-bottom">
        {/* Progress */}
        <div className="mb-8">
          <ProgressBar
            current={currentQuestionIndex + 1}
            total={coreQuestions.length}
            showLabel={true}
            labelText={t("assessment.core.progress", {
              current: currentQuestionIndex + 1,
              total: coreQuestions.length,
            })}
          />
        </div>

        {/* Question */}
        <QuestionCard question={t(currentQuestion.questionKey)}>
          <BinaryChoice
            optionA={t(currentQuestion.optionAKey)}
            optionB={t(currentQuestion.optionBKey)}
            selectedOption={selectedOption}
            onSelect={handleOptionSelect}
          />
        </QuestionCard>

        {/* Navigation */}
        <div className="mt-8 flex justify-between gap-4">
          <button
            onClick={handleBack}
            disabled={currentQuestionIndex === 0}
            className={`
              px-4 md:px-6 py-3 rounded-lg font-medium transition-all
              touch-target no-select flex-1 md:flex-initial
              ${
                currentQuestionIndex === 0
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 active:scale-[0.98]"
              }
            `}
          >
            {t("assessment.core.back")}
          </button>

          <button
            onClick={handleNext}
            disabled={!selectedOption}
            className={`
              px-4 md:px-6 py-3 rounded-lg font-medium transition-all
              touch-target no-select flex-1 md:flex-initial
              ${
                selectedOption
                  ? "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              }
            `}
          >
            {t("assessment.core.next")}
          </button>
        </div>

        {/* Validation message */}
        {!selectedOption && (
          <p className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
            {t("assessment.core.selectOption")}
          </p>
        )}
      </div>
    </main>
  );
}
