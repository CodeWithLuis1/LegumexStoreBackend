import { Request, Response, NextFunction } from "express"
import { customerService } from "../services/customer.service"

async function index(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const customers = await customerService.listCustomers()
        res.json({ data: customers })
    } catch (error) {
        next(error)
    }
}

async function show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const customerId = Number(req.params.id)
        const customer = await customerService.getCustomerById(customerId)
        res.json({ data: customer })
    } catch (error) {
        next(error)
    }
}

async function store(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const customer = await customerService.createCustomer(req.body)
        res.status(201).json({
            message: req.t("success.created", { resource: req.t("resources.Customer") }),
            data: customer
        })
    } catch (error) {
        next(error)
    }
}

async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const customerId = Number(req.params.id)
        const customer = await customerService.updateCustomer(customerId, req.body)
        res.json({
            message: req.t("success.updated", { resource: req.t("resources.Customer") }),
            data: customer
        })
    } catch (error) {
        next(error)
    }
}

async function destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const customerId = Number(req.params.id)
        await customerService.deleteCustomer(customerId)
        res.json({ message: req.t("success.deleted", { resource: req.t("resources.Customer") }) })
    } catch (error) {
        next(error)
    }
}

export const customerController = {
    index,
    show,
    store,
    update,
    destroy
}
