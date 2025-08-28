import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import commonEn from '../../../public/locales/en/common.json'
import commonAr from '../../../public/locales/ar/common.json'

const resources = {
  en: {
    common: commonEn,
  },
  ar: {
    common: commonAr,
  },
}

const initI18n = async (locale: string) => {
  if (i18n.isInitialized) {
    await i18n.changeLanguage(locale)
    return i18n
  }

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: locale,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      defaultNS: 'common',
    })

  return i18n
}

export default initI18n
export { useTranslation } from 'react-i18next'