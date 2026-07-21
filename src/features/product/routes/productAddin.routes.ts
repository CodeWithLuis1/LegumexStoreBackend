import { Router } from "express"
import { productAddinController } from "../controllers/productAddin.controller"
import { validate } from "../../../shared/middlewares/validate"
import { createProductAddinSchema, updateProductAddinSchema, productAddinIdParamSchema } from "../schemas/productAddin.schema"

const productAddinRouter = Router()

productAddinRouter.get("/", productAddinController.index)
productAddinRouter.get("/:id", validate(productAddinIdParamSchema, "params"), productAddinController.show)
productAddinRouter.post("/", validate(createProductAddinSchema), productAddinController.store)
productAddinRouter.put("/:id", validate(productAddinIdParamSchema, "params"), validate(updateProductAddinSchema), productAddinController.update)
productAddinRouter.delete("/:id", validate(productAddinIdParamSchema, "params"), productAddinController.destroy)

export default productAddinRouter
