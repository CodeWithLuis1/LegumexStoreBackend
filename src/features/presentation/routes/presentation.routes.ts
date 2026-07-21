import { Router } from "express"
import { presentationController } from "../controllers/presentation.controller"
import { validate } from "../../../shared/middlewares/validate"
import { createPresentationSchema, updatePresentationSchema, presentationIdParamSchema } from "../schemas/presentation.schema"

const presentationRouter = Router()

presentationRouter.get("/", presentationController.index)
presentationRouter.get("/:id", validate(presentationIdParamSchema, "params"), presentationController.show)
presentationRouter.post("/", validate(createPresentationSchema), presentationController.store)
presentationRouter.put("/:id", validate(presentationIdParamSchema, "params"), validate(updatePresentationSchema), presentationController.update)
presentationRouter.delete("/:id", validate(presentationIdParamSchema, "params"), presentationController.destroy)

export default presentationRouter
