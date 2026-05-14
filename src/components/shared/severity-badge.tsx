import { useTranslations } from 'next-intl'
import { cn, getSeverityColor } from '@/lib/utils'
import type { IncidentSeverity } from '@/types'

interface SeverityBadgeProps {
  severity: IncidentSeverity
  className?: string
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const t = useTranslations('incidents.severity')

  return (
    <span
      className={cn(
        'severity-badge',
        getSeverityColor(severity),
        className,
      )}
    >
      {t(severity)}
    </span>
  )
}
