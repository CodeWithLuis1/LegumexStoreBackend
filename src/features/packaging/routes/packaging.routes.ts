import { Router } from "express"
import { packagingController } from "../controllers/packaging.controller"
import { validate } from "../../../shared/middlewares/validate"
import { authenticate } from "../../../shared/middlewares/authenticate"
import { authorize } from "../../../shared/middlewares/authorize"
import { createPackagingSchema, updatePackagingSchema, packagingIdParamSchema } from "../schemas/packaging.schema"

const packagingRouter = Router()

packagingRouter.use(authenticate)

packagingRouter.get("/", authorize("packagings:view"), packagingController.index)
packagingRouter.get("/:id", authorize("packagings:view"), validate(packagingIdParamSchema, "params"), packagingController.show)
packagingRouter.post("/", authorize("packagings:create"), validate(createPackagingSchema), packagingController.store)
packagingRouter.put("/:id", authorize("packagings:edit"), validate(packagingIdParamSchema, "params"), validate(updatePackagingSchema), packagingController.update)
packagingRouter.delete("/:id", authorize("packagings:delete"), validate(packagingIdParamSchema, "params"), packagingController.destroy)

export default packagingRouter
