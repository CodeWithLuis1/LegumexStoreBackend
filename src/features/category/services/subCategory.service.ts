import SubCategory from "../models/SubCategory.model"
import { NotFoundError } from "../../../shared/errors/AppError"
import { CreateSubCategoryInput, UpdateSubCategoryInput } from "../schemas/subCategory.schema"

async function listSubCategories(): Promise<SubCategory[]> {
    return SubCategory.findAll({ order: [["displayOrder", "ASC"]] })
}

async function getSubCategoryById(id: number): Promise<SubCategory> {
    const subCategory = await SubCategory.findByPk(id)
    if (!subCategory) throw new NotFoundError("SubCategory", id)
    return subCategory
}

async function createSubCategory(input: CreateSubCategoryInput): Promise<SubCategory> {
    return SubCategory.create(input)
}

async function updateSubCategory(id: number, input: UpdateSubCategoryInput): Promise<SubCategory> {
    const subCategory = await getSubCategoryById(id)
    return subCategory.update(input)
}

async function deleteSubCategory(id: number): Promise<void> {
    const subCategory = await getSubCategoryById(id)
    await subCategory.update({ isActive: false })
}

export const subCategoryService = {
    listSubCategories,
    getSubCategoryById,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
}
