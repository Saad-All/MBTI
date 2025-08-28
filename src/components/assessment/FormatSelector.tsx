import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export type FormatType = 'scenarios' | 'traits' | 'sais'

interface FormatSelectorProps {
  onSelect: (format: FormatType) => void
  selectedFormat?: FormatType | null
}

interface FormatOption {
  id: FormatType
  titleKey: string
  descriptionKey: string
  icon: string
}

const formatOptions: FormatOption[] = [
  {
    id: 'scenarios',
    titleKey: 'format.scenarios.title',
    descriptionKey: 'format.scenarios.description',
    icon: '🎭'
  },
  {
    id: 'traits',
    titleKey: 'format.traits.title',
    descriptionKey: 'format.traits.description',
    icon: '⚖️'
  },
  {
    id: 'sais',
    titleKey: 'format.sais.title',
    descriptionKey: 'format.sais.description',
    icon: '🧠'
  }
]

export const FormatSelector: React.FC<FormatSelectorProps> = ({ 
  onSelect, 
  selectedFormat
}) => {
  const { t } = useTranslation()
  const formatSelectionEnabled = process.env.NEXT_PUBLIC_FORMAT_SELECTION_ENABLED !== 'false'
  const [selected, setSelected] = useState<FormatType | null>(selectedFormat || null)

  useEffect(() => {
    if (!formatSelectionEnabled) {
      // Auto-select scenarios and continue
      onSelect('scenarios')
    }
  }, [formatSelectionEnabled, onSelect])

  const handleSelect = (format: FormatType) => {
    setSelected(format)
    onSelect(format)
  }

  if (!formatSelectionEnabled) {
    return (
      <div className="p-6 text-center">
        <p>{t('format.preparingAssessment')}</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {formatOptions.map((format) => (
        <div
          key={format.id}
          onClick={() => handleSelect(format.id)}
          className={`
            relative bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all
            ${selected === format.id ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-lg'}
          `}
        >
          {selected === format.id && (
            <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          
          <div className="text-3xl mb-3">{format.icon}</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {t(format.titleKey)}
          </h3>
          <p className="text-gray-600 text-sm">
            {t(format.descriptionKey)}
          </p>
        </div>
      ))}
    </div>
  )
}