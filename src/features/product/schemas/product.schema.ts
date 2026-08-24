import {z} from "zod"
import { paginationQuerySchema } from "../../../shared/schemas/pagination.schema"

// "image" no es una columna real -- es la entrada cruda para product.service.ts:
// string base64 (data:image/...) = subir/reemplazar en S3, null = quitar la foto actual,
// undefined (campo ausente) = no tocar la imagen existente. El campo persistido es
// Product.imageUrl (ver responseProductSchema en el frontend), nunca se recibe del cliente.
const imageInputSchema = z.string().nullable().optional()

// Traducción a inglés -- opcional. Product no tiene descripción larga (solo displayName), así
// que este bloque es más chico que el de category.schema.ts. Ver shared/utils/translation.util.ts.
const productTranslationInputSchema = z.object({
    displayName: z.string().trim().min(1).max(120).optional(),
})

export const createProductSchema = z.object({
    subCategoryId: z.number().int().positive(),
    productTypeId: z.number().int().positive(),
    displayName: z.string().trim().min(1).max(120),
    isOrganic: z.boolean().optional(),
    isCustomizable: z.boolean().optional(),
    image: imageInputSchema,
    translations: z.object({ en: productTranslationInputSchema.optional() }).optional(),
})


export const updateProductSchema = createProductSchema.partial()

export const productIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/),
})

// Body de PATCH /:id/status -- activar/desactivar el producto (ver Product.isActive en
// BaseCatalogModel). No reutiliza updateProductSchema a propósito: este endpoint solo puede
// tocar isActive, nada más.
export const updateProductStatusSchema = z.object({
    isActive: z.boolean(),
})

export const productQuerySchema = paginationQuerySchema.extend({
    search: z.string().trim().optional(),
})

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type ProductTranslationInput = z.infer<typeof productTranslationInputSchema>
export type ProductQuery = z.infer<typeof productQuerySchema>
