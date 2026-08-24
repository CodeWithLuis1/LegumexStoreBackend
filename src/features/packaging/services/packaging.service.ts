import { Op, WhereOptions } from "sequelize"
import Packaging from "../models/Packaging.model"
import { NotFoundError } from "../../../shared/errors/AppError"
import { CreatePackagingInput, UpdatePackagingInput } from "../schemas/packaging.schema"
import { paginate, PaginatedResult, PaginationParams } from "../../../shared/utils/pagination.util"

async function listPackagings(pagination?: PaginationParams, search?: string): Promise<PaginatedResult<Packaging>> {
    const where: WhereOptions = { isActive: true, ...(search ? { displayName: { [Op.iLike]: `%${search}%` } } : {}) }
    return paginate(Packaging, { where, order: [["displayName", "DESC"]] }, pagination)
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
