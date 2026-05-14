'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/features/auth/context'
import { useIncidents } from '@/features/incidents/context'
import { IncidentCard } from '@/components/shared/incident-card'
import { PageTransition } from '@/components/shared/page-transition'
import { AnimatedList, AnimatedItem } from '@/components/shared/animated-list'
import { listVariants, statVariants } from '@/lib/motion/variants'

export default function DashboardPage() {
  const t = useTranslations('dashboard')
  const { user } = useAuth()
  const { incidents } = useIncidents()

  const open       = incidents.filter((i) => i.status === 'open').length
  const inProgress = incidents.filter((i) => i.status === 'in_progress').length
  const resolved   = incidents.filter((i) => i.status === 'resolved').length
  const critical   = incidents.filter(
    (i) => i.severity === 'critical' && i.status !== 'resolved' && i.status !== 'archived',
  )
  const recent = incidents.filter((i) => i.status !== 'archived').slice(0, 5)

  const stats = [
    { label: t('openIncidents'), value: open },
    { label: t('inProgress'),    value: inProgress },
    { label: t('resolved'),      value: resolved },
    { label: t('totalToday'),    value: incidents.length },
  ]

  return (
    <PageTransition>
      <div className="page-header">
        <h1 className="page-header__title">
          {t('greeting')},{' '}
          {user?.profile?.fullName?.split(' ')[0] ?? user?.email?.split('@')[0] ?? ''}
        </h1>
      </div>

      {/* Stats — staggered scale-up */}
      <div className="section">
        <motion.div
          className="section__grid section__grid--stats"
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          {stats.map((s) => (
            <motion.div key={s.label} className="stat-card" variants={statVariants}>
              <span className="stat-card__label">{s.label}</span>
              <span className="stat-card__value">{s.value}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Critical incidents */}
      {critical.length > 0 && (
        <div className="section">
          <p className="section__title">{t('criticalIncidents')}</p>
          <AnimatedList className="section__grid">
            {critical.map((incident) => (
              <AnimatedItem key={incident.id}>
                <IncidentCard incident={incident} />
              </AnimatedItem>
            ))}
          </AnimatedList>
        </div>
      )}

      {/* Recent incidents */}
      <div className="section">
        <p className="section__title">{t('recentIncidents')}</p>
        {recent.length === 0 ? (
          <p className="empty-state__desc">{t('allClear')}</p>
        ) : (
          <AnimatedList className="section__grid">
            {recent.map((incident) => (
              <AnimatedItem key={incident.id}>
                <IncidentCard incident={incident} />
              </AnimatedItem>
            ))}
          </AnimatedList>
        )}
      </div>
    </PageTransition>
  )
}
