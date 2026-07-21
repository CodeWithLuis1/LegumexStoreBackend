import {Router} from "express"
import {productController} from "../controllers/Product.controller"
import {validate} from "../../../shared/middlewares/validate"
import {createProductSchema, updateProductSchema, productIdParamSchema} from "../schemas/product.schema"

const productRouter = Router()

productRouter.get("/", productController.index);
productRouter.get("/:id", validate(productIdParamSchema, "params"), productController.show);
productRouter.post("/", validate(createProductSchema), productController.store);
productRouter.put("/:id", validate(productIdParamSchema, "params"), validate(updateProductSchema), productController.update);
productRouter.delete("/:id", validate(productIdParamSchema, "params"), productController.destroy);

export default productRouter