import { Router } from "express"
import { quoteController } from "../controllers/quote.controller"
import { authenticate } from "../../../shared/middlewares/authenticate"
import { authorize } from "../../../shared/middlewares/authorize"

// Router separado del quoteRouter (cliente): quoteRouter usa authenticateCustomer para TODAS
// sus rutas (JWT tipo "customer"), y este router es para staff (JWT tipo "staff"). Mezclar los
// dos tipos de auth en un solo router.use() no es posible -- se sigue el mismo patrón que el
// resto del repo (un router = un tipo de autenticación), mismo motivo por el que roleRouter y
// rolePermissionRouter son dos routers separados montados bajo el mismo prefijo en routes/index.ts.
const adminQuoteRouter = Router()

adminQuoteRouter.use(authenticate)

adminQuoteRouter.get("/", authorize("quotes:view"), quoteController.indexAll)

export default adminQuoteRouter
