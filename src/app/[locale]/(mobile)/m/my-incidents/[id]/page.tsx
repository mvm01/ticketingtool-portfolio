'use client'

import { use } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { SeverityBadge } from '@/components/shared/severity-badge'
import { StatusBadge } from '@/components/shared/status-badge'
import { useIncidents } from '@/features/incidents/context'
import { formatRelativeTime } from '@/lib/utils'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function MobileIncidentDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const t      = useTranslations('incidents')
  const locale = useLocale()
  const router = useRouter()
  const { incidents } = useIncidents()

  const incident = incidents.find((i) => i.id === id)

  if (!incident) {
    return (
      <div className="mobile-page mobile-page--centered">
        <p className="mobile-empty__text">{t('noIncidents')}</p>
        <button
          className="mobile-btn mobile-btn--ghost"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>
      </div>
    )
  }

  return (
    <div className="mobile-page">
      <button className="mobile-back-btn" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4" />
        <span>{t('title')}</span>
      </button>

      <div className="mobile-detail">
        <div className="mobile-detail__badges">
          <SeverityBadge severity={incident.severity} />
          <StatusBadge status={incident.status} />
        </div>

        <h1 className="mobile-detail__title">{incident.title}</h1>

        <p className="mobile-detail__time">
          {formatRelativeTime(incident.createdAt)}
        </p>

        {incident.description && (
          <div className="mobile-detail__card">
            <p className="mobile-detail__desc">{incident.description}</p>
          </div>
        )}

        <div className="mobile-detail__card">
          <MobileDetailRow label={t('fields.category')} value={incident.category} />
          <MobileDetailRow label={t('reportedBy')} value={incident.reporter?.fullName ?? '—'} />
          {incident.assignee && (
            <MobileDetailRow label={t('assignTo')} value={incident.assignee.fullName ?? '—'} />
          )}
          {incident.resolvedAt && (
            <MobileDetailRow
              label={t('resolvedAt')}
              value={new Date(incident.resolvedAt).toLocaleDateString()}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function MobileDetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mobile-detail__row">
      <span className="mobile-detail__row-label">{label}</span>
      <span className="mobile-detail__row-value">{value}</span>
    </div>
  )
}
