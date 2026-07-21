import z from "zod"

export const createProductAddinSchema = z.object({
    productId: z.number().int().positive(),
    addinId: z.number().int().positive(),
    isDefault: z.boolean().optional(),
})

export const productAddinIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/),
})

export const updateProductAddinSchema = createProductAddinSchema.partial()

export type CreateProductAddinInput = z.infer<typeof createProductAddinSchema>
export type UpdateProductAddinInput = z.infer<typeof updateProductAddinSchema>
