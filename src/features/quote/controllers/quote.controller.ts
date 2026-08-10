import { Request, Response, NextFunction } from "express"
import { AppError } from "../../../shared/errors/AppError"
import { quoteService } from "../services/quote.service"

async function preview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const calculation = await quoteService.calculateQuote(req.body)
        res.json({ data: calculation })
    } catch (error) {
        next(error)
    }
}

async function save(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!req.customer) throw new AppError(401, "errors.unauthenticated")
        const quote = await quoteService.saveQuote(req.customer.id, req.body)
        res.status(201).json({
            message: req.t("success.created", { resource: req.t("resources.Quote") }),
            data: quote
        })
    } catch (error) {
        next(error)
    }
}

async function mine(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!req.customer) throw new AppError(401, "errors.unauthenticated")
        const data = await quoteService.listCustomerQuotes(req.customer.id)
        res.json({ data })
    } catch (error) {
        next(error)
    }
}

async function products(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const data = await quoteService.listQuotableProducts()
        res.json({ data })
    } catch (error) {
        next(error)
    }
}

async function destinations(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const data = await quoteService.listQuoteDestinations()
        res.json({ data })
    } catch (error) {
        next(error)
    }
}

// Panel admin (staff, protegido con "quotes:view"): todas las cotizaciones, sin importar el cliente.
async function indexAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const data = await quoteService.listAllQuotes()
        res.json({ data })
    } catch (error) {
        next(error)
    }
}

export const quoteController = {
    preview,
    products,
    destinations,
    save,
    mine,
    indexAll,
}
