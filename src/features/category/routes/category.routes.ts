import { Router } from "express"
import { categoryController } from "../controllers/category.controller"
import { validate } from "../../../shared/middlewares/validate"
import { createCategorySchema, updateCategorySchema, categoryIdParamSchema } from "../schemas/category.schema"

const categoryRouter = Router()

categoryRouter.get("/", categoryController.index)
categoryRouter.get("/:id", validate(categoryIdParamSchema, "params"), categoryController.show)
categoryRouter.post("/", validate(createCategorySchema), categoryController.store)
categoryRouter.put("/:id", validate(categoryIdParamSchema, "params"), validate(updateCategorySchema), categoryController.update)
categoryRouter.delete("/:id", validate(categoryIdParamSchema, "params"), categoryController.destroy)

export default categoryRouter
