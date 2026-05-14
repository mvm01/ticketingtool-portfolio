'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { Plus, AlertTriangle } from 'lucide-react'
import { useIncidents } from '@/features/incidents/context'
import { IncidentCard } from '@/components/shared/incident-card'
import type { IncidentStatus } from '@/types'

const ALL = 'all' as const
type Filter = IncidentStatus | typeof ALL

export default function IncidentsPage() {
  const t = useTranslations('incidents')
  const tStatus = useTranslations('incidents.status')
  const locale = useLocale()
  const { incidents } = useIncidents()
  const [filter, setFilter] = useState<Filter>(ALL)

  const filters: Filter[] = [ALL, 'open', 'in_progress', 'resolved', 'archived']

  const filtered =
    filter === ALL ? incidents : incidents.filter((i) => i.status === filter)

  return (
    <div>
      <div className="page-header">
        <h1 className="page-header__title">{t('title')}</h1>
        <Link
          href={`/${locale}/incidents/new`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.375rem 0.875rem',
            borderRadius: '0.5rem',
            background: 'var(--brand-400)',
            color: '#ffffff',
            fontSize: '0.875rem',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          <Plus style={{ width: '1rem', height: '1rem' }} />
          {t('new')}
        </Link>
      </div>

      <div className="flex gap-2 flex-wrap mb-5">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={[
              'px-3 py-1 rounded-full text-xs font-600 border transition-all',
              filter === f
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200',
            ].join(' ')}
          >
            {f === ALL ? 'All' : tStatus(f)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <AlertTriangle className="empty-state__icon" />
          <p className="empty-state__title">{t('noIncidents')}</p>
          <p className="empty-state__desc">{t('noIncidentsDesc')}</p>
        </div>
      ) : (
        <div className="section__grid">
          {filtered.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      )}
    </div>
  )
}
