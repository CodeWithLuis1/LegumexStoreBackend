import { Router } from "express"
import { quoteController } from "../controllers/quote.controller"
import { validate } from "../../../shared/middlewares/validate"
import { authenticateCustomer } from "../../../shared/middlewares/authenticateCustomer"
import { calculateQuoteSchema } from "../schemas/quote.schema"

const quoteRouter = Router()

quoteRouter.use(authenticateCustomer)

quoteRouter.get("/products", quoteController.products)
quoteRouter.get("/destinations", quoteController.destinations)
quoteRouter.get("/mine", quoteController.mine)
quoteRouter.post("/preview", validate(calculateQuoteSchema), quoteController.preview)
quoteRouter.post("/", validate(calculateQuoteSchema), quoteController.save)

export default quoteRouter
