import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { H3, Text } from '@/components/ui/Typography'

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
        <Card
          key={format.id}
          onClick={() => handleSelect(format.id)}
          variant={selected === format.id ? 'selected' : 'interactive'}
          className="relative p-6 cursor-pointer transition-all duration-200 transform hover:scale-105"
        >
          {selected === format.id && (
            <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center animate-scale-in">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          
          <div className="text-4xl mb-4 animate-bounce-subtle">{format.icon}</div>
          <H3 className="mb-2 text-content-primary">
            {t(format.titleKey)}
          </H3>
          <Text variant="small" className="text-content-secondary">
            {t(format.descriptionKey)}
          </Text>
        </Card>
      ))}
    </div>
  )
}