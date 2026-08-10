import { Op } from "sequelize"
import ProductVariant from "../../product/models/ProductVariant.model"
import Product from "../../product/models/Product.model"
import ProductIngredient from "../../product/models/ProductIngredient.model"
import Ingredient from "../../ingredient/models/Ingredient.model"
import Unit from "../../unit/models/Unit.model"
import Packaging from "../../packaging/models/Packaging.model"
import Presentation from "../../presentation/models/Presentation.model"
import ProductVariantPalletMaterial from "../../product/models/ProductVariantPalletMaterial.model"
import ProductType from "../../product-type/models/ProductType.model"
import Destination from "../../destination/models/Destination.model"
import Customer from "../../customer/models/Customer.model"
import Quote from "../models/Quote.model"
import { AppError, NotFoundError } from "../../../shared/errors/AppError"
import { CalculateQuoteInput, IngredientMixLineInput } from "../schemas/quote.schema"

interface RawMaterialLine {
    ingredientId: number
    displayName: string
    unitCost: number
    quantityPerUnit: number
    totalUnits: number
    lineTotal: number
}

interface UnitPackagingLine {
    packagingId: number
    displayName: string
    unitCost: number
    totalUnits: number
    lineTotal: number
}

interface PalletMaterialLine {
    packagingId: number
    displayName: string
    unitCost: number
    quantityPerPallet: number
    requestedPallets: number
    lineTotal: number
}

interface TransportLine {
    destinationId: number
    displayName: string
    baseCost: number
}

export interface QuoteCalculation {
    productVariantId: number
    destinationId: number
    productDisplayName: string
    variantLabel: string | null
    requestedPallets: number
    totalUnits: number
    rawMaterialCost: number
    unitPackagingCost: number
    palletMaterialCost: number
    transportCost: number
    totalCost: number
    breakdown: {
        rawMaterials: RawMaterialLine[]
        unitPackaging: UnitPackagingLine | null
        palletMaterials: PalletMaterialLine[]
        transport: TransportLine
    }
}

// Cuánto tolerar de la suma de porcentajes por redondeo de UI (ej. 33.33 x3 = 99.99).
// Cualquier desvío mayor a esto se rechaza: no hay "relleno" implícito, el % define el peso real.
const MIX_PERCENTAGE_TOLERANCE = 0.5

