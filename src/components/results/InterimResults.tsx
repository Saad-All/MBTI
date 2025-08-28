import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'

interface InterimResultsProps {
  session: {
    mbtiType: string
    confidence: number
    insights: string[]
    disclaimer: string
  }
  onContinue: () => void
}

export const InterimResults: React.FC<InterimResultsProps> = ({ session, onContinue }) => {
  const { t } = useTranslation()
  const showInterim = process.env.NEXT_PUBLIC_INTERIM_RESULTS_ENABLED !== 'false'

  if (!showInterim) {
    // Rollback: Simple continue button without interim insights
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">{t('interim.readyToContinue')}</h2>
        <p className="mb-6">{t('interim.chooseFormat')}</p>
        <Button 
          onClick={onContinue}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          {t('interim.continueButton')}
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-indigo-100 rounded-full mb-4">
          <span className="text-3xl font-bold text-indigo-600">
            {session.mbtiType}
          </span>
        </div>
        <p className="text-sm text-gray-500">
          {t('interim.confidenceLevel', { confidence: session.confidence })}
        </p>
      </div>

      <div className="space-y-3 mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          {t('interim.insightsTitle')}
        </h3>
        {session.insights.map((insight, index) => (
          <div key={index} className="bg-blue-50 p-3 rounded-lg">
            <p className="text-gray-700">{insight}</p>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-amber-800">
          <span className="font-semibold">{t('interim.note')}: </span>
          {session.disclaimer}
        </p>
      </div>

      <div className="text-center">
        <Button onClick={onContinue} size="lg">
          {t('interim.continueButton')}
        </Button>
      </div>
    </div>
  )
}