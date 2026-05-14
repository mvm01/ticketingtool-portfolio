import { z } from 'zod'

export const incidentSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(1000).optional(),
  category: z.enum([
    'equipment',
    'safety',
    'hygiene',
    'service',
    'supply',
    'facility',
    'other',
  ]),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  photoUrl: z.string().url().optional().or(z.literal('')),
})

export const updateIncidentSchema = incidentSchema.partial().extend({
  status: z.enum(['open', 'in_progress', 'resolved', 'archived']).optional(),
  assignedTo: z.string().uuid().optional().nullable(),
})

export type IncidentInput = z.infer<typeof incidentSchema>
export type UpdateIncidentInput = z.infer<typeof updateIncidentSchema>
