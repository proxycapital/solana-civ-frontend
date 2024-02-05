import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enUS from './locales/en-us'
import ptBR from './locales/pt-br'

const resources = {
  enUs: {
    translation: enUS,
  },
  ptBR: {
    translation: ptBR,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'enUs',
  })

export default i18n

