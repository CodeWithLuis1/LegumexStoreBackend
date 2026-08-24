import { Router } from "express"
import { quoteController } from "../controllers/quote.controller"
import { validate } from "../../../shared/middlewares/validate"
import { authenticateCustomer } from "../../../shared/middlewares/authenticateCustomer"
import { calculateQuoteSchema } from "../schemas/quote.schema"

const quoteRouter = Router()

quoteRouter.use(authenticateCustomer)

quoteRouter.get("/products", quoteController.products)
quoteRouter.get("/destinations", quoteController.destinations)
// Único punto de entrada para "calcular": el cliente ya no elige guardar o no -- cada cálculo
// se persiste de una vez (ver quoteService.saveQuote, siempre recalcula desde cero). El listado
// de cotizaciones ahora vive solo del lado admin (adminQuote.routes.ts, GET /admin/quotes).
quoteRouter.post("/", validate(calculateQuoteSchema), quoteController.save)

export default quoteRouter
