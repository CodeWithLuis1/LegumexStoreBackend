import z from "zod"

const productIngredientShape = {
    productId: z.number().int().positive(),
    ingredientId: z.number().int().positive(),
    quantityValue: z.number().optional(),
    quantityUnitId: z.number().int().positive().optional(),
    // Solo tienen sentido cuando el producto padre es customizable (ver Product.isCustomizable):
    // acotan el % que el cliente puede elegir de este ingrediente en el mix de la cotización.
    minPercentage: z.number().min(0).max(100).optional(),
    maxPercentage: z.number().min(0).max(100).optional(),
    displayOrder: z.number().int().optional(),
}

const refineMinMax = (data: { minPercentage?: number; maxPercentage?: number }) =>
    data.minPercentage === undefined || data.maxPercentage === undefined || data.minPercentage <= data.maxPercentage

export const createProductIngredientSchema = z.object(productIngredientShape).refine(refineMinMax, {
    message: "minPercentage debe ser menor o igual a maxPercentage",
    path: ["minPercentage"],
})

export const productIngredientIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/),
})

export const updateProductIngredientSchema = z.object(productIngredientShape).partial().refine(refineMinMax, {
    message: "minPercentage debe ser menor o igual a maxPercentage",
    path: ["minPercentage"],
})

export type CreateProductIngredientInput = z.infer<typeof createProductIngredientSchema>
export type UpdateProductIngredientInput = z.infer<typeof updateProductIngredientSchema>
