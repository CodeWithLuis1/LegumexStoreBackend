import z from "zod"

export const createAttributeSchema = z.object({
    attributeName: z.string().trim().min(1).max(80),
    dataType: z.enum(["string", "number", "boolean", "date"]),
    unitLabel: z.string().trim().max(20).optional()
})

export const attributeIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/),
})

export const updateAttributeSchema = createAttributeSchema.partial()

export type CreateAttributeInput = z.infer<typeof createAttributeSchema>
export type UpdateAttributeInput = z.infer<typeof updateAttributeSchema>