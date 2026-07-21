import {Router} from 'express'
import {unitController} from '../controllers/unit.controller'
import {validate} from '../../../shared/middlewares/validate'
import {createUnitSchema, updateUnitSchema, unitIdParamSchema} from '../schemas/unit.schema'

const unitRouter = Router()

unitRouter.get("/", unitController.index);
unitRouter.get("/:id", validate(unitIdParamSchema, "params"), unitController.show);
unitRouter.post("/", validate(createUnitSchema), unitController.store);
unitRouter.put("/:id", validate(unitIdParamSchema, "params"), validate(updateUnitSchema), unitController.update);
unitRouter.delete("/:id", validate(unitIdParamSchema, "params"), unitController.destroy);

export default unitRouter