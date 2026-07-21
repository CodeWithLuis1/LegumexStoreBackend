import Category from "../models/Category.model"
import { NotFoundError } from "../../../shared/errors/AppError"
import { CreateCategoryInput, UpdateCategoryInput } from "../schemas/category.schema"

async function listCategories(): Promise<Category[]> {
    return Category.findAll({ order: [["displayOrder", "ASC"]] })
}

async function getCategoryById(id: number): Promise<Category> {
    const category = await Category.findByPk(id)
    if (!category) throw new NotFoundError("Category", id)
    return category
}

async function createCategory(input: CreateCategoryInput): Promise<Category> {
    return Category.create(input)
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
