import bcrypt from "bcryptjs"
import { Op, WhereOptions } from "sequelize"
import { CreateUserInput, UpdateUserInput } from "../schemas/user.schema";
import User from "../models/user.model"
import { NotFoundError } from "../../../../shared/errors/AppError";
import { paginate, PaginatedResult, PaginationParams } from "../../../../shared/utils/pagination.util";

const PASSWORD_SALT_ROUNDS = 10

// Devuelve activos e inactivos -- es la lista que consume el admin (UserTable), que necesita ver
// los usuarios desactivados para poder reactivarlos (ver mismo patrón en category.service.ts /
// product.service.ts::listCategories/listProducts).
async function listUsers(pagination?: PaginationParams, search?: string): Promise<PaginatedResult<User>> {
    const where: WhereOptions = search
        ? { [Op.or]: [{ name: { [Op.iLike]: `%${search}%` } }, { username: { [Op.iLike]: `%${search}%` } }] }
        : {}
    return paginate(
        User,
        { where, order: [["isActive", "DESC"], ["name", "DESC"]], attributes: { exclude: ["password"] } },
        pagination
    )
}

async function getUserById(id: number): Promise<User> {
    const user = await User.findOne({
        where: { id, isActive: true },
        attributes: { exclude: ["password"] }
    })
    if (!user) throw new NotFoundError("User", id)
    return user
}

async function createUser(input: CreateUserInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(input.password, PASSWORD_SALT_ROUNDS)
    const user = await User.create({ ...input, password: hashedPassword })
    return getUserById(user.id)
}

async function updateUser(id: number, input: UpdateUserInput): Promise<User> {
    const user = await getUserById(id)
    const data = { ...input }
    if (data.password) {
        data.password = await bcrypt.hash(data.password, PASSWORD_SALT_ROUNDS)
    }
    await user.update(data)
    return getUserById(id)
}

async function deleteUser(id: number): Promise<void> {
    const user = await getUserById(id)
    await user.update({ isActive: false })
}

// Ver el mismo patrón en category.service.ts::setCategoryStatus / product.service.ts::setProductStatus
// -- busca sin filtrar por isActive para poder tanto desactivar como reactivar (getUserById no
// sirve acá porque filtra isActive:true, y dejaría inalcanzable a un usuario ya desactivado).
async function setUserStatus(id: number, isActive: boolean): Promise<User> {
    const user = await User.findOne({ where: { id }, attributes: { exclude: ["password"] } })
    if (!user) throw new NotFoundError("User", id)
    await user.update({ isActive })
    return user
}

export const userService = {
    listUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    setUserStatus,
}
