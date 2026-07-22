import ProductAttribute from "../models/ProductAttribute.model"
import { NotFoundError } from "../../../shared/errors/AppError"
import { CreateProductAttributeInput, UpdateProductAttributeInput } from "../schemas/productAttribute.schema"

async function listProductAttributes(): Promise<ProductAttribute[]> {
    return ProductAttribute.findAll({ where: { isActive: true }, order: [["id", "ASC"]] })
}

async function getProductAttributeById(id: number): Promise<ProductAttribute> {
    const productAttribute = await ProductAttribute.findOne({ where: { id, isActive: true } })
    if (!productAttribute) throw new NotFoundError("ProductAttribute", id)
    return productAttribute
}

async function createProductAttribute(input: CreateProductAttributeInput): Promise<ProductAttribute> {
    return ProductAttribute.create(input)
}

async function updateProductAttribute(id: number, input: UpdateProductAttributeInput): Promise<ProductAttribute> {
    const productAttribute = await getProductAttributeById(id)
    return productAttribute.update(input)
}

async function deleteProductAttribute(id: number): Promise<void> {
    const productAttribute = await getProductAttributeById(id)
    await productAttribute.update({ isActive: false })
}

export const productAttributeService = {
    listProductAttributes,
    getProductAttributeById,
    createProductAttribute,
    updateProductAttribute,
    deleteProductAttribute,
}
