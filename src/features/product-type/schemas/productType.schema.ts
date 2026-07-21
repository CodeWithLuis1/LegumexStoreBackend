import z from 'zod'

export const createProductTypeSchema = z.object({
    typeCode: z.string().trim().min(1).max(40),
    displayName: z.string().trim().min(1).max(80),   
})

export const productTypeIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/),
})

export const updateProductTypeSchema = createProductTypeSchema.partial()


export type CreateProductTypeInput = z.infer<typeof createProductTypeSchema>
export type UpdateProductTypeInput = z.infer<typeof updateProductTypeSchema>
