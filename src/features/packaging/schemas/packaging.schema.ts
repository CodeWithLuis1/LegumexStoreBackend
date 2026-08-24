import z from "zod"
import { paginationQuerySchema } from "../../../shared/schemas/pagination.schema"

const packagingRoleEnum = z.enum(["unit", "pallet"])

export const createPackagingSchema = z.object({
    displayName: z.string().trim().min(1).max(80),
    // Requerido: sin packagingRole el material queda invisible tanto para el selector de
    // empaque unitario ("unit") como para el de materiales de palet ("pallet") -- una fila
    // "huérfana" que nadie puede seleccionar a propósito.
    packagingRole: packagingRoleEnum,
    packagingMaterial: z.string().trim().max(80).optional(),
    // Requerido: unitCost alimenta directo el costo de empaque unitario y de paletización en
    // el cotizador. Si falta, esa línea de costo queda en 0 sin ningún aviso.
    unitCost: z.number().nonnegative(),
})

export const packagingIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/),
})

// .partial() salvo packagingRole/unitCost -- ver comentario arriba de por qué no pueden
// quedar vacíos ni siquiera al editar un registro existente.
export const updatePackagingSchema = createPackagingSchema.partial().extend({
    packagingRole: createPackagingSchema.shape.packagingRole,
    unitCost: createPackagingSchema.shape.unitCost,
})

export const packagingQuerySchema = paginationQuerySchema.extend({
    search: z.string().trim().optional(),
})

export type CreatePackagingInput = z.infer<typeof createPackagingSchema>
export type UpdatePackagingInput = z.infer<typeof updatePackagingSchema>
export type PackagingQuery = z.infer<typeof packagingQuerySchema>
