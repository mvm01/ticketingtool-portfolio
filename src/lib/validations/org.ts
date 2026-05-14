import { z } from 'zod'

export const createOrgSchema = z.object({
  name: z.string().min(2).max(100),
})

export type CreateOrgInput = z.infer<typeof createOrgSchema>
