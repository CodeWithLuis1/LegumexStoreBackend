import z from "zod"

export const createUserSchema = z.object({
    name: z.string().trim().min(1).max(100),
    username: z.string().trim().min(3).max(100),
    password: z.string().min(8),
    role_id: z.coerce.number().int().positive(),
})

export const userIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/),
})
export const updateUserSchema = createUserSchema.partial()

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
