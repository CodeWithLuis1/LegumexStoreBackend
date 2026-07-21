import ProductType from "../models/ProductType.model";
import {NotFoundError} from "../../../shared/errors/AppError";
import {CreateProductTypeInput, UpdateProductTypeInput} from "../schemas/productType.schema";


export async function listProductTypes(): Promise<ProductType[]> {
    return ProductType.findAll({order: [["displayName", "DESC"]]})
}

export async function getProductTypeById(id: number): Promise<ProductType> {
    const productType = await ProductType.findByPk(id)
    if (!productType) throw new NotFoundError("ProductType", id)
    return productType
}

export async function createProductType(input:CreateProductTypeInput): Promise<ProductType> {
    return ProductType.create(input)
}

export async function updateProductType(id:number,input: UpdateProductTypeInput): Promise<ProductType> {
    const productType = await getProductTypeById(id)
    return productType.update(input)
}

export async function deleteProductType(id:number): Promise<void> {
    const productType = await getProductTypeById(id)
    await productType.update({isActive: false})
}

export const productTypeService = {
    listProductTypes,
    getProductTypeById,
    createProductType,
    updateProductType,
    deleteProductType
}