import z from "zod";

export const  createRoleSchema = z.object({
    name : z.string().trim(),

})

export const roleIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/),
})

export const updateRoleSchema = createRoleSchema.partial()

export type CreateRoleInput = z.infer<typeof createRoleSchema>
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>