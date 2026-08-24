import z from "zod"
import { paginationQuerySchema } from "../../../shared/schemas/pagination.schema"

// Países soportados por el cotizador: cada destino pertenece a uno solo, y el cliente filtra
// por país antes de elegir destino (ver quoteCalculatorForm.component.tsx en el front).
export const destinationCountryEnum = z.enum(["GT", "US"])

export const createDestinationSchema = z.object({
    displayName: z.string().trim().min(1).max(120),
    baseCost: z.number().nonnegative(),
    country: destinationCountryEnum,
})

export const destinationIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/),
})

export const updateDestinationSchema = createDestinationSchema.partial()

export const destinationQuerySchema = paginationQuerySchema.extend({
    search: z.string().trim().optional(),
    country: destinationCountryEnum.optional(),
})

export type CreateDestinationInput = z.infer<typeof createDestinationSchema>
export type UpdateDestinationInput = z.infer<typeof updateDestinationSchema>
export type DestinationQuery = z.infer<typeof destinationQuerySchema>
