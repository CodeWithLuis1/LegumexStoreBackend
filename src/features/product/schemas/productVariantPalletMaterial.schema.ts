import z from "zod"

export const createProductVariantPalletMaterialSchema = z.object({
    productVariantId: z.number().int().positive(),
    packagingId: z.number().int().positive(),
    // Requerido: quantityPerPallet * requestedPallets es la fórmula directa del costo de esta
    // línea de paletización (quote.service.ts). Si queda vacío, el material "cuesta" $0 en
    // cada cotización sin ningún aviso -- justo el tipo de vacío que infla o desinfla el total
    // por palet sin que nadie lo note.
    quantityValue: z.number().positive(),
})

export const productVariantPalletMaterialIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/),
})

// .partial() salvo quantityValue -- no puede quedar vacío ni siquiera al editar una fila
// existente (ver comentario arriba).
export const updateProductVariantPalletMaterialSchema = createProductVariantPalletMaterialSchema.partial().extend({
    quantityValue: createProductVariantPalletMaterialSchema.shape.quantityValue,
})

export type CreateProductVariantPalletMaterialInput = z.infer<typeof createProductVariantPalletMaterialSchema>
export type UpdateProductVariantPalletMaterialInput = z.infer<typeof updateProductVariantPalletMaterialSchema>
