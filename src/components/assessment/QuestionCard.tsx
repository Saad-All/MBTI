'use client'

interface QuestionCardProps {
  question: string
  children: React.ReactNode
}

export function QuestionCard({ question, children }: QuestionCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-10">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-8">
        {question}
      </h2>
      <div>{children}</div>
    </div>
  )
}