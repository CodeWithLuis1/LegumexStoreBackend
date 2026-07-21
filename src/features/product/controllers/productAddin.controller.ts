import { Request, Response, NextFunction } from "express"
import { productAddinService } from "../services/productAddin.service"

async function index(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const productAddins = await productAddinService.listProductAddins()
        res.json({ data: productAddins })
    } catch (error) {
        next(error)
    }
}

async function show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const productAddinId = Number(req.params.id)
        const productAddin = await productAddinService.getProductAddinById(productAddinId)
        res.json({ data: productAddin })
    } catch (error) {
        next(error)
    }
}

async function store(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const productAddin = await productAddinService.createProductAddin(req.body)
        res.status(201).json({
            message: req.t("success.created", { resource: req.t("resources.ProductAddin") }),
            data: productAddin
        })
    } catch (error) {
        next(error)
    }
}

async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const productAddinId = Number(req.params.id)
        const productAddin = await productAddinService.updateProductAddin(productAddinId, req.body)
        res.json({
            message: req.t("success.updated", { resource: req.t("resources.ProductAddin") }),
            data: productAddin
        })
    } catch (error) {
        next(error)
    }
}

async function destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const productAddinId = Number(req.params.id)
        await productAddinService.deleteProductAddin(productAddinId)
        res.json({ message: req.t("success.deleted", { resource: req.t("resources.ProductAddin") }) })
    } catch (error) {
        next(error)
    }
}

export const productAddinController = {
    index,
    show,
    store,
    update,
    destroy,
}
