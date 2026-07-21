import { Router } from "express"
import { productAttributeController } from "../controllers/productAttribute.controller"
import { validate } from "../../../shared/middlewares/validate"
import { createProductAttributeSchema, updateProductAttributeSchema, productAttributeIdParamSchema } from "../schemas/productAttribute.schema"

const productAttributeRouter = Router()

productAttributeRouter.get("/", productAttributeController.index)
productAttributeRouter.get("/:id", validate(productAttributeIdParamSchema, "params"), productAttributeController.show)
productAttributeRouter.post("/", validate(createProductAttributeSchema), productAttributeController.store)
productAttributeRouter.put("/:id", validate(productAttributeIdParamSchema, "params"), validate(updateProductAttributeSchema), productAttributeController.update)
productAttributeRouter.delete("/:id", validate(productAttributeIdParamSchema, "params"), productAttributeController.destroy)

export default productAttributeRouter
