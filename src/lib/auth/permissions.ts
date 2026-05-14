import type { Role, Incident } from '@/types'

export function canEditIncident(role: Role, userId: string, incident: Incident): boolean {
  if (role === 'owner' || role === 'admin') return true
  return incident.reporterId === userId
}

export function canResolveIncident(role: Role): boolean {
  return role === 'owner' || role === 'admin'
}

export function canManageTeam(role: Role): boolean {
  return role === 'owner' || role === 'admin'
}

export function canDeleteIncident(role: Role): boolean {
  return role === 'owner'
}

export function canArchiveIncident(role: Role): boolean {
  return role === 'owner' || role === 'admin'
}
