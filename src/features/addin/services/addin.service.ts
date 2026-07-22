import {CreateAddinInput, UpdateAddinInput} from "../schemas/addin.schema"
import {NotFoundError} from "../../../shared/errors/AppError"
import Addin from "../models/Addin.model"

async function listAddins(): Promise<Addin[]> {
    return Addin.findAll({where: { isActive: true }, order: [["displayName", "ASC"]]})
}

async function getAddinById(id: number): Promise<Addin> {
    const addin = await Addin.findOne({ where: { id, isActive: true } })
    if (!addin) throw new NotFoundError("Addin", id)
    return addin
}

async function createAddin(input: CreateAddinInput): Promise<Addin> {
    return Addin.create(input)
}

async function updateAddin(id:number,input: UpdateAddinInput): Promise<Addin> {
    const addin = await getAddinById(id)
    return addin.update(input)  
}

async function deleteAddin(id:number): Promise<void> {
    const addin = await getAddinById(id)
    await addin.update({isActive: false})
}

export const addinService = {
    listAddins,
    getAddinById,
    createAddin,
    updateAddin,
    deleteAddin
}