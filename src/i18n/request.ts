import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from '@/lib/i18n/config'

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale
  if (!locale || !locales.includes(locale as 'en' | 'es')) notFound()

  return {
    locale,
    messages: (await import(`../../locales/${locale}/common.json`)).default,
  }
})
