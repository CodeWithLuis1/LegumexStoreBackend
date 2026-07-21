import z from "zod"

export const createProductIngredientSchema = z.object({
    productId: z.number().int().positive(),
    ingredientId: z.number().int().positive(),
    proportionPercent: z.number().min(0).max(999.99).optional(),
    quantityValue: z.number().optional(),
    quantityUnitId: z.number().int().positive().optional(),
    displayOrder: z.number().int().optional(),
})

export const productIngredientIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/),
})

export const updateProductIngredientSchema = createProductIngredientSchema.partial()

export type CreateProductIngredientInput = z.infer<typeof createProductIngredientSchema>
export type UpdateProductIngredientInput = z.infer<typeof updateProductIngredientSchema>
