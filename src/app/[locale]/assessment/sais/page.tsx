"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAssessmentStore } from "@/lib/stores/assessment-store";
import { useAssessmentPersistence } from "@/lib/hooks/useAssessmentPersistence";
import { QuestionCard } from "@/components/assessment/QuestionCard";
import { SAISDistribution } from "@/components/assessment/SAISDistribution";
import { ProgressBar } from "@/components/assessment/ProgressBar";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { Button } from "@/components/ui/Button";
import { H2, H3, Text, Small } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import { PageLayout } from "@/components/layout/PageLayout";
import { QuestionResponse, MBTIDimension } from "@/lib/types";
import saisArQuestions from "@/data/questions/sais-ar.json";
import saisEnQuestions from "@/data/questions/sais-en.json";

interface SAISAssessmentProps {
  params: { locale: string };
}

interface SAISQuestion {
  id: string;
  dimension: string;
  statement: string;
  optionA: string;
  optionB: string;
  optionATendency: string;
  optionBTendency: string;
}

export default function SAISAssessment({
  params: { locale },
}: SAISAssessmentProps) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentDistribution, setCurrentDistribution] = useState({
    pointsA: 2,
    pointsB: 3,
  });

  const {
    sessionId,
    language,
    setLanguage,
    addResponse,
    responses,
    setProgress,
    setCurrentStep,
    selectedFormat,
    interimResults,
  } = useAssessmentPersistence();

  // Initialize language on mount
  useEffect(() => {
    setLanguage(locale as "ar" | "en");
    setCurrentStep("questions");
  }, [locale, setLanguage, setCurrentStep]);

  // Redirect if no session or wrong format
  useEffect(() => {
    if (!sessionId || selectedFormat !== "sais") {
      router.push(`/${locale}`);
    }
  }, [sessionId, selectedFormat, locale, router]);

  // Get questions based on language
  const questions: SAISQuestion[] =
    language === "ar"
      ? saisArQuestions.assessment.sais.questions
      : saisEnQuestions.assessment.sais.questions;

  const intro =
    language === "ar"
      ? saisArQuestions.assessment.sais.intro
      : saisEnQuestions.assessment.sais.intro;

  const instructions =
    language === "ar"
      ? saisArQuestions.assessment.sais.instructions
      : saisEnQuestions.assessment.sais.instructions;

  // Calculate total progress (core questions + SAIS questions)
  const totalCoreQuestions = 4; // From core assessment
  const currentTotalQuestion = totalCoreQuestions + currentQuestionIndex + 1;
  const totalQuestions = totalCoreQuestions + questions.length;

  // Update progress
  useEffect(() => {
    const progress = (currentTotalQuestion / totalQuestions) * 100;
    setProgress(progress);
  }, [currentTotalQuestion, totalQuestions, setProgress]);

  // Check if current question was already answered
  useEffect(() => {
    const currentQuestion = questions[currentQuestionIndex];
    const existingResponse = responses.find(
      (r) => r.questionId === currentQuestion.id
    );
    if (
      existingResponse &&
      existingResponse.distributionA !== undefined &&
      existingResponse.distributionB !== undefined
    ) {
      setCurrentDistribution({
        pointsA: existingResponse.distributionA,
        pointsB: existingResponse.distributionB,
      });
    } else {
      setCurrentDistribution({ pointsA: 2, pointsB: 3 });
    }
  }, [currentQuestionIndex, responses, questions]);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleDistribute = (pointsA: number, pointsB: number) => {
    setCurrentDistribution({ pointsA, pointsB });
  };

  const handleNext = () => {
    if (
      !sessionId ||
      currentDistribution.pointsA + currentDistribution.pointsB !== 5
    )
      return;

    // Create response
    const response: QuestionResponse = {
      responseId: `resp_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      sessionId,
      questionId: currentQuestion.id,
      questionType: "extended",
      responseType: "distribution",
      distributionA: currentDistribution.pointsA,
      distributionB: currentDistribution.pointsB,
      mbtiDimension: currentQuestion.dimension as MBTIDimension,
      score: 0,
      timestamp: new Date(),
      selectedOption:
        currentDistribution.pointsA > currentDistribution.pointsB ? "A" : "B",
      tendency:
        currentDistribution.pointsA > currentDistribution.pointsB
          ? currentQuestion.optionATendency
          : currentQuestion.optionBTendency,
    };

    // Add response to store
    addResponse(response);

    // Navigate to next question or processing page
    if (isLastQuestion) {
      // Navigate to processing page instead of direct results
      setTimeout(() => {
        router.push(`/${locale}/assessment/processing`);
      }, 100);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      // Go back to format selection
      router.push(`/${locale}/assessment/format`);
    }
  };

  if (!sessionId || selectedFormat !== "sais") {
    return null;
  }

  return (
    <PageLayout containerSize="md" className="bg-gradient-accent">
      {/* Header */}
      <header className="absolute top-0 right-0 rtl:right-auto rtl:left-0 p-4 sm:p-6">
        <LanguageToggle variant="compact" />
      </header>

      <div className="pt-16 pb-8 md:pt-20 md:pb-16">
        {/* Title and Instructions */}
        {currentQuestionIndex === 0 && (
          <div className="mb-8 text-center animate-fade-in">
            <H2 className="mb-4 text-content-primary">
              {intro.title}
            </H2>
            <Text className="text-content-secondary mb-6">
              {intro.description}
            </Text>
            <Card className="p-6 text-left rtl:text-right">
              <H3 className="mb-3 text-content-primary">
                {instructions.title}
              </H3>
              <ul className="space-y-2">
                {instructions.examples.map((example, index) => (
                  <li
                    key={index}
                    className="flex gap-2 rtl:flex-row-reverse"
                  >
                    <span className="text-content-tertiary">•</span>
                    <Small className="text-content-secondary">
                      {example}
                    </Small>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}

        {/* Progress */}
        <div className="mb-8 animate-fade-in">
          <ProgressBar
            current={currentTotalQuestion}
            total={totalQuestions}
            showLabel={true}
            labelText={t("assessment.sais.progress", {
              current: currentTotalQuestion,
              total: totalQuestions,
              defaultValue: `Question ${currentTotalQuestion} of ${totalQuestions}`,
            })}
          />
        </div>

        {/* Question */}
        <div className="animate-fade-in animation-delay-100">
          <QuestionCard question={currentQuestion.statement}>
            <SAISDistribution
              optionA={currentQuestion.optionA}
              optionB={currentQuestion.optionB}
              optionATendency={currentQuestion.optionATendency}
              optionBTendency={currentQuestion.optionBTendency}
              initialDistribution={currentDistribution}
              onDistribute={handleDistribute}
            />
          </QuestionCard>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4 animate-fade-in animation-delay-200">
          <Button
            onClick={handleBack}
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
          >
            {t("assessment.sais.back", { defaultValue: "Back" })}
          </Button>

          <Button
            onClick={handleNext}
            disabled={
              currentDistribution.pointsA + currentDistribution.pointsB !== 5
            }
            variant="accent"
            size="lg"
            className="w-full sm:w-auto"
          >
            {isLastQuestion
              ? t("assessment.sais.complete", {
                  defaultValue: "Complete Assessment",
                })
              : t("assessment.sais.next", { defaultValue: "Next" })}
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
