"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAssessmentStore } from "@/lib/stores/assessment-store";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { H1, H3, Text } from "@/components/ui/Typography";
import { ProgressBar } from "@/components/assessment/ProgressBar";
import { clsx } from "clsx";

type FormatType = "scenarios" | "traits" | "sais";

interface FormatOption {
  id: FormatType;
  titleKey: string;
  descriptionKey: string;
  questionStyleKey: string;
  scoringMethodKey: string;
  resultFocusKey: string;
  icon: string;
}

const formatOptions: FormatOption[] = [
  {
    id: "scenarios",
    titleKey: "format.scenarios.title",
    descriptionKey: "format.scenarios.description",
    questionStyleKey: "format.scenarios.questionStyle",
    scoringMethodKey: "format.scenarios.scoringMethod",
    resultFocusKey: "format.scenarios.resultFocus",
    icon: "🎭",
  },
  {
    id: "traits",
    titleKey: "format.traits.title",
    descriptionKey: "format.traits.description",
    questionStyleKey: "format.traits.questionStyle",
    scoringMethodKey: "format.traits.scoringMethod",
    resultFocusKey: "format.traits.resultFocus",
    icon: "⚖️",
  },
  {
    id: "sais",
    titleKey: "format.sais.title",
    descriptionKey: "format.sais.description",
    questionStyleKey: "format.sais.questionStyle",
    scoringMethodKey: "format.sais.scoringMethod",
    resultFocusKey: "format.sais.resultFocus",
    icon: "🧠",
  },
];

export default function FormatSelectionPage() {
  const formatSelectionEnabled =
    process.env.NEXT_PUBLIC_FORMAT_SELECTION_ENABLED !== "false";
  const router = useRouter();
  const { t } = useTranslation();
  const {
    language,
    selectedFormat,
    setSelectedFormat,
    setCurrentStep,
    updateProgress,
  } = useAssessmentStore();

  const [selected, setSelected] = useState<FormatType | null>(selectedFormat);

  useEffect(() => {
    if (!formatSelectionEnabled) {
      setSelectedFormat("scenarios");
      setCurrentStep("questions");
      router.push(`/${language}/assessment/scenarios`);
      return;
    }

    if (selectedFormat) {
      setSelected(selectedFormat);
    }
  }, [
    formatSelectionEnabled,
    selectedFormat,
    language,
    router,
    setSelectedFormat,
    setCurrentStep,
  ]);

  const handleFormatSelect = (format: FormatType) => {
    setSelected(format);
  };

  const handleContinue = () => {
    if (!selected) return;

    setSelectedFormat(selected);
    setCurrentStep("questions");
    updateProgress(40);

    router.push(`/${language}/assessment/${selected}`);
  };

  if (!formatSelectionEnabled) {
    return (
      <div className="min-h-screen gradient-primary flex items-center justify-center">
        <div className="text-center">
          <Text>{t("format.preparingAssessment")}</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-primary dark:gradient-secondary py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar current={4} total={16} showLabel={true} labelText={t('assessment.progress')} />
        </div>

        <div className="text-center mb-12">
          <H1 className="mb-4">{t("format.title")}</H1>
          <Text className="text-xl">{t("format.subtitle")}</Text>
        </div>

        <div className="grid tablet:grid-cols-3 gap-6 mb-12">
          {formatOptions.map((format) => (
            <Card
              key={format.id}
              variant={selected === format.id ? "selected" : "interactive"}
              onClick={() => handleFormatSelect(format.id)}
              className="relative"
            >
              {selected === format.id && (
                <div className="absolute top-4 end-4 bg-primary-600 dark:bg-primary-500 text-white rounded-full p-1">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}

              <CardContent>
                <div className="text-4xl mb-4">{format.icon}</div>

                <H3 className="mb-3">{t(format.titleKey)}</H3>

                <Text className="mb-4">{t(format.descriptionKey)}</Text>

                <div className="space-y-2">
                  <div className="flex items-start">
                    <Text variant="small" className="font-semibold me-2">
                      {t("format.questionStyle")}:
                    </Text>
                    <Text variant="small">
                      {t(format.questionStyleKey)}
                    </Text>
                  </div>
                  <div className="flex items-start">
                    <Text variant="small" className="font-semibold me-2">
                      {t("format.scoringMethod")}:
                    </Text>
                    <Text variant="small">
                      {t(format.scoringMethodKey)}
                    </Text>
                  </div>
                  <div className="flex items-start">
                    <Text variant="small" className="font-semibold me-2">
                      {t("format.resultFocus")}:
                    </Text>
                    <Text variant="small">
                      {t(format.resultFocusKey)}
                    </Text>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={handleContinue}
            disabled={!selected}
            size="lg"
            className="min-w-[200px]"
          >
            {t("format.continueButton")}
          </Button>
        </div>
      </div>
    </div>
  );
}