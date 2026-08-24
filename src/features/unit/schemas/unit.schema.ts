import z from "zod"
import { UNIT_CATALOG_KEYS } from "../constants/unitCatalog"
import { paginationQuerySchema } from "../../../shared/schemas/pagination.schema"

// El admin ya no escribe displayName/unitType/baseFactor a mano: elige unitKey del catálogo
// fijo (ver constants/unitCatalog.ts) y el service resuelve los 3 valores desde ahí. Cierra
// el error de un baseFactor mal tipeado que inflaba/desinflaba costos en el cotizador.
export const createUnitSchema = z.object({
    unitKey: z.enum(UNIT_CATALOG_KEYS),
})

export const unitIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/),
})

// No hace falta .partial(): unitKey es el único campo y no puede quedar vacío ni siquiera al
// editar -- una Unidad sin unitKey no tiene displayName/unitType/baseFactor que resolver.
export const updateUnitSchema = createUnitSchema

export const unitQuerySchema = paginationQuerySchema.extend({
    search: z.string().trim().optional(),
})

export type CreateUnitInput = z.infer<typeof createUnitSchema>
export type UpdateUnitInput = z.infer<typeof updateUnitSchema>
export type UnitQuery = z.infer<typeof unitQuerySchema>
