import z from "zod"

export const createPresentationSchema = z.object({
    displayLabel: z.string().trim().min(1).max(40),
    netWeightGrams: z.number().optional(),
    displayValue: z.number().optional(),
    displayUnitId: z.number().int().positive().optional(),
    categoryId: z.number().int().positive().optional(),
})

export const presentationIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/),
})

export const updatePresentationSchema = createPresentationSchema.partial()

export type CreatePresentationInput = z.infer<typeof createPresentationSchema>
export type UpdatePresentationInput = z.infer<typeof updatePresentationSchema>
