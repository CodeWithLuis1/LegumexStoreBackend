import { Request, Response, NextFunction } from "express";
import {productTypeService} from "../services/productType.service";

async function index(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
        const productTypes = await productTypeService.listProductTypes()
        res.json({data: productTypes})
    }catch(error){
        next(error)
    }
}

async function show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
        const productTypeId = Number(req.params.id)
        const productType = await productTypeService.getProductTypeById(productTypeId)
        res.json({data: productType})
    }catch(error){
        next(error)
    }
}

async function store(req: Request, res:Response, next: NextFunction): Promise<void> {
    try{
        const productType = await productTypeService.createProductType(req.body)
        res.status(201).json({
            // req.t = i18next translation function, see src/config/i18n.ts
            message: req.t("success.created", {resource: req.t("resources.ProductType")}),
            data: productType
        })

    }catch(error){
        next(error)
    }
}

async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
        const productTypeId = Number(req.params.id)
        const productType = await productTypeService.updateProductType(productTypeId, req.body)
        res.json({
            message: req.t("success.updated", {resource: req.t("resources.ProductType")}),
            data: productType
        })
    }catch(error){
        next(error)
    }
}

async function destroy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
        const productTypeId = Number(req.params.id)
        await productTypeService.deleteProductType(productTypeId)
        res.json({message: req.t("success.deleted", {resource: req.t("resources.ProductType")})})
    }catch(error){
        next(error)
    }
}

export const productTypeController = {
    index,
    show,
    store,
    update,
    destroy
}