import { Router } from "express"
import { productTypeController } from "../controllers/ProductType.controller"
import { validate } from "../../../shared/middlewares/validate"
import { createProductTypeSchema, updateProductTypeSchema, productTypeIdParamSchema } from "../schemas/productType.schema"

const productTypeRouter = Router()

productTypeRouter.get("/", productTypeController.index)
productTypeRouter.get("/:id", validate(productTypeIdParamSchema, "params"), productTypeController.show)
productTypeRouter.post("/", validate(createProductTypeSchema), productTypeController.store)
productTypeRouter.put("/:id", validate(productTypeIdParamSchema, "params"), validate(updateProductTypeSchema), productTypeController.update)
productTypeRouter.delete("/:id", validate(productTypeIdParamSchema, "params"), productTypeController.destroy)

export default productTypeRouter
