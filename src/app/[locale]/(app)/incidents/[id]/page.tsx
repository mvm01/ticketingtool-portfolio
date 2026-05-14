'use client'

import { use } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle, Archive } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SeverityBadge } from '@/components/shared/severity-badge'
import { StatusBadge } from '@/components/shared/status-badge'
import { useIncidents } from '@/features/incidents/context'
import { useAuth } from '@/features/auth/context'
import { canResolveIncident, canArchiveIncident } from '@/lib/auth/permissions'
import { formatRelativeTime } from '@/lib/utils'
import { toast } from 'sonner'

interface PageProps {
  params: Promise<{ id: string; locale: string }>
}

export default function IncidentDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const t = useTranslations('incidents')
  const tToast = useTranslations('toast')
  const locale = useLocale()
  const router = useRouter()
  const { incidents, setStatus } = useIncidents()
  const { user } = useAuth()

  const incident = incidents.find((i) => i.id === id)
  const role = user?.membership?.role ?? 'member'

  if (!incident) {
    return (
      <div className="empty-state">
        <p className="empty-state__title">{t('noIncidents')}</p>
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
    )
  }

  async function handleResolve() {
    await setStatus(id, 'resolved')
    toast.success(tToast('incidentResolved'))
  }

  async function handleArchive() {
    await setStatus(id, 'archived')
    toast.success(tToast('incidentArchived'))
  }

  return (
    <div className="incident-detail">
      <button
        className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 mb-5 transition-colors"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-4 h-4" />
        {t('title')}
      </button>

      <div className="incident-detail__meta">
        <SeverityBadge severity={incident.severity} />
        <StatusBadge status={incident.status} />
        <span className="text-xs text-slate-500">{formatRelativeTime(incident.createdAt)}</span>
      </div>

      <h1 className="incident-detail__title">{incident.title}</h1>

      {incident.description && (
        <div className="incident-detail__body">
          <p className="incident-detail__desc">{incident.description}</p>
        </div>
      )}

      <div className="incident-detail__body">
        <div className="incident-detail__field">
          <span className="incident-detail__field-label">{t('reportedBy')}</span>
          <span className="incident-detail__field-value">
            {incident.reporter?.fullName ?? '—'}
          </span>
        </div>
        {incident.assignee && (
          <div className="incident-detail__field">
            <span className="incident-detail__field-label">{t('assignTo')}</span>
            <span className="incident-detail__field-value">{incident.assignee.fullName}</span>
          </div>
        )}
        <div className="incident-detail__field">
          <span className="incident-detail__field-label">{t('createdAt')}</span>
          <span className="incident-detail__field-value">
            {new Date(incident.createdAt).toLocaleString()}
          </span>
        </div>
        {incident.resolvedAt && (
          <div className="incident-detail__field">
            <span className="incident-detail__field-label">{t('resolvedAt')}</span>
            <span className="incident-detail__field-value">
              {new Date(incident.resolvedAt).toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {incident.status !== 'resolved' && incident.status !== 'archived' && (
        <div className="flex gap-3 mt-2 flex-wrap">
          {canResolveIncident(role) && (
            <Button onClick={handleResolve} size="sm">
              <CheckCircle className="w-4 h-4 mr-1.5" />
              {t('resolve')}
            </Button>
          )}
          {canArchiveIncident(role) && (
            <Button variant="outline" size="sm" onClick={handleArchive}>
              <Archive className="w-4 h-4 mr-1.5" />
              {t('archive')}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
