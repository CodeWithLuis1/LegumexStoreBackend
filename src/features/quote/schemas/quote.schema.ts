import z from "zod"

// Solo se usa cuando el producto de la variante elegida es customizable (Product.isCustomizable):
// el cliente arma la receta a mano y debe sumar 100% (con tolerancia de redondeo, ver quoteService).
const ingredientMixLineSchema = z.object({
    ingredientId: z.number().int().positive(),
    percentage: z.number().min(0).max(100),
})

export const calculateQuoteSchema = z.object({
    productVariantId: z.number().int().positive(),
    destinationId: z.number().int().positive(),
    requestedPallets: z.number().int().min(1),
    ingredientMix: z.array(ingredientMixLineSchema).optional(),
})

export type IngredientMixLineInput = z.infer<typeof ingredientMixLineSchema>
export type CalculateQuoteInput = z.infer<typeof calculateQuoteSchema>
