import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { IncidentSeverity, IncidentStatus } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

export function getSeverityColor(severity: IncidentSeverity): string {
  const map: Record<IncidentSeverity, string> = {
    low: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    medium: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    high: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    critical: 'text-red-400 bg-red-400/10 border-red-400/20',
  }
  return map[severity]
}

export function getStatusColor(status: IncidentStatus): string {
  const map: Record<IncidentStatus, string> = {
    open: 'text-red-400 bg-red-400/10 border-red-400/20',
    in_progress: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    resolved: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    archived: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
  }
  return map[status]
}

export function getInitials(name: string | null): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
