import z from "zod"
import { paginationQuerySchema } from "../../../shared/schemas/pagination.schema"

export const createPresentationSchema = z.object({
    displayLabel: z.string().trim().min(1).max(40),
    // Requerido: es el peso físico real de la presentación y alimenta directo el cálculo de %
    // en productos personalizables (netWeightGrams -> gramos por ingrediente). Una presentación
    // sin peso es indistinguible de una con peso 0 al cotizar, y el error solo aparece después,
    // al armar una variante/producto que la use -- mejor exigirlo desde el catálogo.
    netWeightGrams: z.number().positive(),
    categoryId: z.number().int().positive().optional(),
})

export const presentationIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/),
})

// .partial() salvo netWeightGrams -- no puede quedar vacío ni siquiera al editar una
// presentación existente (ver comentario arriba).
export const updatePresentationSchema = createPresentationSchema.partial().extend({
    netWeightGrams: createPresentationSchema.shape.netWeightGrams,
})

export const presentationQuerySchema = paginationQuerySchema.extend({
    search: z.string().trim().optional(),
})

export type CreatePresentationInput = z.infer<typeof createPresentationSchema>
export type UpdatePresentationInput = z.infer<typeof updatePresentationSchema>
export type PresentationQuery = z.infer<typeof presentationQuerySchema>
