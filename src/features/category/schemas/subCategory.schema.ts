import { z } from "zod"

export const createSubCategorySchema = z.object({
    categoryId: z.number().int().positive(),
    displayName: z.string().trim().min(1).max(80),
    urlSlug: z.string().trim().min(1).max(80),
    fullDescription: z.string().trim().optional(),
    displayOrder: z.number().int().optional(),
})

export const updateSubCategorySchema = createSubCategorySchema.partial()

export const subCategoryIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/),
})

export type CreateSubCategoryInput = z.infer<typeof createSubCategorySchema>
export type UpdateSubCategoryInput = z.infer<typeof updateSubCategorySchema>
