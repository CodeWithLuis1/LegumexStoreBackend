import z from "zod"
import { paginationQuerySchema } from "../../../../shared/schemas/pagination.schema"

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

// "search" busca por name o username -- ver user.service.ts::listUsers.
export const userQuerySchema = paginationQuerySchema.extend({
    search: z.string().trim().optional(),
})

// Body de PATCH /:id/status -- activar/desactivar el usuario (ver el mismo campo en
// category.schema.ts/product.schema.ts). Desactivar le corta el acceso sin borrar su cuenta;
// activar se lo devuelve.
export const updateUserStatusSchema = z.object({
    isActive: z.boolean(),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type UserQuery = z.infer<typeof userQuerySchema>
