import { useTranslations } from 'next-intl'
import { cn, getStatusColor } from '@/lib/utils'
import type { IncidentStatus } from '@/types'

interface StatusBadgeProps {
  status: IncidentStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const t = useTranslations('incidents.status')

  return (
    <span
      className={cn(
        'status-badge',
        getStatusColor(status),
        className,
      )}
    >
      {t(status)}
    </span>
  )
}
