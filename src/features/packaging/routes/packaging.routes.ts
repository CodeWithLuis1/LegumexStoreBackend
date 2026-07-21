import { Router } from "express"
import { packagingController } from "../controllers/packaging.controller"
import { validate } from "../../../shared/middlewares/validate"
import { createPackagingSchema, updatePackagingSchema, packagingIdParamSchema } from "../schemas/packaging.schema"

const packagingRouter = Router()

packagingRouter.get("/", packagingController.index)
packagingRouter.get("/:id", validate(packagingIdParamSchema, "params"), packagingController.show)
packagingRouter.post("/", validate(createPackagingSchema), packagingController.store)
packagingRouter.put("/:id", validate(packagingIdParamSchema, "params"), validate(updatePackagingSchema), packagingController.update)
packagingRouter.delete("/:id", validate(packagingIdParamSchema, "params"), packagingController.destroy)

export default packagingRouter
