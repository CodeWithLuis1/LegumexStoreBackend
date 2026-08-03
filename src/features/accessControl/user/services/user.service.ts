import bcrypt from "bcryptjs"
import { CreateUserInput, UpdateUserInput } from "../schemas/user.schema";
import User from "../models/user.model"
import { NotFoundError } from "../../../../shared/errors/AppError";

const PASSWORD_SALT_ROUNDS = 10

async function listUsers(): Promise<User[]> {
    return User.findAll({
        where: { isActive: true },
        attributes: { exclude: ["password"] },
        order: [["name", "DESC"]]
    })
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

export const userService = {
    listUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}
