import Category from "../models/Category.model"
import { NotFoundError } from "../../../shared/errors/AppError"
import { CreateCategoryInput, UpdateCategoryInput } from "../schemas/category.schema"
import { generateUniqueSlug } from "../../../shared/utils/slug.util"

async function listCategories(): Promise<Category[]> {
    return Category.findAll({ where: { isActive: true }, order: [["displayName", "ASC"]] })
}

async function getCategoryById(id: number): Promise<Category> {
    const category = await Category.findOne({ where: { id, isActive: true } })
    if (!category) throw new NotFoundError("Category", id)
    return category
}

async function createCategory(input: CreateCategoryInput): Promise<Category> {
    const urlSlug = await generateUniqueSlug(input.displayName, async (candidate) => {
        const existing = await Category.findOne({ where: { urlSlug: candidate } })
        return !!existing
    })
    return Category.create({ ...input, urlSlug })
}

async function updateCategory(id: number, input: UpdateCategoryInput): Promise<Category> {
    const category = await getCategoryById(id)
    return category.update(input)
}

async function deleteCategory(id: number): Promise<void> {
    const category = await getCategoryById(id)
    await category.update({ isActive: false })
}

export const categoryService = {
    listCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
}