// Construye las líneas de materia prima de un producto customizable a partir del mix que
// eligió el cliente. No confía en el front: revalida contra el pool y los límites del admin.
function buildCustomizableRawMaterials(
    pool: ProductIngredient[],
    mix: IngredientMixLineInput[] | undefined,
    netWeightGrams: number,
    totalUnits: number
): RawMaterialLine[] {
    if (!mix || mix.length === 0) {
        throw new AppError(422, "errors.ingredient_mix_required")
    }
    if (!netWeightGrams || netWeightGrams <= 0) {
        throw new AppError(422, "errors.presentation_missing_net_weight")
    }

    const poolByIngredientId = new Map(pool.map(productIngredient => [productIngredient.ingredientId, productIngredient]))
    const seenIngredientIds = new Set<number>()

    let percentageTotal = 0
    const rawMaterials: RawMaterialLine[] = mix.map(mixLine => {
        if (seenIngredientIds.has(mixLine.ingredientId)) {
            throw new AppError(422, "errors.duplicate_ingredient_in_mix", { ingredientId: mixLine.ingredientId })
        }
        seenIngredientIds.add(mixLine.ingredientId)

        const poolEntry = poolByIngredientId.get(mixLine.ingredientId)
        if (!poolEntry) {
            throw new AppError(422, "errors.ingredient_not_in_pool", { ingredientId: mixLine.ingredientId })
        }

        const minPercentage = poolEntry.minPercentage !== null && poolEntry.minPercentage !== undefined ? Number(poolEntry.minPercentage) : 0
        const maxPercentage = poolEntry.maxPercentage !== null && poolEntry.maxPercentage !== undefined ? Number(poolEntry.maxPercentage) : 100
        if (mixLine.percentage < minPercentage || mixLine.percentage > maxPercentage) {
            throw new AppError(422, "errors.ingredient_percentage_out_of_range", {
                ingredientId: mixLine.ingredientId,
                minPercentage,
                maxPercentage
            })
        }

        percentageTotal += mixLine.percentage

        const ingredient = poolEntry.usedIngredient
        const unitCost = Number(ingredient?.costPerUnit ?? 0)
        // netWeightGrams siempre está en gramos; se convierte a la unidad en la que está
        // cotizado el ingrediente (costUnit) usando el baseFactor de esa unidad. costUnitId es
        // opcional en el catálogo de Ingredient -- si falta, NO se asume baseFactor=1 (eso
        // trataba los gramos crudos como si ya fueran la unidad de costeo, inflando el costo
        // ~1000x cuando el ingrediente en realidad se cotiza por kg). Se rechaza explícito.
        if (!ingredient?.costUnit) {
            throw new AppError(422, "errors.ingredient_missing_cost_unit", { ingredientId: mixLine.ingredientId })
        }
        // La conversión gramos -> unidad de costeo solo tiene sentido si esa unidad es de peso
        // (g/kg/lb). Un costUnit de volumen o conteo (ej. "litro", "unidad") daría un número
        // que parece válido pero no significa nada -- se está dividiendo peso entre algo que no
        // es peso.
        if (ingredient.costUnit.unitType !== "weight") {
            throw new AppError(422, "errors.ingredient_cost_unit_type_mismatch", {
                ingredientId: mixLine.ingredientId,
                unitType: ingredient.costUnit.unitType
            })
        }
        const costUnitBaseFactor = Number(ingredient.costUnit.baseFactor)
        const gramsPerUnit = (mixLine.percentage / 100) * netWeightGrams
        const quantityPerUnit = gramsPerUnit / costUnitBaseFactor
        const lineTotal = unitCost * quantityPerUnit * totalUnits

        return {
            ingredientId: mixLine.ingredientId,
            displayName: ingredient?.displayName ?? "",
            unitCost,
            quantityPerUnit,
            totalUnits,
            lineTotal
        }
    })

    if (Math.abs(percentageTotal - 100) > MIX_PERCENTAGE_TOLERANCE) {
        throw new AppError(422, "errors.mix_percentage_must_total_100", { percentageTotal: Math.round(percentageTotal * 100) / 100 })
    }

    return rawMaterials
}

