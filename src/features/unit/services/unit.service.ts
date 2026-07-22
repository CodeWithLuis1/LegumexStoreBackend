import Unit from "../models/Unit.model";
import { NotFoundError } from "../../../shared/errors/AppError";
import { CreateUnitInput, UpdateUnitInput } from "../schemas/unit.schema";

async function listUnits(): Promise<Unit[]> {
    return Unit.findAll({ where: { isActive: true }, order: [["displayName", "ASC"]] });
}

async function getUnitById(id: number): Promise<Unit> {
    const unit = await Unit.findOne({ where: { id, isActive: true } });
    if (!unit) throw new NotFoundError("Unit", id);
    return unit;
}

async function createUnit(input: CreateUnitInput): Promise<Unit> {
    return Unit.create(input);
}

async function updateUnit(id: number, input: UpdateUnitInput): Promise<Unit> {
    const unit = await getUnitById(id);
    return unit.update(input);
}
async function deleteUnit(id: number): Promise<void> {
    const unit = await getUnitById(id);
    await unit.update({ isActive: false });
}

export const unitService = {
    listUnits,
    getUnitById,
    createUnit,
    updateUnit,
    deleteUnit,
}
