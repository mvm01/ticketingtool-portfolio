'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { ClipboardList } from 'lucide-react'
import { useAuth } from '@/features/auth/context'
import { useIncidents } from '@/features/incidents/context'
import { SeverityBadge } from '@/components/shared/severity-badge'
import { StatusBadge } from '@/components/shared/status-badge'
import { formatRelativeTime } from '@/lib/utils'

export default function MyIncidentsPage() {
  const t      = useTranslations('mobile.myIncidents')
  const locale = useLocale()
  const { user } = useAuth()
  const { incidents } = useIncidents()

  const mine = incidents
    .filter((i) => i.reporterId === user?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="mobile-page">
      <h1 className="mobile-page__title">{t('title')}</h1>

      {mine.length === 0 ? (
        <div className="mobile-empty">
          <ClipboardList className="mobile-empty__icon" />
          <p className="mobile-empty__text">{t('empty')}</p>
          <p className="mobile-empty__sub">{t('emptyDesc')}</p>
        </div>
      ) : (
        <div className="mobile-incident-list">
          {mine.map((incident) => (
            <Link
              key={incident.id}
              href={`/${locale}/m/my-incidents/${incident.id}`}
              className="mobile-incident-row"
            >
              <div className="mobile-incident-row__top">
                <SeverityBadge severity={incident.severity} />
                <span className="mobile-incident-row__time">
                  {formatRelativeTime(incident.createdAt)}
                </span>
              </div>
              <p className="mobile-incident-row__title">{incident.title}</p>
              <StatusBadge status={incident.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
