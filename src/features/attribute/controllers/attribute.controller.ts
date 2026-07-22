import { Request, Response, NextFunction } from "express"
import { attributeService } from "../services/attributes.service"

async function index(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const attributes = await attributeService.listAttributes()
        res.json({ data: attributes })
    } catch (error) {
        next(error)
    }
}

async function show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const attributeId = Number(req.params.id)
        const attribute = await attributeService.getAttributeById(attributeId)
        res.json({ data: attribute })
    } catch (error) {
        next(error)
    }
}

async function store(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const attribute = await attributeService.createAttribute(req.body)
        res.status(201).json({
            // req.t = i18next translation function, see src/config/i18n.ts
            message: req.t("success.created", { resource: req.t("resources.Attribute") }),
            data: attribute
        })
    } catch (error) {
        next(error)
    }
}

async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const attributeId = Number(req.params.id)
        const attribute = await attributeService.updateAttribute(attributeId, req.body)
        res.json({
            message: req.t("success.updated", { resource: req.t("resources.Attribute") }),
            data: attribute
        })
    } catch (error) {
        next(error)
    }
}

async function destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const attributeId = Number(req.params.id)
        await attributeService.deleteAttribute(attributeId)
        res.json({ message: req.t("success.deleted", { resource: req.t("resources.Attribute") }) })
    } catch (error) {
        next(error)
    }
}

export const attributeController = {
    index,
    show,
    store,
    update,
    destroy,
}
