'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { Plus, AlertTriangle } from 'lucide-react'
import { useIncidents } from '@/features/incidents/context'
import { IncidentCard } from '@/components/shared/incident-card'
import { PageTransition } from '@/components/shared/page-transition'
import { AnimatedList, AnimatedItem } from '@/components/shared/animated-list'
import { itemVariants } from '@/lib/motion/variants'
import type { IncidentStatus } from '@/types'

const ALL = 'all' as const
type Filter = IncidentStatus | typeof ALL

export default function IncidentsPage() {
  const t       = useTranslations('incidents')
  const tStatus = useTranslations('incidents.status')
  const locale  = useLocale()
  const { incidents } = useIncidents()
  const [filter, setFilter] = useState<Filter>(ALL)

  const filters: Filter[] = [ALL, 'open', 'in_progress', 'resolved', 'archived']
  const filtered = filter === ALL ? incidents : incidents.filter((i) => i.status === filter)

  return (
    <PageTransition>
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

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '0.25rem 0.875rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              border: '1px solid',
              borderColor: filter === f ? 'var(--brand-400)' : 'rgba(255,255,255,0.1)',
              background: filter === f ? 'var(--brand-400)' : 'transparent',
              color: filter === f ? '#ffffff' : 'var(--silver-400)',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {f === ALL ? 'All' : tStatus(f)}
          </button>
        ))}
      </div>

      {/* List — re-animates when filter changes */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            className="empty-state"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
          >
            <AlertTriangle className="empty-state__icon" />
            <p className="empty-state__title">{t('noIncidents')}</p>
            <p className="empty-state__desc">{t('noIncidentsDesc')}</p>
          </motion.div>
        ) : (
          <AnimatedList key={filter} className="section__grid">
            {filtered.map((incident) => (
              <AnimatedItem key={incident.id}>
                <IncidentCard incident={incident} />
              </AnimatedItem>
            ))}
          </AnimatedList>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
