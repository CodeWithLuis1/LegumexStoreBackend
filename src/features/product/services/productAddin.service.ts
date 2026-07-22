import ProductAddin from "../models/ProductAddin.model"
import { NotFoundError } from "../../../shared/errors/AppError"
import { CreateProductAddinInput, UpdateProductAddinInput } from "../schemas/productAddin.schema"

async function listProductAddins(): Promise<ProductAddin[]> {
    return ProductAddin.findAll({ where: { isActive: true }, order: [["id", "ASC"]] })
}

async function getProductAddinById(id: number): Promise<ProductAddin> {
    const productAddin = await ProductAddin.findOne({ where: { id, isActive: true } })
    if (!productAddin) throw new NotFoundError("ProductAddin", id)
    return productAddin
}

async function createProductAddin(input: CreateProductAddinInput): Promise<ProductAddin> {
    return ProductAddin.create(input)
}

async function updateProductAddin(id: number, input: UpdateProductAddinInput): Promise<ProductAddin> {
    const productAddin = await getProductAddinById(id)
    return productAddin.update(input)
}

async function deleteProductAddin(id: number): Promise<void> {
    const productAddin = await getProductAddinById(id)
    await productAddin.update({ isActive: false })
}

export const productAddinService = {
    listProductAddins,
    getProductAddinById,
    createProductAddin,
    updateProductAddin,
    deleteProductAddin,
}
