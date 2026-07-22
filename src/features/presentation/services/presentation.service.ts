import Presentation from "../models/Presentation.model"
import { NotFoundError } from "../../../shared/errors/AppError"
import { CreatePresentationInput, UpdatePresentationInput } from "../schemas/presentation.schema"

async function listPresentations(): Promise<Presentation[]> {
    return Presentation.findAll({ where: { isActive: true }, order: [["displayLabel", "ASC"]] })
}

async function getPresentationById(id: number): Promise<Presentation> {
    const presentation = await Presentation.findOne({ where: { id, isActive: true } })
    if (!presentation) throw new NotFoundError("Presentation", id)
    return presentation
}

async function createPresentation(input: CreatePresentationInput): Promise<Presentation> {
    return Presentation.create(input)
}

async function updatePresentation(id: number, input: UpdatePresentationInput): Promise<Presentation> {
    const presentation = await getPresentationById(id)
    return presentation.update(input)
}

async function deletePresentation(id: number): Promise<void> {
    const presentation = await getPresentationById(id)
    await presentation.update({ isActive: false })
}

export const presentationService = {
    listPresentations,
    getPresentationById,
    createPresentation,
    updatePresentation,
    deletePresentation,
}
