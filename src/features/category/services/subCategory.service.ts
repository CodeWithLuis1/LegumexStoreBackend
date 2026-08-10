import SubCategory from "../models/SubCategory.model"
import { NotFoundError } from "../../../shared/errors/AppError"
import { CreateSubCategoryInput, UpdateSubCategoryInput } from "../schemas/subCategory.schema"
import { generateUniqueSlug } from "../../../shared/utils/slug.util"

async function listSubCategories(): Promise<SubCategory[]> {
    return SubCategory.findAll({ where: { isActive: true }, order: [["displayName", "ASC"]] })
}

async function getSubCategoryById(id: number): Promise<SubCategory> {
    const subCategory = await SubCategory.findOne({ where: { id, isActive: true } })
    if (!subCategory) throw new NotFoundError("SubCategory", id)
    return subCategory
}

async function createSubCategory(input: CreateSubCategoryInput): Promise<SubCategory> {
    // Unico por categoryId (no global): el mismo slug puede repetirse en categorias distintas.
    const urlSlug = await generateUniqueSlug(input.displayName, async (candidate) => {
        const existing = await SubCategory.findOne({
            where: { categoryId: input.categoryId, urlSlug: candidate },
        })
        return !!existing
    })
    return SubCategory.create({ ...input, urlSlug })
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
