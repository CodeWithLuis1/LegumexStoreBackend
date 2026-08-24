import { Request, Response, NextFunction } from "express"
import { packagingService } from "../services/packaging.service"
import { PackagingQuery } from "../schemas/packaging.schema"

async function index(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { page, limit, search } = req.query as unknown as PackagingQuery
        const result = await packagingService.listPackagings({ page, limit }, search)
        res.json(result)
    } catch (error) {
        next(error)
    }
}

async function show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const packagingId = Number(req.params.id)
        const packaging = await packagingService.getPackagingById(packagingId)
        res.json({ data: packaging })
    } catch (error) {
        next(error)
    }
}

async function store(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const packaging = await packagingService.createPackaging(req.body)
        res.status(201).json({
            message: req.t("success.created", { resource: req.t("resources.Packaging") }),
            data: packaging
        })
    } catch (error) {
        next(error)
    }
}

async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const packagingId = Number(req.params.id)
        const packaging = await packagingService.updatePackaging(packagingId, req.body)
        res.json({
            message: req.t("success.updated", { resource: req.t("resources.Packaging") }),
            data: packaging
        })
    } catch (error) {
        next(error)
    }
}

async function destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const packagingId = Number(req.params.id)
        await packagingService.deletePackaging(packagingId)
        res.json({ message: req.t("success.deleted", { resource: req.t("resources.Packaging") }) })
    } catch (error) {
        next(error)
    }
}

export const packagingController = {
    index,
    show,
    store,
    update,
    destroy,
}
