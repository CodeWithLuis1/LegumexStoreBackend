import Attribute from "../models/Attribute.model"
import { NotFoundError } from "../../../shared/errors/AppError"
import { CreateAttributeInput, UpdateAttributeInput } from "../schemas/attributes.schema"

async function listAttributes(): Promise<Attribute[]> {
    return Attribute.findAll({ order: [["displayName", "ASC"]] })
}

async function getAttributeById(id: number): Promise<Attribute> {
    const attribute = await Attribute.findByPk(id)
    if (!attribute) throw new NotFoundError("Attribute", id)
    return attribute
}

async function createAttribute(input: CreateAttributeInput): Promise<Attribute> {
    return Attribute.create(input)
}

async function updateAttribute(id: number, input: UpdateAttributeInput): Promise<Attribute> {
    const attribute = await getAttributeById(id)
    return attribute.update(input)
}

async function deleteAttribute(id: number): Promise<void> {
    const attribute = await getAttributeById(id)
    await attribute.update({ isActive: false })
}

export const attributeService = {
    listAttributes,
    getAttributeById,
    createAttribute,
    updateAttribute,
    deleteAttribute,
}
