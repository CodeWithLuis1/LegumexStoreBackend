import {attributeController} from '../controllers/attribute.controller'
import {Router} from "express"
import {validate} from "../../../shared/middlewares/validate"
import {createAttributeSchema, updateAttributeSchema, attributeIdParamSchema} from "../schemas/attributes.schema"


const attributeRouter = Router()

attributeRouter.get("/", attributeController.index);
attributeRouter.get("/:id", validate(attributeIdParamSchema, "params"), attributeController.show);
attributeRouter.post("/", validate(createAttributeSchema), attributeController.store);
attributeRouter.put("/:id", validate(attributeIdParamSchema, "params"), validate(updateAttributeSchema), attributeController.update);
attributeRouter.delete("/:id", validate(attributeIdParamSchema, "params"), attributeController.destroy);

export default attributeRouter