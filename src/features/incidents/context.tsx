'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Incident, IncidentStatus } from '@/types'
import type { IncidentInput, UpdateIncidentInput } from '@/lib/validations/incident'
import { mockIncidents, mockProfile } from '@/lib/mock/data'

interface IncidentsContextValue {
  incidents: Incident[]
  createIncident: (data: IncidentInput, orgId: string, reporterId: string) => Promise<Incident>
  updateIncident: (id: string, data: UpdateIncidentInput) => Promise<void>
  setStatus: (id: string, status: IncidentStatus) => Promise<void>
}

const IncidentsContext = createContext<IncidentsContextValue | null>(null)

export function IncidentsProvider({ children }: { children: ReactNode }) {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents)

  async function createIncident(
    data: IncidentInput,
    orgId: string,
    reporterId: string,
  ): Promise<Incident> {
    await new Promise((r) => setTimeout(r, 600))
    const incident: Incident = {
      id: `inc-${Date.now()}`,
      orgId,
      reporterId,
      assignedTo: null,
      title: data.title,
      description: data.description ?? null,
      category: data.category,
      severity: data.severity,
      status: 'open',
      photoUrl: data.photoUrl || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      resolvedAt: null,
      archivedAt: null,
      reporter: mockProfile,
    }
    setIncidents((prev) => [incident, ...prev])
    return incident
  }

  async function updateIncident(id: string, data: UpdateIncidentInput): Promise<void> {
    await new Promise((r) => setTimeout(r, 500))
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === id ? { ...inc, ...data, updatedAt: new Date().toISOString() } : inc,
      ),
    )
  }

  async function setStatus(id: string, status: IncidentStatus): Promise<void> {
    await new Promise((r) => setTimeout(r, 400))
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id !== id) return inc
        return {
          ...inc,
          status,
          updatedAt: new Date().toISOString(),
          resolvedAt: status === 'resolved' ? new Date().toISOString() : inc.resolvedAt,
          archivedAt: status === 'archived' ? new Date().toISOString() : inc.archivedAt,
        }
      }),
    )
  }

  return (
    <IncidentsContext.Provider value={{ incidents, createIncident, updateIncident, setStatus }}>
      {children}
    </IncidentsContext.Provider>
  )
}

export function useIncidents(): IncidentsContextValue {
  const ctx = useContext(IncidentsContext)
  if (!ctx) throw new Error('useIncidents must be used inside IncidentsProvider')
  return ctx
}
