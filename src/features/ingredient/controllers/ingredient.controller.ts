import { Request, Response, NextFunction } from "express"
import { ingredientService } from "../services/ingredient.service"

async function index(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const ingredients = await ingredientService.listIngredients()
        res.json({ data: ingredients })
    } catch (error) {
        next(error)
    }
}

async function show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const ingredientId = Number(req.params.id)
        const ingredient = await ingredientService.getIngredientById(ingredientId)
        res.json({ data: ingredient })
    } catch (error) {
        next(error)
    }
}

async function store(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const ingredient = await ingredientService.createIngredient(req.body)
        res.status(201).json({
            message: req.t("success.created", { resource: req.t("resources.Ingredient") }),
            data: ingredient
        })
    } catch (error) {
        next(error)
    }
}

async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const ingredientId = Number(req.params.id)
        const ingredient = await ingredientService.updateIngredient(ingredientId, req.body)
        res.json({
            message: req.t("success.updated", { resource: req.t("resources.Ingredient") }),
            data: ingredient
        })
    } catch (error) {
        next(error)
    }
}

async function destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const ingredientId = Number(req.params.id)
        await ingredientService.deleteIngredient(ingredientId)
        res.json({ message: req.t("success.deleted", { resource: req.t("resources.Ingredient") }) })
    } catch (error) {
        next(error)
    }
}

export const ingredientController = {
    index,
    show,
    store,
    update,
    destroy,
}
