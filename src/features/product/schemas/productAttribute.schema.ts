import z from "zod"

export const createProductAttributeSchema = z.object({
    productId: z.number().int().positive(),
    attributeId: z.number().int().positive(),
    valueString: z.string().trim().max(255).optional(),
    valueNumber: z.number().optional(),
    valueBoolean: z.boolean().optional(),
})

export const productAttributeIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/),
})

export const updateProductAttributeSchema = createProductAttributeSchema.partial()

export type CreateProductAttributeInput = z.infer<typeof createProductAttributeSchema>
export type UpdateProductAttributeInput = z.infer<typeof updateProductAttributeSchema>
