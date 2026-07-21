import { Router } from "express"
import { addinController } from "../controllers/addin.controller"
import { validate } from "../../../shared/middlewares/validate"
import { createAddinSchema, updateAddinSchema, addinIdParamSchema } from "../schemas/addin.schema"

const addinRouter = Router()

addinRouter.get("/", addinController.index)
addinRouter.get("/:id", validate(addinIdParamSchema, "params"), addinController.show)
addinRouter.post("/", validate(createAddinSchema), addinController.store)
addinRouter.put("/:id", validate(addinIdParamSchema, "params"), validate(updateAddinSchema), addinController.update)
addinRouter.delete("/:id", validate(addinIdParamSchema, "params"), addinController.destroy)

export default addinRouter
