import { z } from "zod"

export const createCategorySchema = z.object({
    displayName: z.string().trim().min(1).max(80),
    urlSlug: z.string().trim().min(1).max(80),
    fullDescription: z.string().trim().optional(),
    displayOrder: z.number().int().optional(),
    defaultMargin: z.number().min(0).max(999.99).optional(),
})

export const updateCategorySchema = createCategorySchema.partial()

export const categoryIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