async function calculateQuote(input: CalculateQuoteInput): Promise<QuoteCalculation> {
    const variant = await ProductVariant.findOne({
        where: { id: input.productVariantId, isActive: true },
        include: [
            {
                model: Product,
                as: "parentProduct",
                include: [
                    {
                        model: ProductIngredient,
                        as: "productIngredients",
                        where: { isActive: true },
                        required: false,
                        include: [{ model: Ingredient, as: "usedIngredient", include: [{ model: Unit, as: "costUnit" }] }]
                    }
                ]
            },
            { model: Presentation, as: "sizePresentation" },
            { model: Packaging, as: "usedPackaging" },
            {
                model: ProductVariantPalletMaterial,
                as: "palletMaterials",
                where: { isActive: true },
                required: false,
                include: [{ model: Packaging, as: "usedPalletMaterial" }]
            }
        ]
    })
    if (!variant) throw new NotFoundError("ProductVariant", input.productVariantId)

    if (!variant.unitsPerPallet || variant.unitsPerPallet <= 0) {
        throw new AppError(422, "errors.pallet_not_configured")
    }

    const destination = await Destination.findOne({ where: { id: input.destinationId, isActive: true } })
    if (!destination) throw new NotFoundError("Destination", input.destinationId)

    const requestedPallets = input.requestedPallets
    const totalUnits = requestedPallets * variant.unitsPerPallet

    const rawMaterials: RawMaterialLine[] = variant.parentProduct?.isCustomizable
        ? buildCustomizableRawMaterials(
              variant.parentProduct.productIngredients ?? [],
              input.ingredientMix,
              Number(variant.sizePresentation?.netWeightGrams ?? 0),
              totalUnits
          )
        : (variant.parentProduct?.productIngredients ?? []).map(productIngredient => {
              const unitCost = Number(productIngredient.usedIngredient?.costPerUnit ?? 0)
              const quantityPerUnit = Number(productIngredient.quantityValue ?? 0)
              const lineTotal = unitCost * quantityPerUnit * totalUnits
              return {
                  ingredientId: productIngredient.ingredientId,
                  displayName: productIngredient.usedIngredient?.displayName ?? "",
                  unitCost,
                  quantityPerUnit,
                  totalUnits,
                  lineTotal
              }
          })
    const rawMaterialCost = rawMaterials.reduce((sum, line) => sum + line.lineTotal, 0)

    const unitPackaging: UnitPackagingLine | null = variant.usedPackaging
        ? {
              packagingId: variant.usedPackaging.id,
              displayName: variant.usedPackaging.displayName,
              unitCost: Number(variant.usedPackaging.unitCost ?? 0),
              totalUnits,
              lineTotal: Number(variant.usedPackaging.unitCost ?? 0) * totalUnits
          }
        : null
    const unitPackagingCost = unitPackaging?.lineTotal ?? 0

    const palletMaterials: PalletMaterialLine[] = (variant.palletMaterials ?? []).map(palletMaterial => {
        const unitCost = Number(palletMaterial.usedPalletMaterial?.unitCost ?? 0)
        const quantityPerPallet = Number(palletMaterial.quantityValue ?? 0)
        const lineTotal = unitCost * quantityPerPallet * requestedPallets
        return {
            packagingId: palletMaterial.packagingId,
            displayName: palletMaterial.usedPalletMaterial?.displayName ?? "",
            unitCost,
            quantityPerPallet,
            requestedPallets,
            lineTotal
        }
    })
    const palletMaterialCost = palletMaterials.reduce((sum, line) => sum + line.lineTotal, 0)

    const transportCost = Number(destination.baseCost)
    const transport: TransportLine = {
        destinationId: destination.id,
        displayName: destination.displayName,
        baseCost: transportCost
    }

    const totalCost = rawMaterialCost + unitPackagingCost + palletMaterialCost + transportCost

    const variantLabelParts = [variant.sizePresentation?.displayLabel, variant.usedPackaging?.displayName].filter(Boolean)

    return {
        productVariantId: variant.id,
        destinationId: destination.id,
        productDisplayName: variant.parentProduct?.displayName ?? "",
        variantLabel: variantLabelParts.length > 0 ? variantLabelParts.join(" · ") : null,
        requestedPallets,
        totalUnits,
        rawMaterialCost,
        unitPackagingCost,
        palletMaterialCost,
        transportCost,
        totalCost,
        breakdown: {
            rawMaterials,
            unitPackaging,
            palletMaterials,
            transport
        }
    }
}

export interface QuotableVariant {
    id: number
    skuCode: string | null
    unitsPerPallet: number
    minimumOrderQuantity: number | null
    presentationLabel: string | null
    packagingLabel: string | null
}

export interface QuotableIngredientOption {
    ingredientId: number
    displayName: string
    // El cliente necesita distinguir a simple vista la variante orgánica de la convencional
    // al armar su mix — son filas de catálogo separadas con costos distintos.
    isOrganic: boolean
    minPercentage: number
    maxPercentage: number
}

export interface QuotableProduct {
    id: number
    displayName: string
    isOrganic: boolean
    isCustomizable: boolean
    productTypeName: string | null
    ingredientPool: QuotableIngredientOption[]
    variants: QuotableVariant[]
}

