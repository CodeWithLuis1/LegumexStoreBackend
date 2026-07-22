import Product from "../models/Product.model"
import {NotFoundError} from "../../../shared/errors/AppError"
import {CreateProductInput, UpdateProductInput} from "../schemas/product.schema"

async function listProducts(): Promise<Product[]> {
    return Product.findAll({where: { isActive: true }, order: [["displayName", "DESC"]]})
}

async function getProductById(id: number): Promise<Product> {
    const product = await Product.findOne({ where: { id, isActive: true } })
    if (!product) throw new NotFoundError("Product", id)
    return product
}
async function createProduct(input: CreateProductInput): Promise<Product> {
    return Product.create(input)
}

async function updateProduct(id:number,input: UpdateProductInput): Promise<Product> {
    const product = await getProductById(id)
    return product.update(input)
}

async function deleteProduct(id:number): Promise<void> {
    const product = await getProductById(id)
    await product.update({isActive: false})
}

export const productService = {
    listProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}