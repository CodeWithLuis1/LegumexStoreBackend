import { Router } from "express"
import { productVariantController } from "../controllers/productVariant.controller"
import { validate } from "../../../shared/middlewares/validate"
import { createProductVariantSchema, updateProductVariantSchema, productVariantIdParamSchema } from "../schemas/productVariant.schema"

const productVariantRouter = Router()

productVariantRouter.get("/", productVariantController.index)
productVariantRouter.get("/:id", validate(productVariantIdParamSchema, "params"), productVariantController.show)
productVariantRouter.post("/", validate(createProductVariantSchema), productVariantController.store)
productVariantRouter.put("/:id", validate(productVariantIdParamSchema, "params"), validate(updateProductVariantSchema), productVariantController.update)
productVariantRouter.delete("/:id", validate(productVariantIdParamSchema, "params"), productVariantController.destroy)

export default productVariantRouter