// Only products with at least one active, pallet-configured variant can be quoted —
// costing needs unitsPerPallet to turn "N pallets" into a raw-material/packaging total.
async function listQuotableProducts(): Promise<QuotableProduct[]> {
    const products = await Product.findAll({
        where: { isActive: true },
        include: [
            {
                model: ProductVariant,
                as: "productVariants",
                required: true,
                where: { isActive: true, unitsPerPallet: { [Op.not]: null } },
                include: [
                    { model: Presentation, as: "sizePresentation" },
                    { model: Packaging, as: "usedPackaging" }
                ]
            },
            { model: ProductType, as: "parentProductType" },
            {
                model: ProductIngredient,
                as: "productIngredients",
                required: false,
                where: { isActive: true },
                include: [{ model: Ingredient, as: "usedIngredient" }]
            }
        ],
        order: [["displayName", "ASC"]]
    })

    return products.map(product => {
        const plain = product.toJSON()
        return {
            id: plain.id,
            displayName: plain.displayName,
            isOrganic: plain.isOrganic,
            isCustomizable: plain.isCustomizable,
            productTypeName: plain.parentProductType?.displayName ?? null,
            // Solo tiene sentido mostrar el pool cuando el producto es customizable —
            // en un producto terminado la receta es fija y no la elige el cliente.
            ingredientPool: plain.isCustomizable
                ? (plain.productIngredients ?? []).map((productIngredient: ProductIngredient) => ({
                      ingredientId: productIngredient.ingredientId,
                      displayName: productIngredient.usedIngredient?.displayName ?? "",
                      isOrganic: productIngredient.usedIngredient?.isOrganic ?? false,
                      minPercentage: productIngredient.minPercentage !== null && productIngredient.minPercentage !== undefined
                          ? Number(productIngredient.minPercentage)
                          : 0,
                      maxPercentage: productIngredient.maxPercentage !== null && productIngredient.maxPercentage !== undefined
                          ? Number(productIngredient.maxPercentage)
                          : 100
                  }))
                : [],
            variants: (plain.productVariants ?? []).map((variant: ProductVariant) => ({
                id: variant.id,
                skuCode: variant.skuCode ?? null,
                unitsPerPallet: variant.unitsPerPallet as number,
                minimumOrderQuantity: variant.minimumOrderQuantity ?? null,
                presentationLabel: variant.sizePresentation?.displayLabel ?? null,
                packagingLabel: variant.usedPackaging?.displayName ?? null
            }))
        }
    })
}

async function listQuoteDestinations(): Promise<Destination[]> {
    return Destination.findAll({ where: { isActive: true }, order: [["displayName", "ASC"]] })
}

// Guarda la cotización que el cliente decide conservar. Nunca confía en el desglose que
// pudiera venir del front (no se recibe ninguno): siempre recalcula desde cero con
// calculateQuote y persiste ESE resultado como snapshot -- misma fuente de verdad que /preview.
async function saveQuote(customerId: number, input: CalculateQuoteInput): Promise<QuoteCalculation & { id: number; createdAt: Date }> {
    const calculation = await calculateQuote(input)

    const quote = await Quote.create({
        customerId,
        productVariantId: calculation.productVariantId,
        destinationId: calculation.destinationId,
        productDisplayName: calculation.productDisplayName,
        variantLabel: calculation.variantLabel,
        requestedPallets: calculation.requestedPallets,
        totalUnits: calculation.totalUnits,
        rawMaterialCost: calculation.rawMaterialCost,
        unitPackagingCost: calculation.unitPackagingCost,
        palletMaterialCost: calculation.palletMaterialCost,
        transportCost: calculation.transportCost,
        totalCost: calculation.totalCost,
        breakdown: calculation.breakdown
    })

    return {
        ...calculation,
        id: quote.id,
        createdAt: quote.get("createdAt") as Date
    }
}

async function listCustomerQuotes(customerId: number): Promise<Quote[]> {
    return Quote.findAll({ where: { customerId }, order: [["createdAt", "DESC"]] })
}

// Panel admin: TODAS las cotizaciones que llegan, sin importar el cliente que las generó.
// Trae el cliente (nombre/empresa/email) para que el admin sepa quién la pidió sin tener que
// entrar a "Clientes" a buscarlo aparte.
async function listAllQuotes(): Promise<Quote[]> {
    return Quote.findAll({
        include: [{ model: Customer, as: "quotingCustomer", attributes: ["id", "name", "companyName", "email"] }],
        order: [["createdAt", "DESC"]]
    })
}

export const quoteService = {
    calculateQuote,
    listQuotableProducts,
    listQuoteDestinations,
    saveQuote,
    listCustomerQuotes,
    listAllQuotes,
}
