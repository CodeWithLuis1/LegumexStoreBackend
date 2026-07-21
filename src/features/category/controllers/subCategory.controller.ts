import { Request, Response, NextFunction } from "express"
import { subCategoryService } from "../services/subCategory.service"

async function index(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const subCategories = await subCategoryService.listSubCategories()
        res.json({ data: subCategories })
    } catch (error) {
        next(error)
    }
}

async function show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = Number(req.params.id)
        const subCategory = await subCategoryService.getSubCategoryById(id)
        res.json({ data: subCategory })
    } catch (error) {
        next(error)
    }
}

async function store(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const subCategory = await subCategoryService.createSubCategory(req.body)
        res.status(201).json({
            message: req.t("success.created", { resource: req.t("resources.SubCategory") }),
            data: subCategory
        })
    } catch (error) {
        next(error)
    }
}

async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = Number(req.params.id)
        const subCategory = await subCategoryService.updateSubCategory(id, req.body)
        res.json({
            message: req.t("success.updated", { resource: req.t("resources.SubCategory") }),
            data: subCategory
        })
    } catch (error) {
        next(error)
    }
}

async function destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = Number(req.params.id)
        await subCategoryService.deleteSubCategory(id)
        res.json({ message: req.t("success.deleted", { resource: req.t("resources.SubCategory") }) })
    } catch (error) {
        next(error)
    }
}

export const subCategoryController = {
    index,
    show,
    store,
    update,
    destroy,
}
