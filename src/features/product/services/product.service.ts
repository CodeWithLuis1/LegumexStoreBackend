import Product from "../models/Product.model"
import { NotFoundError } from "../../../shared/errors/AppError"
import { CreateProductInput, UpdateProductInput } from "../schemas/product.schema"
import { generateUniqueSlug } from "../../../shared/utils/slug.util"

async function findActiveProduct(id: number): Promise<Product> {
    const product = await Product.findOne({ where: { id, isActive: true } })
    if (!product) throw new NotFoundError("Product", id)
    return product
}

async function listProducts(): Promise<Product[]> {
    return Product.findAll({ where: { isActive: true }, order: [["displayName", "ASC"]] })
}

async function getProductById(id: number): Promise<Product> {
    return findActiveProduct(id)
}

async function createProduct(input: CreateProductInput): Promise<Product> {
    const urlSlug = await generateUniqueSlug(input.displayName, async (candidate) => {
        const existing = await Product.findOne({ where: { urlSlug: candidate } })
        return !!existing
    })
    return Product.create({ ...input, urlSlug })
}

async function updateProduct(id: number, input: UpdateProductInput): Promise<Product> {
    const product = await findActiveProduct(id)
    return product.update(input)
}

async function deleteProduct(id: number): Promise<void> {
    const product = await findActiveProduct(id)
    await product.update({ isActive: false })
}

export const productService = {
    listProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}
