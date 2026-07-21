import { Router } from "express"
import { subCategoryController } from "../controllers/subCategory.controller"
import { validate } from "../../../shared/middlewares/validate"
import { createSubCategorySchema, updateSubCategorySchema, subCategoryIdParamSchema } from "../schemas/subCategory.schema"

const subCategoryRouter = Router()

subCategoryRouter.get("/", subCategoryController.index)
subCategoryRouter.get("/:id", validate(subCategoryIdParamSchema, "params"), subCategoryController.show)
subCategoryRouter.post("/", validate(createSubCategorySchema), subCategoryController.store)
subCategoryRouter.put("/:id", validate(subCategoryIdParamSchema, "params"), validate(updateSubCategorySchema), subCategoryController.update)
subCategoryRouter.delete("/:id", validate(subCategoryIdParamSchema, "params"), subCategoryController.destroy)

export default subCategoryRouter
