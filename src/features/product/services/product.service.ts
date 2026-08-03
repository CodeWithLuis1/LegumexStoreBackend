import Product from "../models/Product.model"
import { NotFoundError } from "../../../shared/errors/AppError"
import { CreateProductInput, UpdateProductInput } from "../schemas/product.schema"
import * as s3Service from "../../../shared/services/s3.service"

const IMAGE_FOLDER = "products"

async function resolveImageKey(imageUrl: string | undefined): Promise<string | undefined> {
    if (!imageUrl) return imageUrl
    if (s3Service.isBase64Image(imageUrl)) return s3Service.uploadImage(imageUrl, IMAGE_FOLDER)
    return s3Service.getKeyFromUrl(imageUrl)
}

function withImageUrl(product: Product) {
    const plain = product.toJSON()
    if (plain.imageUrl) {
        plain.imageUrl = s3Service.getS3Url(plain.imageUrl)
    }
    return plain
}

async function findActiveProduct(id: number): Promise<Product> {
    const product = await Product.findOne({ where: { id, isActive: true } })
    if (!product) throw new NotFoundError("Product", id)
    return product
}

async function listProducts() {
    const products = await Product.findAll({ where: { isActive: true }, order: [["displayName", "DESC"]] })
    return products.map(withImageUrl)
}

async function getProductById(id: number) {
    const product = await findActiveProduct(id)
    return withImageUrl(product)
}

async function createProduct(input: CreateProductInput) {
    const imageUrl = await resolveImageKey(input.imageUrl)
    const product = await Product.create({ ...input, imageUrl })
    return withImageUrl(product)
}

async function updateProduct(id: number, input: UpdateProductInput) {
    const product = await findActiveProduct(id)

    if (!Object.prototype.hasOwnProperty.call(input, "imageUrl")) {
        await product.update(input)
        return withImageUrl(product)
    }

    const previousImageKey = product.imageUrl
    const imageUrl = (await resolveImageKey(input.imageUrl)) || null

    await product.update({ ...input, imageUrl })

    if (previousImageKey && previousImageKey !== imageUrl) {
        await s3Service.deleteImage(previousImageKey)
    }

    return withImageUrl(product)
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
