import ProductIngredient from "../models/ProductIngredient.model"
import Product from "../models/Product.model"
import Ingredient from "../../ingredient/models/Ingredient.model"
import { AppError, NotFoundError } from "../../../shared/errors/AppError"
import { CreateProductIngredientInput, UpdateProductIngredientInput } from "../schemas/productIngredient.schema"

async function listProductIngredients(): Promise<ProductIngredient[]> {
    return ProductIngredient.findAll({ where: { isActive: true }, order: [["displayOrder", "DESC"]] })
}

async function getProductIngredientById(id: number): Promise<ProductIngredient> {
    const productIngredient = await ProductIngredient.findOne({ where: { id, isActive: true } })
    if (!productIngredient) throw new NotFoundError("ProductIngredient", id)
    return productIngredient
}

// No confiar solo en que el frontend filtró el <select> -- si el producto es customizable,
// el ingrediente elegido debe estar marcado como mezclable (Ingredient.isMixable). Ver
// también el filtro de UI en ingredientSelect.component.tsx (onlyMixable).
async function assertIngredientIsMixableIfNeeded(productId: number, ingredientId: number): Promise<void> {
    const product = await Product.findOne({ where: { id: productId } })
    if (!product?.isCustomizable) return

    const ingredient = await Ingredient.findOne({ where: { id: ingredientId } })
    if (!ingredient?.isMixable) {
        throw new AppError(422, "errors.ingredient_not_mixable", { ingredientId })
    }
}

// quantityValue solo es opcional en el schema porque en productos customizables no se usa
// (se usa minPercentage/maxPercentage en su lugar). Cuando el producto padre NO es
// customizable, esta fila ES la receta fija que quote.service.ts multiplica directo -- si
// queda vacía o en 0, esa materia prima "cuesta" $0 en cada cotización sin ningún aviso.
async function assertQuantityValueIfFixedRecipe(productId: number, quantityValue: number | null | undefined): Promise<void> {
    const product = await Product.findOne({ where: { id: productId } })
    if (product?.isCustomizable) return

    if (quantityValue === null || quantityValue === undefined || quantityValue <= 0) {
        throw new AppError(422, "errors.product_ingredient_quantity_required")
    }
}

async function createProductIngredient(input: CreateProductIngredientInput): Promise<ProductIngredient> {
    await assertIngredientIsMixableIfNeeded(input.productId, input.ingredientId)
    await assertQuantityValueIfFixedRecipe(input.productId, input.quantityValue)
    return ProductIngredient.create(input)
}

async function updateProductIngredient(id: number, input: UpdateProductIngredientInput): Promise<ProductIngredient> {
    const productIngredient = await getProductIngredientById(id)
    const effectiveProductId = input.productId ?? productIngredient.productId
    if (input.ingredientId !== undefined) {
        await assertIngredientIsMixableIfNeeded(effectiveProductId, input.ingredientId)
    }
    const effectiveQuantityValue = input.quantityValue !== undefined ? input.quantityValue : productIngredient.quantityValue
    await assertQuantityValueIfFixedRecipe(effectiveProductId, effectiveQuantityValue)
    return productIngredient.update(input)
}

async function deleteProductIngredient(id: number): Promise<void> {
    const productIngredient = await getProductIngredientById(id)
    await productIngredient.update({ isActive: false })
}

export const productIngredientService = {
    listProductIngredients,
    getProductIngredientById,
    createProductIngredient,
    updateProductIngredient,
    deleteProductIngredient,
}
