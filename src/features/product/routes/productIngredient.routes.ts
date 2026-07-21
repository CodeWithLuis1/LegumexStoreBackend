import { Router } from "express"
import { productIngredientController } from "../controllers/productIngredient.controller"
import { validate } from "../../../shared/middlewares/validate"
import { createProductIngredientSchema, updateProductIngredientSchema, productIngredientIdParamSchema } from "../schemas/productIngredient.schema"

const productIngredientRouter = Router()

productIngredientRouter.get("/", productIngredientController.index)
productIngredientRouter.get("/:id", validate(productIngredientIdParamSchema, "params"), productIngredientController.show)
productIngredientRouter.post("/", validate(createProductIngredientSchema), productIngredientController.store)
productIngredientRouter.put("/:id", validate(productIngredientIdParamSchema, "params"), validate(updateProductIngredientSchema), productIngredientController.update)
productIngredientRouter.delete("/:id", validate(productIngredientIdParamSchema, "params"), productIngredientController.destroy)

export default productIngredientRouter
