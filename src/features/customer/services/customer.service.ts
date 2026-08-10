import bcrypt from "bcryptjs"
import { CreateCustomerInput, UpdateCustomerInput } from "../schemas/customer.schema"
import Customer from "../models/Customer.model"
import { NotFoundError } from "../../../shared/errors/AppError"

const PASSWORD_SALT_ROUNDS = 10

async function listCustomers(): Promise<Customer[]> {
    return Customer.findAll({
        where: { isActive: true },
        attributes: { exclude: ["password"] },
        order: [["name", "DESC"]]
    })
}

async function getCustomerById(id: number): Promise<Customer> {
    const customer = await Customer.findOne({
        where: { id, isActive: true },
        attributes: { exclude: ["password"] }
    })
    if (!customer) throw new NotFoundError("Customer", id)
    return customer
}

async function createCustomer(input: CreateCustomerInput): Promise<Customer> {
    const hashedPassword = await bcrypt.hash(input.password, PASSWORD_SALT_ROUNDS)
    const customer = await Customer.create({ ...input, password: hashedPassword })
    return getCustomerById(customer.id)
}

async function updateCustomer(id: number, input: UpdateCustomerInput): Promise<Customer> {
    const customer = await getCustomerById(id)
    const data = { ...input }
    if (data.password) {
        data.password = await bcrypt.hash(data.password, PASSWORD_SALT_ROUNDS)
    }
    await customer.update(data)
    return getCustomerById(id)
}

async function deleteCustomer(id: number): Promise<void> {
    const customer = await getCustomerById(id)
    await customer.update({ isActive: false })
}

export const customerService = {
    listCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
}
