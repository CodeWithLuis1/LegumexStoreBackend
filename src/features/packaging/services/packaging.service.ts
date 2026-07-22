import Packaging from "../models/Packaging.model"
import { NotFoundError } from "../../../shared/errors/AppError"
import { CreatePackagingInput, UpdatePackagingInput } from "../schemas/packaging.schema"

async function listPackagings(): Promise<Packaging[]> {
    return Packaging.findAll({ where: { isActive: true }, order: [["displayName", "ASC"]] })
}

async function getPackagingById(id: number): Promise<Packaging> {
    const packaging = await Packaging.findOne({ where: { id, isActive: true } })
    if (!packaging) throw new NotFoundError("Packaging", id)
    return packaging
}

async function createPackaging(input: CreatePackagingInput): Promise<Packaging> {
    return Packaging.create(input)
}

async function updatePackaging(id: number, input: UpdatePackagingInput): Promise<Packaging> {
    const packaging = await getPackagingById(id)
    return packaging.update(input)
}

async function deletePackaging(id: number): Promise<void> {
    const packaging = await getPackagingById(id)
    await packaging.update({ isActive: false })
}

export const packagingService = {
    listPackagings,
    getPackagingById,
    createPackaging,
    updatePackaging,
    deletePackaging,
}
