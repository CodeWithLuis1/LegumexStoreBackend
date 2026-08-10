import { z } from "zod"

export const createCategorySchema = z.object({
    displayName: z.string().trim().min(1).max(80),
    fullDescription: z.string().trim().optional(),
})

export const updateCategorySchema = createCategorySchema.partial()

export const categoryIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
