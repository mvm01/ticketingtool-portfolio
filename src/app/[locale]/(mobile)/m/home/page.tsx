'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLocale, useTranslations } from 'next-intl'
import { AlertTriangle, Plus } from 'lucide-react'
import { useAuth } from '@/features/auth/context'
import { useIncidents } from '@/features/incidents/context'
import { SeverityBadge } from '@/components/shared/severity-badge'
import { StatusBadge } from '@/components/shared/status-badge'
import { PageTransition } from '@/components/shared/page-transition'
import { AnimatedList, AnimatedItem } from '@/components/shared/animated-list'
import { listVariants, statVariants } from '@/lib/motion/variants'
import { formatRelativeTime } from '@/lib/utils'

export default function MobileHomePage() {
  const t      = useTranslations('mobile.home')
  const locale = useLocale()
  const { user } = useAuth()
  const { incidents } = useIncidents()

  const firstName = user?.profile?.fullName?.split(' ')[0]
    ?? user?.email?.split('@')[0]
    ?? ''

  const active = incidents.filter(
    (i) => i.status === 'open' || i.status === 'in_progress',
  )
  const myOpen = incidents.filter(
    (i) => i.reporterId === user?.id && i.status === 'open',
  )
  const recent = incidents.filter((i) => i.status !== 'archived').slice(0, 4)

  return (
    <PageTransition>
      <div className="mobile-page">
        {/* Greeting */}
        <div className="mobile-page__greeting">
          <p className="mobile-page__greeting-text">
            {t('greeting')}, <strong>{firstName}</strong> 👋
          </p>
          <p className="mobile-page__org">{user?.organization?.name}</p>
        </div>

        {/* Stats */}
        <motion.div
          className="mobile-stats"
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="mobile-stat-card" variants={statVariants}>
            <span className="mobile-stat-card__value">{active.length}</span>
            <span className="mobile-stat-card__label">{t('activeIncidents')}</span>
          </motion.div>
          <motion.div className="mobile-stat-card" variants={statVariants}>
            <span className="mobile-stat-card__value">{myOpen.length}</span>
            <span className="mobile-stat-card__label">{t('myOpen')}</span>
          </motion.div>
        </motion.div>

        {/* Quick report CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.18, duration: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Link href={`/${locale}/m/report`} className="mobile-report-cta">
            <Plus className="mobile-report-cta__icon" />
            <span>{t('quickReport')}</span>
          </Link>
        </motion.div>

        {/* Recent activity */}
        <section className="mobile-section">
          <p className="mobile-section__title">{t('recentActivity')}</p>

          {recent.length === 0 ? (
            <div className="mobile-empty">
              <AlertTriangle className="mobile-empty__icon" />
              <p className="mobile-empty__text">{t('allClear')}</p>
            </div>
          ) : (
            <AnimatedList className="mobile-incident-list">
              {recent.map((incident) => (
                <AnimatedItem key={incident.id}>
                  <Link
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
                </AnimatedItem>
              ))}
            </AnimatedList>
          )}
        </section>
      </div>
    </PageTransition>
  )
}
