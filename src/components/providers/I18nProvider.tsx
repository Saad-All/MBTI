'use client'

import { I18nextProvider } from 'react-i18next'
import { useEffect, useState } from 'react'
import initI18n from '@/lib/utils/i18n'

export function I18nProvider({
  children,
  locale,
}: {
  children: React.ReactNode
  locale: string
}) {
  const [i18nInstance, setI18nInstance] = useState<any>(null)

  useEffect(() => {
    initI18n(locale).then((instance) => {
      setI18nInstance(instance)
    })
  }, [locale])

  if (!i18nInstance) {
    return null
  }

  return (
    <I18nextProvider i18n={i18nInstance}>
      {children}
    </I18nextProvider>
  )
}