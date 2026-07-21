import {z} from "zod"
export const createProductSchema = z.object({
    subCategoryId: z.number().int().positive(),
    productTypeId: z.number().int().positive(),
    displayName: z.string().trim().min(1).max(120),
    urlSlug: z.string().trim().min(1).max(120),
    fullDescription: z.string().trim().optional(),
    isOrganic: z.boolean().optional(),
    isCustomizable: z.boolean().optional(),
    imageUrl: z.string().trim().optional(),
    displayOrder: z.number().int().optional()
})


export const updateProductSchema = createProductSchema.partial()

export const productIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/),
})

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
