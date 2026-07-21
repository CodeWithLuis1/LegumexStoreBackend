import ProductIngredient from "../models/ProductIngredient.model"
import { NotFoundError } from "../../../shared/errors/AppError"
import { CreateProductIngredientInput, UpdateProductIngredientInput } from "../schemas/productIngredient.schema"

async function listProductIngredients(): Promise<ProductIngredient[]> {
    return ProductIngredient.findAll({ order: [["displayOrder", "ASC"]] })
}

async function getProductIngredientById(id: number): Promise<ProductIngredient> {
    const productIngredient = await ProductIngredient.findByPk(id)
    if (!productIngredient) throw new NotFoundError("ProductIngredient", id)
    return productIngredient
}

async function createProductIngredient(input: CreateProductIngredientInput): Promise<ProductIngredient> {
    return ProductIngredient.create(input)
}

async function updateProductIngredient(id: number, input: UpdateProductIngredientInput): Promise<ProductIngredient> {
    const productIngredient = await getProductIngredientById(id)
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
