"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAssessmentStore } from "@/lib/stores/assessment-store";
import { Button } from "@/components/ui/Button";
import { ConsciousnessProfile, Language } from "@/lib/types";

interface ChatPageProps {
  params: { locale: string };
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatPage({ params: { locale } }: ChatPageProps) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language, calculatedType } = useAssessmentStore();

  // Get consciousness context from URL params (for SAIS users)
  const mbtiType = searchParams.get("mbtiType") || calculatedType;
  const methodology = searchParams.get("methodology");
  const consciousnessParam = searchParams.get("consciousness");

  let consciousnessProfile: ConsciousnessProfile | null = null;
  if (consciousnessParam) {
    try {
      consciousnessProfile = JSON.parse(consciousnessParam);
    } catch (e) {
      console.warn("Failed to parse consciousness profile from URL");
    }
  }

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initial consciousness-focused greeting for SAIS users
  useEffect(() => {
    if (methodology === "sais" && mbtiType && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: "welcome-consciousness",
        role: "assistant",
        content: getSAISWelcomeMessage(mbtiType, consciousnessProfile),
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    } else if (!methodology && mbtiType && messages.length === 0) {
      // Standard MBTI welcome
      const welcomeMessage: ChatMessage = {
        id: "welcome-standard",
        role: "assistant",
        content: `أهلاً وسهلاً! تهانينا على إتمام تقييم الشخصية وحصولك على نتيجة ${mbtiType}. أنا هنا لمساعدتك في فهم شخصيتك بشكل أعمق. ما الذي تود أن تعرفه عن نمط شخصيتك؟`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [methodology, mbtiType, consciousnessProfile, messages.length]);

  const getSAISWelcomeMessage = (
    mbtiType: string,
    profile: ConsciousnessProfile | null
  ): string => {
    if (!profile) {
      return `🌟 مرحباً بك في رحلة استكشاف الوعي! تهانينا على إتمام تقييم الشخصية باستخدام منهجية SAIS وحصولك على نمط ${mbtiType}. 

أنا مرشدك الذكي، هنا لمساعدتك في فهم أنماط وعيك وتطوير إمكانياتك الداخلية. 

ما الذي تود أن نستكشفه معاً في رحلة تطوير وعيك؟`;
    }

    return `🌟 أهلاً وسهلاً في مساحة الوعي والتطوير الذكي! 

تهانينا على إتمام رحلة التقييم باستخدام منهجية SAIS واكتشاف نمط شخصيتك ${mbtiType} من منظور الوعي العميق.

🧠 ملفك الشخصي:
• ${profile.energySourcePattern.arabicDomainName} (${profile.energySourcePattern.percentage}%)
• ${profile.awarenessStyle.arabicDomainName} (${profile.awarenessStyle.percentage}%)  
• ${profile.decisionMakingCenter.arabicDomainName} (${profile.decisionMakingCenter.percentage}%)
• ${profile.lifeStructurePreference.arabicDomainName} (${profile.lifeStructurePreference.percentage}%)

أنا مرشدك الذكي، هنا لمساعدتك في استكشاف أعماق شخصيتك وتطوير وعيك. 

ما الجانب من وعيك تود أن نستكشفه أولاً؟`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputMessage,
          mbtiType,
          language,
          methodology,
          consciousnessProfile,
          conversationHistory: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "عذراً، حدث خطأ في المحادثة. يرجى المحاولة مرة أخرى.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Consciousness-focused question suggestions for SAIS users
  const consciousnessQuestions = [
    "كيف يمكنني تطوير اتصالي بمركزي الجذري العميق؟",
    "ما هي ممارسات التأمل المناسبة لنمط شخصيتي؟",
    "كيف يمكنني تعزيز بصيرتي الداخلية؟",
    "ما هي طرق تطوير بوصلة قيمي الداخلية؟",
    "كيف أحقق التناغم بين عالمي الداخلي والخارجي؟",
    "ما هي مراحل النمو الروحي المناسبة لي؟",
  ];

  const standardQuestions = [
    "ما هي نقاط قوتي الرئيسية؟",
    "كيف يمكنني تطوير مهاراتي في العمل؟",
    "ما النصائح للعلاقات الشخصية؟",
    "كيف أتعامل مع التحديات؟",
  ];

  const suggestedQuestions =
    methodology === "sais" ? consciousnessQuestions : standardQuestions;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-t-xl p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {methodology === "sais"
                    ? "🧠 مرشد الوعي والتطوير النفسي"
                    : "💬 مدرب الشخصية الذكي"}
                </h1>
                {mbtiType && (
                  <p className="text-sm text-gray-600 mt-1">
                    نمط شخصيتك: {mbtiType}
                    {methodology === "sais" && " (منهجية الوعي العميق)"}
                  </p>
                )}
              </div>
              <Button
                onClick={() => router.back()}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                ← عودة للنتائج
              </Button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="bg-white h-96 overflow-y-auto p-6 border-l border-r border-gray-200">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : methodology === "sais"
                        ? "bg-gradient-to-br from-purple-100 to-indigo-100 text-gray-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                    style={{ direction: "rtl" }}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                    <p className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString("ar-SA")}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="animate-pulse flex space-x-1">
                        <div className="rounded-full bg-gray-400 h-2 w-2"></div>
                        <div className="rounded-full bg-gray-400 h-2 w-2"></div>
                        <div className="rounded-full bg-gray-400 h-2 w-2"></div>
                      </div>
                      <span className="text-gray-600 text-sm">
                        جاري التفكير...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="bg-white rounded-b-xl p-6 border-t border-gray-200">
            <div className="flex gap-4">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  methodology === "sais"
                    ? "شاركني أفكارك حول رحلة الوعي..."
                    : "اسألني عن شخصيتك..."
                }
                rows={2}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                style={{ direction: "rtl" }}
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                variant="primary"
                className={
                  methodology === "sais"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }
              >
                إرسال
              </Button>
            </div>

            {/* Suggested Questions */}
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">
                {methodology === "sais"
                  ? "💡 أسئلة لاستكشاف الوعي:"
                  : "💡 أسئلة مقترحة:"}
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.slice(0, 3).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(question)}
                    className={`px-3 py-2 text-xs rounded-full border transition-colors ${
                      methodology === "sais"
                        ? "border-purple-300 text-purple-700 hover:bg-purple-50"
                        : "border-blue-300 text-blue-700 hover:bg-blue-50"
                    }`}
                    disabled={isLoading}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Consciousness Context Display for SAIS users */}
          {methodology === "sais" && consciousnessProfile && (
            <div className="mt-6 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-6">
              <h3 className="text-lg font-bold text-purple-800 mb-3">
                🌟 سياق الوعي الخاص بك
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-purple-700">
                    مصدر الطاقة:
                  </span>
                  <br />
                  {consciousnessProfile.energySourcePattern.arabicDomainName} (
                  {consciousnessProfile.energySourcePattern.percentage}%)
                </div>
                <div>
                  <span className="font-medium text-purple-700">
                    أسلوب الإدراك:
                  </span>
                  <br />
                  {consciousnessProfile.awarenessStyle.arabicDomainName} (
                  {consciousnessProfile.awarenessStyle.percentage}%)
                </div>
                <div>
                  <span className="font-medium text-purple-700">
                    مركز القرار:
                  </span>
                  <br />
                  {consciousnessProfile.decisionMakingCenter.arabicDomainName} (
                  {consciousnessProfile.decisionMakingCenter.percentage}%)
                </div>
                <div>
                  <span className="font-medium text-purple-700">
                    تنظيم الحياة:
                  </span>
                  <br />
                  {
                    consciousnessProfile.lifeStructurePreference
                      .arabicDomainName
                  }{" "}
                  ({consciousnessProfile.lifeStructurePreference.percentage}%)
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
