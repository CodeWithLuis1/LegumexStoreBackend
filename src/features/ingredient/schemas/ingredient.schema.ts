import z from "zod"

export const createIngredientSchema = z.object({
    displayName: z.string().trim().min(1).max(120),
    urlSlug: z.string().trim().min(1).max(120),
    ingredientType: z.enum(["fruit", "vegetable", "pulp", "other"]),
    isOrganicAvailable: z.boolean().optional(),
    isMixable: z.boolean().optional(),
    costPerUnit: z.number().optional(),
    costUnitId: z.number().int().positive().optional(),
})

export const ingredientIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/),
})

export const updateIngredientSchema = createIngredientSchema.partial()

export type CreateIngredientInput = z.infer<typeof createIngredientSchema>
export type UpdateIngredientInput = z.infer<typeof updateIngredientSchema>
