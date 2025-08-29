"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAssessmentStore } from "@/lib/stores/assessment-store";

interface ResultsPageProps {
  params: { locale: string };
}

/**
 * General results router - redirects to methodology-specific results pages
 * This ensures backward compatibility while routing to consciousness-focused results for SAIS
 */
export default function ResultsPage({ params: { locale } }: ResultsPageProps) {
  const router = useRouter();
  const { sessionId, selectedFormat } = useAssessmentStore();

  useEffect(() => {
    // Don't process if no session
    if (!sessionId) {
      console.error("No session ID found, redirecting to home");
      router.push(`/${locale}`);
      return;
    }

    // Route to methodology-specific results pages
    switch (selectedFormat) {
      case "sais":
        // Redirect to consciousness-focused SAIS results
        router.push(`/${locale}/results/sais`);
        break;

      case "scenarios":
      case "traits":
        // For now, redirect to standard results (to be implemented later)
        console.log(
          `${selectedFormat} results not yet implemented, staying on general results`
        );
        // TODO: Implement standard results page for scenarios/traits
        router.push(`/${locale}`); // Temporary redirect to home
        break;

      default:
        console.error("Unknown assessment format:", selectedFormat);
        router.push(`/${locale}`);
        break;
    }
  }, [sessionId, selectedFormat, locale, router]);

  // Loading state while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">جاري تحضير النتائج...</p>
      </div>
    </div>
  );
}
