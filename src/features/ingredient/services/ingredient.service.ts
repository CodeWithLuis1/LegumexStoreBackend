import { Op, WhereOptions } from "sequelize"
import Ingredient from "../models/Ingredient.model"
import IngredientTranslation from "../models/IngredientTranslation.model"
import { NotFoundError } from "../../../shared/errors/AppError"
import { CreateIngredientInput, UpdateIngredientInput, IngredientTranslationInput } from "../schemas/ingredient.schema"
import { generateUniqueSlug } from "../../../shared/utils/slug.util"
import { paginate, PaginatedResult, PaginationParams } from "../../../shared/utils/pagination.util"

async function listIngredients(pagination?: PaginationParams, search?: string): Promise<PaginatedResult<Ingredient>> {
    const where: WhereOptions = { isActive: true, ...(search ? { displayName: { [Op.iLike]: `%${search}%` } } : {}) }
    return paginate(
        Ingredient,
        { where, order: [["displayName", "DESC"]], include: [{ model: IngredientTranslation, as: "translations" }] },
        pagination
    )
}

async function getIngredientById(id: number): Promise<Ingredient> {
    const ingredient = await Ingredient.findOne({
        where: { id, isActive: true },
        include: [{ model: IngredientTranslation, as: "translations" }]
    })
    if (!ingredient) throw new NotFoundError("Ingredient", id)
    return ingredient
}

// Mismo patrón que category.service.ts::syncEnglishTranslation -- ver ese comentario. Ingredient
// solo tiene displayName (no descripción), así que este helper es más chico.
async function syncEnglishTranslation(ingredientId: number, en: IngredientTranslationInput | undefined): Promise<void> {
    if (!en?.displayName) return
    const [translation] = await IngredientTranslation.findOrCreate({
        where: { ingredientId, language: "en" },
        defaults: { ingredientId, language: "en", displayName: en.displayName }
    })
    await translation.update({ displayName: en.displayName })
}

async function createIngredient(input: CreateIngredientInput): Promise<Ingredient> {
    const { translations, ...rest } = input
    const urlSlug = await generateUniqueSlug(rest.displayName, async (candidate) => {
        const existing = await Ingredient.findOne({ where: { urlSlug: candidate } })
        return !!existing
    })
    const ingredient = await Ingredient.create({ ...rest, urlSlug })
    await syncEnglishTranslation(ingredient.id, translations?.en)
    return getIngredientById(ingredient.id)
}

async function updateIngredient(id: number, input: UpdateIngredientInput): Promise<Ingredient> {
    const ingredient = await getIngredientById(id)
    const { translations, ...rest } = input
    await ingredient.update(rest)
    await syncEnglishTranslation(id, translations?.en)
    return getIngredientById(id)
}

async function deleteIngredient(id: number): Promise<void> {
    const ingredient = await getIngredientById(id)
    await ingredient.update({ isActive: false })
}

export const ingredientService = {
    listIngredients,
    getIngredientById,
    createIngredient,
    updateIngredient,
    deleteIngredient,
}
