export type Role = 'owner' | 'admin' | 'member'

export type IncidentStatus = 'open' | 'in_progress' | 'resolved' | 'archived'

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical'

export type IncidentCategory =
  | 'equipment'
  | 'safety'
  | 'hygiene'
  | 'service'
  | 'supply'
  | 'facility'
  | 'other'

export type SecurityEventSeverity = 'low' | 'medium' | 'high' | 'critical'

export interface Profile {
  id: string
  email: string
  fullName: string | null
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface Organization {
  id: string
  name: string
  slug: string
  createdAt: string
  updatedAt: string
}

export interface Membership {
  id: string
  userId: string
  orgId: string
  role: Role
  createdAt: string
}

export interface Incident {
  id: string
  orgId: string
  reporterId: string
  assignedTo: string | null
  title: string
  description: string | null
  category: IncidentCategory
  severity: IncidentSeverity
  status: IncidentStatus
  photoUrl: string | null
  createdAt: string
  updatedAt: string
  resolvedAt: string | null
  archivedAt: string | null
  reporter?: Profile
  assignee?: Profile
}

export interface SecurityEvent {
  id: string
  userId: string | null
  orgId: string | null
  eventType: string
  ipAddress: string | null
  userAgent: string | null
  metadata: Record<string, unknown>
  severity: SecurityEventSeverity
  createdAt: string
}

export interface AuthUser {
  id: string
  email: string
  profile: Profile | null
  membership: Membership | null
  organization: Organization | null
}
