import Ingredient from "../models/Ingredient.model"
import { NotFoundError } from "../../../shared/errors/AppError"
import { CreateIngredientInput, UpdateIngredientInput } from "../schemas/ingredient.schema"

async function listIngredients(): Promise<Ingredient[]> {
    return Ingredient.findAll({ where: { isActive: true }, order: [["displayName", "ASC"]] })
}

async function getIngredientById(id: number): Promise<Ingredient> {
    const ingredient = await Ingredient.findOne({ where: { id, isActive: true } })
    if (!ingredient) throw new NotFoundError("Ingredient", id)
    return ingredient
}

async function createIngredient(input: CreateIngredientInput): Promise<Ingredient> {
    return Ingredient.create(input)
}

async function updateIngredient(id: number, input: UpdateIngredientInput): Promise<Ingredient> {
    const ingredient = await getIngredientById(id)
    return ingredient.update(input)
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
