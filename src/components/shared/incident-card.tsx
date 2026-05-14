'use client'

import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { formatRelativeTime } from '@/lib/utils'
import { SeverityBadge } from './severity-badge'
import { StatusBadge } from './status-badge'
import type { Incident } from '@/types'

interface IncidentCardProps {
  incident: Incident
}

export function IncidentCard({ incident }: IncidentCardProps) {
  const t = useTranslations('incidents')
  const locale = useLocale()

  return (
    <Link
      href={`/${locale}/incidents/${incident.id}`}
      className="incident-card"
    >
      <div className="incident-card__header">
        <div className="incident-card__badges">
          <SeverityBadge severity={incident.severity} />
          <StatusBadge status={incident.status} />
        </div>
        <span className="incident-card__time">
          {formatRelativeTime(incident.createdAt)}
        </span>
      </div>

      <h3 className="incident-card__title">{incident.title}</h3>

      {incident.description && (
        <p className="incident-card__description">{incident.description}</p>
      )}

      <div className="incident-card__footer">
        <span className="incident-card__reporter">
          {t('reportedBy')}: {incident.reporter?.fullName ?? '—'}
        </span>
        {incident.assignee && (
          <span className="incident-card__assignee">
            {t('assignTo')}: {incident.assignee.fullName}
          </span>
        )}
      </div>
    </Link>
  )
}
