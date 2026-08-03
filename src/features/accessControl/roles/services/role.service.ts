import {CreateRoleInput,UpdateRoleInput} from "../schemas/role.schema"
import { NotFoundError } from "../../../../shared/errors/AppError"
import Role from "../models/role.model"

async function listRoles(): Promise<Role[]> {
    return Role.findAll({where: { isActive: true }, order: [["name", "DESC"]]})
}

async function getRoleById(id:number): Promise<Role> {
    const role = await Role.findOne({where: {id,isActive:true}})
    if(!role) throw new NotFoundError("Role",id)
        return role
}
async function createRole(input:CreateRoleInput): Promise<Role> {
    return Role.create(input)
}
async function updateRole(id: number, input:UpdateRoleInput): Promise<Role> {
    const role = await getRoleById(id)
    return role.update(input)
}

async function deleteRole(id: number): Promise<void> {
    const  role = await getRoleById(id)
    await role.update({isActive:false})
}

export const  roleService = {
    listRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
}