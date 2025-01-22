import i18n from 'i18n'

export * from './en'
export * from './vi'

export function __(translate: string, options?: any) {
  return i18n.__(translate, options)
}

export function setLocale(lang?: string) {
  i18n.setLocale(lang || 'vi')
}
