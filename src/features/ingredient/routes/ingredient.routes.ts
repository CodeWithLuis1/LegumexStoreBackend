import { Router } from "express"
import { ingredientController } from "../controllers/ingredient.controller"
import { validate } from "../../../shared/middlewares/validate"
import { createIngredientSchema, updateIngredientSchema, ingredientIdParamSchema } from "../schemas/ingredient.schema"

const ingredientRouter = Router()

ingredientRouter.get("/", ingredientController.index)
ingredientRouter.get("/:id", validate(ingredientIdParamSchema, "params"), ingredientController.show)
ingredientRouter.post("/", validate(createIngredientSchema), ingredientController.store)
ingredientRouter.put("/:id", validate(ingredientIdParamSchema, "params"), validate(updateIngredientSchema), ingredientController.update)
ingredientRouter.delete("/:id", validate(ingredientIdParamSchema, "params"), ingredientController.destroy)

export default ingredientRouter
