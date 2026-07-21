import { Request, Response, NextFunction } from "express"
import { productAttributeService } from "../services/productAttribute.service"

async function index(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const productAttributes = await productAttributeService.listProductAttributes()
        res.json({ data: productAttributes })
    } catch (error) {
        next(error)
    }
}

async function show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const productAttributeId = Number(req.params.id)
        const productAttribute = await productAttributeService.getProductAttributeById(productAttributeId)
        res.json({ data: productAttribute })
    } catch (error) {
        next(error)
    }
}

async function store(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const productAttribute = await productAttributeService.createProductAttribute(req.body)
        res.status(201).json({
            message: req.t("success.created", { resource: req.t("resources.ProductAttribute") }),
            data: productAttribute
        })
    } catch (error) {
        next(error)
    }
}

async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const productAttributeId = Number(req.params.id)
        const productAttribute = await productAttributeService.updateProductAttribute(productAttributeId, req.body)
        res.json({
            message: req.t("success.updated", { resource: req.t("resources.ProductAttribute") }),
            data: productAttribute
        })
    } catch (error) {
        next(error)
    }
}

async function destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const productAttributeId = Number(req.params.id)
        await productAttributeService.deleteProductAttribute(productAttributeId)
        res.json({ message: req.t("success.deleted", { resource: req.t("resources.ProductAttribute") }) })
    } catch (error) {
        next(error)
    }
}

export const productAttributeController = {
    index,
    show,
    store,
    update,
    destroy,
}
