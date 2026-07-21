import z from "zod"

export const createUnitSchema = z.object({
    unitCode: z.string().trim().min(1).max(40),
    displayName: z.string().trim().min(1).max(80),
    unitType: z.enum(["weight", "volume", "count"]),
    baseFactor: z.number().positive()
})

export const unitIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/),
})
export const updateUnitSchema = createUnitSchema.partial()

export type CreateUnitInput = z.infer<typeof createUnitSchema>
export type UpdateUnitInput = z.infer<typeof updateUnitSchema>