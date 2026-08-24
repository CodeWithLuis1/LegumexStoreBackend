import { Request, Response, NextFunction } from "express"
import { AppError } from "../../../shared/errors/AppError"
import { quoteService } from "../services/quote.service"
import { resolveContentLanguage } from "../../../shared/utils/translation.util"

// Único endpoint de cálculo del lado cliente: calcula y persiste en el mismo paso (ver
// quoteService.saveQuote). El cliente ya no ve sus cotizaciones guardadas -- solo el admin,
// vía quoteController.indexAll / GET /admin/quotes.
//
// El idioma sale de req.language (Accept-Language, ya lo manda customerApi en cada request --
// ver i18nextMiddleware en src/server.ts) y decide en qué idioma quedan congelados los
// displayName de producto/ingrediente dentro de esta cotización, para siempre (mismo criterio
// que ya se usa para congelar costos: una cotización guardada no cambia después).
async function save(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!req.customer) throw new AppError(401, "errors.unauthenticated")
        const quote = await quoteService.saveQuote(req.customer.id, req.body, resolveContentLanguage(req.language))
        res.status(201).json({
            message: req.t("success.created", { resource: req.t("resources.Quote") }),
            data: quote
        })
    } catch (error) {
        next(error)
    }
}

async function products(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const data = await quoteService.listQuotableProducts(resolveContentLanguage(req.language))
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
    products,
    destinations,
    save,
    indexAll,
}
