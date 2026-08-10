import z from "zod"

export const createDestinationSchema = z.object({
    displayName: z.string().trim().min(1).max(120),
    baseCost: z.number().nonnegative(),
})

export const destinationIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/),
})

export const updateDestinationSchema = createDestinationSchema.partial()

export type CreateDestinationInput = z.infer<typeof createDestinationSchema>
export type UpdateDestinationInput = z.infer<typeof updateDestinationSchema>
