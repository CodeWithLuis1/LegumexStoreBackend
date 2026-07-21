import z from "zod"

export const createProductVariantSchema = z.object({
    productId: z.number().int().positive(),
    presentationId: z.number().int().positive().optional(),
    packagingId: z.number().int().positive().optional(),
    skuCode: z.string().trim().max(60).optional(),
    unitPrice: z.number().optional(),
    unitCost: z.number().optional(),
    isPriceManual: z.boolean().optional(),
    minimumOrderQuantity: z.number().int().optional(),
})

export const productVariantIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/),
})

export const updateProductVariantSchema = createProductVariantSchema.partial()

export type CreateProductVariantInput = z.infer<typeof createProductVariantSchema>
export type UpdateProductVariantInput = z.infer<typeof updateProductVariantSchema>
