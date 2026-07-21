import z from "zod"

export const createPackagingSchema = z.object({
    displayName: z.string().trim().min(1).max(80),
    packagingMaterial: z.string().trim().max(80).optional(),
    capacityValue: z.number().optional(),
    capacityUnitId: z.number().int().positive().optional(),
    unitCost: z.number().optional(),
})

export const packagingIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/),
})

export const updatePackagingSchema = createPackagingSchema.partial()

export type CreatePackagingInput = z.infer<typeof createPackagingSchema>
export type UpdatePackagingInput = z.infer<typeof updatePackagingSchema>
