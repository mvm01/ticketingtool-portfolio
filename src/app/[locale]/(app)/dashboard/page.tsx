'use client'

import { useTranslations } from 'next-intl'
import { useAuth } from '@/features/auth/context'
import { useIncidents } from '@/features/incidents/context'
import { IncidentCard } from '@/components/shared/incident-card'

export default function DashboardPage() {
  const t = useTranslations('dashboard')
  const { user } = useAuth()
  const { incidents } = useIncidents()

  const open = incidents.filter((i) => i.status === 'open').length
  const inProgress = incidents.filter((i) => i.status === 'in_progress').length
  const resolved = incidents.filter((i) => i.status === 'resolved').length
  const critical = incidents.filter(
    (i) => i.severity === 'critical' && i.status !== 'resolved' && i.status !== 'archived',
  )
  const recent = incidents
    .filter((i) => i.status !== 'archived')
    .slice(0, 5)

  return (
    <div>
      <div className="page-header">
        <h1 className="page-header__title">
          {t('greeting')}, {user?.profile?.fullName?.split(' ')[0] ?? user?.email?.split('@')[0] ?? ''}
        </h1>
      </div>

      <div className="section">
        <div className="section__grid section__grid--stats">
          <div className="stat-card">
            <span className="stat-card__label">{t('openIncidents')}</span>
            <span className="stat-card__value">{open}</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__label">{t('inProgress')}</span>
            <span className="stat-card__value">{inProgress}</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__label">{t('resolved')}</span>
            <span className="stat-card__value">{resolved}</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__label">{t('totalToday')}</span>
            <span className="stat-card__value">{incidents.length}</span>
          </div>
        </div>
      </div>

      {critical.length > 0 && (
        <div className="section">
          <p className="section__title">{t('criticalIncidents')}</p>
          <div className="section__grid">
            {critical.map((incident) => (
              <IncidentCard key={incident.id} incident={incident} />
            ))}
          </div>
        </div>
      )}

      <div className="section">
        <p className="section__title">{t('recentIncidents')}</p>
        {recent.length === 0 ? (
          <p className="empty-state__desc">{t('allClear')}</p>
        ) : (
          <div className="section__grid">
            {recent.map((incident) => (
              <IncidentCard key={incident.id} incident={incident} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
