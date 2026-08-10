import Destination from "../models/Destination.model"
import { NotFoundError } from "../../../shared/errors/AppError"
import { CreateDestinationInput, UpdateDestinationInput } from "../schemas/destination.schema"

async function listDestinations(): Promise<Destination[]> {
    return Destination.findAll({ where: { isActive: true }, order: [["displayName", "DESC"]] })
}

async function getDestinationById(id: number): Promise<Destination> {
    const destination = await Destination.findOne({ where: { id, isActive: true } })
    if (!destination) throw new NotFoundError("Destination", id)
    return destination
}

async function createDestination(input: CreateDestinationInput): Promise<Destination> {
    return Destination.create(input)
}

async function updateDestination(id: number, input: UpdateDestinationInput): Promise<Destination> {
    const destination = await getDestinationById(id)
    return destination.update(input)
}

async function deleteDestination(id: number): Promise<void> {
    const destination = await getDestinationById(id)
    await destination.update({ isActive: false })
}

export const destinationService = {
    listDestinations,
    getDestinationById,
    createDestination,
    updateDestination,
    deleteDestination,
}
