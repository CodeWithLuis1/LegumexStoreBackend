import { z } from "zod"
import { paginationQuerySchema } from "../../../shared/schemas/pagination.schema"

// Ver el mismo campo en product.schema.ts: no es una columna, es la entrada cruda para
// category.service.ts (base64 = subir/reemplazar, null = quitar, undefined = no tocar).
const imageInputSchema = z.string()

// Traducción a inglés -- opcional. El español sigue viviendo en displayName/fullDescription de
// arriba (ver shared/utils/translation.util.ts), este bloque solo alimenta CategoryTranslation.
// displayName ausente/vacío = category.service.ts no crea ni toca la fila de traducción.
const categoryTranslationInputSchema = z.object({
    displayName: z.string().trim().min(1).max(80).optional(),
    fullDescription: z.string().trim().nullable().optional(),
})

export const createCategorySchema = z.object({
    displayName: z.string().trim().min(1).max(80),
    fullDescription: z.string().trim().optional(),
    image: imageInputSchema,
    translations: z.object({ en: categoryTranslationInputSchema.optional() }).optional(),
})

export const updateCategorySchema = createCategorySchema.partial()

export const categoryIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/),
})

// GET "/" -- page/limit son opt-in (ver pagination.schema.ts). "search" filtra por displayName.
export const categoryQuerySchema = paginationQuerySchema.extend({
    search: z.string().trim().optional(),
})

// Body de PATCH /:id/status -- ver el mismo campo en product.schema.ts.
export const updateCategoryStatusSchema = z.object({
    isActive: z.boolean(),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
export type CategoryTranslationInput = z.infer<typeof categoryTranslationInputSchema>
export type CategoryQuery = z.infer<typeof categoryQuerySchema>
