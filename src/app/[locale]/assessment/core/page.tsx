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
import { Button } from "@/components/ui/Button";
import { Small } from "@/components/ui/Typography";
import { PageLayout } from "@/components/layout/PageLayout";
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
    <PageLayout containerSize="md" className="bg-gradient-primary">
      {/* Header */}
      <header className="absolute top-0 right-0 rtl:right-auto rtl:left-0 p-4 sm:p-6">
        <LanguageToggle variant="compact" />
      </header>

      <div className="pt-16 pb-8 md:pt-20 md:pb-16">
        {/* Progress */}
        <div className="mb-8 animate-fade-in">
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
        <div className="animate-fade-in animation-delay-100">
          <QuestionCard question={t(currentQuestion.questionKey)}>
            <BinaryChoice
              optionA={t(currentQuestion.optionAKey)}
              optionB={t(currentQuestion.optionBKey)}
              selectedOption={selectedOption}
              onSelect={handleOptionSelect}
            />
          </QuestionCard>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4 animate-fade-in animation-delay-200">
          <Button
            onClick={handleBack}
            disabled={currentQuestionIndex === 0}
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
          >
            {t("assessment.core.back")}
          </Button>

          <Button
            onClick={handleNext}
            disabled={!selectedOption}
            size="lg"
            className="w-full sm:w-auto"
          >
            {t("assessment.core.next")}
          </Button>
        </div>

        {/* Validation message */}
        {!selectedOption && (
          <Small 
            className="text-center mt-4 text-content-tertiary animate-fade-in animation-delay-300 block"
          >
            {t("assessment.core.selectOption")}
          </Small>
        )}
      </div>
    </PageLayout>
  );
}
