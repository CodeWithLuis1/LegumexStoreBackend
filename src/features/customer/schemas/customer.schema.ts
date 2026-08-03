import z from "zod"

export const createCustomerSchema = z.object({
    name: z.string().trim().min(1).max(100),
    companyName: z.string().trim().max(100).optional(),
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(8),
})

export const customerIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/),
})

export const updateCustomerSchema = createCustomerSchema.partial()

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>
