import z from "zod"

export const createAddinSchema = z.object({
    displayName: z.string().trim().min(1).max(80),
    fullDescription: z.string().trim().optional(),
    costPerServing: z.number().optional()
})

export const addinIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/),
})

export const updateAddinSchema = createAddinSchema.partial()

export type CreateAddinInput = z.infer<typeof createAddinSchema>
export type UpdateAddinInput = z.infer<typeof updateAddinSchema>

