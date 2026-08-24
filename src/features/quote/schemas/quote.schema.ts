import z from "zod"

// Solo se usa cuando el producto de la variante elegida es customizable (Product.isCustomizable):
// el cliente arma la receta a mano y debe sumar 100% (con tolerancia de redondeo, ver quoteService).
const ingredientMixLineSchema = z.object({
    ingredientId: z.number().int().positive(),
    // Tope a 2 decimales -- misma precisión que ProductIngredient.minPercentage/maxPercentage
    // (DECIMAL(5,2), ver el modelo) y que el paso del input del front (step="0.1"). Evita que
    // entren porcentajes con precisión falsa (ej. 33.333333333333336, típico de dividir 100/3
    // en JS) al motor de costeo.
    percentage: z.number().min(0).max(100).multipleOf(0.01),
})

export const calculateQuoteSchema = z.object({
    productVariantId: z.number().int().positive(),
    destinationId: z.number().int().positive(),
    requestedPallets: z.number().int().min(1),
    ingredientMix: z.array(ingredientMixLineSchema).optional(),
})

export type IngredientMixLineInput = z.infer<typeof ingredientMixLineSchema>
export type CalculateQuoteInput = z.infer<typeof calculateQuoteSchema>
