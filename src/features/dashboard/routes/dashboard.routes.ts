import { Router } from "express"
import { dashboardController } from "../controllers/dashboard.controller"
import { validate } from "../../../shared/middlewares/validate"
import { authenticate } from "../../../shared/middlewares/authenticate"
import { authorize } from "../../../shared/middlewares/authorize"
import { dashboardSummaryQuerySchema } from "../schemas/dashboard.schema"

// Solo lectura, staff (JWT tipo "staff"): igual que adminQuoteRouter, no hay create/edit/delete
// para este recurso -- el dashboard solo agrega datos que ya existen en otras tablas.
const dashboardRouter = Router()

dashboardRouter.use(authenticate)

dashboardRouter.get("/summary", authorize("dashboard:view"), validate(dashboardSummaryQuerySchema, "query"), dashboardController.summary)

export default dashboardRouter
