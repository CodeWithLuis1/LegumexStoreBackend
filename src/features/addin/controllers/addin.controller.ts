import { Request, Response, NextFunction } from "express"
import { addinService } from "../services/addin.service"

async function index(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const addins = await addinService.listAddins()
        res.json({ data: addins })
    } catch (error) {
        next(error)
    }
}

async function show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const addinId = Number(req.params.id)
        const addin = await addinService.getAddinById(addinId)
        res.json({ data: addin })
    } catch (error) {
        next(error)
    }
}

async function store(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const addin = await addinService.createAddin(req.body)
        res.status(201).json({
            message: req.t("success.created", { resource: req.t("resources.Addin") }),
            data: addin
        })
    } catch (error) {
        next(error)
    }
}

async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const addinId = Number(req.params.id)
        const addin = await addinService.updateAddin(addinId, req.body)
        res.json({
            message: req.t("success.updated", { resource: req.t("resources.Addin") }),
            data: addin
        })
    } catch (error) {
        next(error)
    }
}

async function destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const addinId = Number(req.params.id)
        await addinService.deleteAddin(addinId)
        res.json({ message: req.t("success.deleted", { resource: req.t("resources.Addin") }) })
    } catch (error) {
        next(error)
    }
}

export const addinController = {
    index,
    show,
    store,
    update,
    destroy,
}
