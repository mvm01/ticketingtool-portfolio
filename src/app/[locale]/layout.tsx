import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/features/auth/context'
import { IncidentsProvider } from '@/features/incidents/context'
import { locales } from '@/lib/i18n/config'
import type { Locale } from '@/lib/i18n/config'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) notFound()

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <AuthProvider>
        <IncidentsProvider>
          {children}
          <Toaster richColors position="top-right" />
        </IncidentsProvider>
      </AuthProvider>
    </NextIntlClientProvider>
  )
}
