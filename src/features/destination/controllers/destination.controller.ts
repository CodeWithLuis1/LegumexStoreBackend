import { Request, Response, NextFunction } from "express"
import { destinationService } from "../services/destination.service"

async function index(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const destinations = await destinationService.listDestinations()
        res.json({ data: destinations })
    } catch (error) {
        next(error)
    }
}

async function show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const destinationId = Number(req.params.id)
        const destination = await destinationService.getDestinationById(destinationId)
        res.json({ data: destination })
    } catch (error) {
        next(error)
    }
}

async function store(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const destination = await destinationService.createDestination(req.body)
        res.status(201).json({
            message: req.t("success.created", { resource: req.t("resources.Destination") }),
            data: destination
        })
    } catch (error) {
        next(error)
    }
}

async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const destinationId = Number(req.params.id)
        const destination = await destinationService.updateDestination(destinationId, req.body)
        res.json({
            message: req.t("success.updated", { resource: req.t("resources.Destination") }),
            data: destination
        })
    } catch (error) {
        next(error)
    }
}

async function destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const destinationId = Number(req.params.id)
        await destinationService.deleteDestination(destinationId)
        res.json({ message: req.t("success.deleted", { resource: req.t("resources.Destination") }) })
    } catch (error) {
        next(error)
    }
}

export const destinationController = {
    index,
    show,
    store,
    update,
    destroy,
}
