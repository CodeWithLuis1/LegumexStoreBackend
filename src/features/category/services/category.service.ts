import { Op, WhereOptions } from "sequelize"
import Category from "../models/Category.model"
import CategoryTranslation from "../models/CategoryTranslation.model"
import { NotFoundError } from "../../../shared/errors/AppError"
import { CreateCategoryInput, UpdateCategoryInput, CategoryTranslationInput } from "../schemas/category.schema"
import { generateUniqueSlug } from "../../../shared/utils/slug.util"
import { resolveCatalogImage } from "../../../shared/utils/catalogImage.util"
import { paginate, PaginatedResult, PaginationParams } from "../../../shared/utils/pagination.util"

const IMAGE_FOLDER = "categories"

// Devuelve activas e inactivas -- es la lista que consume el admin (CategoryTable), que necesita
// ver las categorías desactivadas para poder reactivarlas. Paginación opt-in: ver pagination.util.ts
// -- sin "page" se comporta igual que antes (findAll completo), así CategorySelect sigue trayendo
// todas las categorías sin cambios.
async function listCategories(pagination?: PaginationParams, search?: string): Promise<PaginatedResult<Category>> {
    const where: WhereOptions = search ? { displayName: { [Op.iLike]: `%${search}%` } } : {}
    return paginate(
        Category,
        { where, order: [["isActive", "DESC"], ["displayName", "ASC"]], include: [{ model: CategoryTranslation, as: "translations" }] },
        pagination
    )
}

async function getCategoryById(id: number): Promise<Category> {
    const category = await Category.findOne({
        where: { id, isActive: true },
        include: [{ model: CategoryTranslation, as: "translations" }]
    })
    if (!category) throw new NotFoundError("Category", id)
    return category
}

// Crea o actualiza la fila de traducción en inglés según lo que venga en el body. Mismo espíritu
// que el manejo de "image" en este service: bloque "en" ausente o sin displayName = no se toca
// nada (no hay forma de borrar la traducción una vez creada -- no hacía falta, ver memoria del
// proyecto sobre por qué acá se prefiere lo mínimo necesario antes que una feature completa).
async function syncEnglishTranslation(categoryId: number, en: CategoryTranslationInput | undefined): Promise<void> {
    if (!en?.displayName) return
    const [translation] = await CategoryTranslation.findOrCreate({
        where: { categoryId, language: "en" },
        defaults: { categoryId, language: "en", displayName: en.displayName, fullDescription: en.fullDescription ?? null }
    })
    await translation.update({
        displayName: en.displayName,
        ...(en.fullDescription !== undefined ? { fullDescription: en.fullDescription } : {})
    })
}

async function createCategory(input: CreateCategoryInput): Promise<Category> {
    const { image, translations, ...rest } = input
    const urlSlug = await generateUniqueSlug(rest.displayName, async (candidate) => {
        const existing = await Category.findOne({ where: { urlSlug: candidate } })
        return !!existing
    })
    const imageUrl = await resolveCatalogImage(null, image, IMAGE_FOLDER)
    const category = await Category.create({ ...rest, urlSlug, imageUrl: imageUrl ?? null })
    await syncEnglishTranslation(category.id, translations?.en)
    return getCategoryById(category.id)
}

async function updateCategory(id: number, input: UpdateCategoryInput): Promise<Category> {
    const category = await getCategoryById(id)
    const { image, translations, ...rest } = input
    const imageUrl = await resolveCatalogImage(category.imageUrl, image, IMAGE_FOLDER)
    await category.update({ ...rest, ...(imageUrl !== undefined ? { imageUrl } : {}) })
    await syncEnglishTranslation(id, translations?.en)
    return getCategoryById(id)
}

async function deleteCategory(id: number): Promise<void> {
    const category = await getCategoryById(id)
    await category.update({ isActive: false })
}

// Ver el mismo patrón en product.service.ts::setProductStatus -- busca sin filtrar por isActive
// para poder tanto desactivar como reactivar.
async function setCategoryStatus(id: number, isActive: boolean): Promise<Category> {
    const category = await Category.findOne({
        where: { id },
        include: [{ model: CategoryTranslation, as: "translations" }]
    })
    if (!category) throw new NotFoundError("Category", id)
    await category.update({ isActive })
    return category
}

export const categoryService = {
    listCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    setCategoryStatus,
}
