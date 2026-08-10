import "reflect-metadata"

// Mocks manuales de los modelos: quote.service.ts solo llama a ProductVariant.findOne,
// Destination.findOne y Quote.create -- no hace falta una base de datos real ni los
// decoradores de sequelize-typescript para probar la lógica de negocio de calculateQuote.
// Cada mock devuelve un objeto plano con exactamente la forma que calculateQuote lee
// (ver quote.service.ts), no una instancia real de Sequelize.
jest.mock("../../product/models/ProductVariant.model", () => ({
    __esModule: true,
    default: { findOne: jest.fn() }
}))
jest.mock("../../destination/models/Destination.model", () => ({
    __esModule: true,
    default: { findOne: jest.fn() }
}))
jest.mock("../models/Quote.model", () => ({
    __esModule: true,
    default: { create: jest.fn() }
}))

import ProductVariant from "../../product/models/ProductVariant.model"
import Destination from "../../destination/models/Destination.model"
import Quote from "../models/Quote.model"
import { quoteService } from "./quote.service"
import { NotFoundError } from "../../../shared/errors/AppError"
import { CalculateQuoteInput } from "../schemas/quote.schema"

const mockVariantFindOne = ProductVariant.findOne as unknown as jest.Mock
const mockDestinationFindOne = Destination.findOne as unknown as jest.Mock
const mockQuoteCreate = Quote.create as unknown as jest.Mock

// Costo de destino usado en todos los casos salvo que un test lo pise explícitamente.
const DESTINATION = { id: 900, displayName: "Puerto Cortés", baseCost: 50 }

function stubDestination(overrides: Partial<typeof DESTINATION> = {}): void {
    mockDestinationFindOne.mockResolvedValue({ ...DESTINATION, ...overrides })
}

describe("quoteService.calculateQuote", () => {
    beforeEach(() => {
        stubDestination()
    })

    const baseInput: CalculateQuoteInput = {
        productVariantId: 10,
        destinationId: 900,
        requestedPallets: 1,
    }

    describe("guardas de negocio (config faltante / inválida)", () => {
        it("rechaza si la variante no existe (NotFoundError)", async () => {
            mockVariantFindOne.mockResolvedValue(null)

            await expect(quoteService.calculateQuote(baseInput)).rejects.toBeInstanceOf(NotFoundError)
        })

        it("rechaza si el destino no existe (NotFoundError)", async () => {
            mockVariantFindOne.mockResolvedValue({ id: 10, unitsPerPallet: 20, parentProduct: { isCustomizable: false, productIngredients: [] } })
            mockDestinationFindOne.mockResolvedValue(null)

            await expect(quoteService.calculateQuote(baseInput)).rejects.toBeInstanceOf(NotFoundError)
        })

        it("rechaza si la variante no tiene unitsPerPallet configurado (bug histórico: cotizar sin palet configurado)", async () => {
            mockVariantFindOne.mockResolvedValue({ id: 10, unitsPerPallet: null, parentProduct: { isCustomizable: false, productIngredients: [] } })

            await expect(quoteService.calculateQuote(baseInput)).rejects.toMatchObject({ key: "errors.pallet_not_configured" })
        })

        it("rechaza unitsPerPallet en 0 igual que null", async () => {
            mockVariantFindOne.mockResolvedValue({ id: 10, unitsPerPallet: 0, parentProduct: { isCustomizable: false, productIngredients: [] } })

            await expect(quoteService.calculateQuote(baseInput)).rejects.toMatchObject({ key: "errors.pallet_not_configured" })
        })
    })

    describe("receta fija (producto no personalizable)", () => {
        function stubFixedRecipeVariant(): void {
            mockVariantFindOne.mockResolvedValue({
                id: 10,
                unitsPerPallet: 20,
                parentProduct: {
                    isCustomizable: false,
                    displayName: "Piña en Trozos",
                    productIngredients: [
                        { ingredientId: 1, quantityValue: 0.5, usedIngredient: { displayName: "Piña", costPerUnit: 20 } }
                    ]
                },
                sizePresentation: { displayLabel: "Bolsa 2kg", netWeightGrams: 2000 },
                usedPackaging: { id: 5, displayName: "Bolsa plástica", unitCost: 1 },
                palletMaterials: [
                    { packagingId: 6, quantityValue: 10, usedPalletMaterial: { displayName: "Caja corrugada", unitCost: 1 } },
                    { packagingId: 7, quantityValue: 4, usedPalletMaterial: { displayName: "Parales", unitCost: 1 } }
                ]
            })
        }

        it("calcula el total correcto sumando materia prima + empaque + materiales de palet + transporte", async () => {
            stubFixedRecipeVariant()

            const result = await quoteService.calculateQuote(baseInput)

            // totalUnits = 1 palet * 20 unidades/palet = 20
            expect(result.totalUnits).toBe(20)
            // rawMaterialCost = costPerUnit(20) * quantityValue(0.5) * totalUnits(20)
            expect(result.rawMaterialCost).toBe(200)
            // unitPackagingCost = unitCost(1) * totalUnits(20)
            expect(result.unitPackagingCost).toBe(20)
            // palletMaterialCost = (1*10*1) + (1*4*1)
            expect(result.palletMaterialCost).toBe(14)
            expect(result.transportCost).toBe(50)
            expect(result.totalCost).toBe(284)
        })

        it("multiplica el costo de materiales de palet por la cantidad de palets solicitados, no por totalUnits", async () => {
            stubFixedRecipeVariant()

            const result = await quoteService.calculateQuote({ ...baseInput, requestedPallets: 3 })

            // palletMaterialCost escala con requestedPallets (3), no con totalUnits (60)
            expect(result.palletMaterialCost).toBe(42) // 14 * 3
            expect(result.totalUnits).toBe(60)
        })

        it("no revienta si el producto no tiene empaque unitario asignado", async () => {
            mockVariantFindOne.mockResolvedValue({
                id: 10,
                unitsPerPallet: 20,
                parentProduct: { isCustomizable: false, productIngredients: [] },
                usedPackaging: null,
                palletMaterials: []
            })

            const result = await quoteService.calculateQuote(baseInput)

            expect(result.unitPackagingCost).toBe(0)
            expect(result.breakdown.unitPackaging).toBeNull()
        })
    })

    describe("mix personalizable (producto isCustomizable)", () => {
        function stubCustomizableVariant(): void {
            mockVariantFindOne.mockResolvedValue({
                id: 10,
                unitsPerPallet: 20,
                parentProduct: {
                    isCustomizable: true,
                    displayName: "Smoothie Personalizado",
                    productIngredients: [
                        {
                            ingredientId: 1,
                            minPercentage: null,
                            maxPercentage: null,
                            usedIngredient: {
                                displayName: "Piña convencional",
                                costPerUnit: 20,
                                costUnit: { unitType: "weight", baseFactor: 1000 }
                            }
                        },
                        {
                            ingredientId: 2,
                            minPercentage: null,
                            maxPercentage: null,
                            usedIngredient: {
                                displayName: "Piña orgánica",
                                costPerUnit: 15,
                                costUnit: { unitType: "weight", baseFactor: 1000 }
                            }
                        }
                    ]
                },
                sizePresentation: { displayLabel: "Bolsa 2kg", netWeightGrams: 2000 },
                usedPackaging: { id: 5, displayName: "Bolsa plástica", unitCost: 1 },
                palletMaterials: [
                    { packagingId: 6, quantityValue: 10, usedPalletMaterial: { displayName: "Caja corrugada", unitCost: 1 } },
                    { packagingId: 7, quantityValue: 4, usedPalletMaterial: { displayName: "Parales", unitCost: 1 } }
                ]
            })
        }

        // Caso verificado a mano por el usuario contra el cotizador real en producción
        // (2026-08-10, ver memoria del proyecto) -- Q763.40 exacto. Si este test empieza a
        // fallar, es una señal directa de regresión en el motor de cálculo, no un falso positivo.
        it("reproduce el caso verificado en producción: 40% piña convencional + 59.9% piña orgánica = Q763.40", async () => {
            stubCustomizableVariant()

            const result = await quoteService.calculateQuote({
                ...baseInput,
                ingredientMix: [
                    { ingredientId: 1, percentage: 40 },
                    { ingredientId: 2, percentage: 59.9 }
                ]
            })

            expect(result.rawMaterialCost).toBeCloseTo(679.4, 5)
            expect(result.unitPackagingCost).toBe(20)
            expect(result.palletMaterialCost).toBe(14)
            expect(result.transportCost).toBe(50)
            expect(result.totalCost).toBeCloseTo(763.4, 5)
        })

        it("rechaza si no se manda ningún mix", async () => {
            stubCustomizableVariant()

            await expect(quoteService.calculateQuote(baseInput)).rejects.toMatchObject({ key: "errors.ingredient_mix_required" })
        })

        it("rechaza si el mix no suma 100% (fuera de la tolerancia de 0.5)", async () => {
            stubCustomizableVariant()

            await expect(
                quoteService.calculateQuote({
                    ...baseInput,
                    ingredientMix: [
                        { ingredientId: 1, percentage: 40 },
                        { ingredientId: 2, percentage: 50 } // suma 90, desvío de 10
                    ]
                })
            ).rejects.toMatchObject({ key: "errors.mix_percentage_must_total_100" })
        })

        it("acepta el mix justo en el borde de la tolerancia (±0.5)", async () => {
            stubCustomizableVariant()

            const result = await quoteService.calculateQuote({
                ...baseInput,
                ingredientMix: [
                    { ingredientId: 1, percentage: 40 },
                    { ingredientId: 2, percentage: 59.5 } // suma 99.5, desvío exacto de 0.5
                ]
            })

            expect(result.totalCost).toBeGreaterThan(0)
        })

        it("rechaza un desvío de 0.51 por encima de la tolerancia (borde exclusivo)", async () => {
            stubCustomizableVariant()

            await expect(
                quoteService.calculateQuote({
                    ...baseInput,
                    ingredientMix: [
                        { ingredientId: 1, percentage: 40 },
                        { ingredientId: 2, percentage: 59.49 } // suma 99.49, desvío de 0.51
                    ]
                })
            ).rejects.toMatchObject({ key: "errors.mix_percentage_must_total_100" })
        })

        it("rechaza un ingrediente duplicado en el mix", async () => {
            stubCustomizableVariant()

            await expect(
                quoteService.calculateQuote({
                    ...baseInput,
                    ingredientMix: [
                        { ingredientId: 1, percentage: 50 },
                        { ingredientId: 1, percentage: 50 }
                    ]
                })
            ).rejects.toMatchObject({ key: "errors.duplicate_ingredient_in_mix" })
        })

        it("rechaza un ingrediente que no está en el pool del producto", async () => {
            stubCustomizableVariant()

            await expect(
                quoteService.calculateQuote({
                    ...baseInput,
                    ingredientMix: [
                        { ingredientId: 999, percentage: 100 }
                    ]
                })
            ).rejects.toMatchObject({ key: "errors.ingredient_not_in_pool" })
        })

        it("rechaza un porcentaje fuera de los límites min/max que puso el admin", async () => {
            mockVariantFindOne.mockResolvedValue({
                id: 10,
                unitsPerPallet: 20,
                parentProduct: {
                    isCustomizable: true,
                    productIngredients: [
                        {
                            ingredientId: 1,
                            minPercentage: 20,
                            maxPercentage: 30,
                            usedIngredient: { costPerUnit: 20, costUnit: { unitType: "weight", baseFactor: 1000 } }
                        }
                    ]
                },
                sizePresentation: { netWeightGrams: 2000 },
                usedPackaging: null,
                palletMaterials: []
            })

            await expect(
                quoteService.calculateQuote({ ...baseInput, ingredientMix: [{ ingredientId: 1, percentage: 80 }] })
            ).rejects.toMatchObject({ key: "errors.ingredient_percentage_out_of_range" })
        })

        it("rechaza si al ingrediente le falta costUnit (bug histórico: costos 'en millones')", async () => {
            mockVariantFindOne.mockResolvedValue({
                id: 10,
                unitsPerPallet: 20,
                parentProduct: {
                    isCustomizable: true,
                    productIngredients: [
                        { ingredientId: 1, minPercentage: null, maxPercentage: null, usedIngredient: { costPerUnit: 20, costUnit: null } }
                    ]
                },
                sizePresentation: { netWeightGrams: 2000 },
                usedPackaging: null,
                palletMaterials: []
            })

            await expect(
                quoteService.calculateQuote({ ...baseInput, ingredientMix: [{ ingredientId: 1, percentage: 100 }] })
            ).rejects.toMatchObject({ key: "errors.ingredient_missing_cost_unit" })
        })

        it("rechaza si el costUnit del ingrediente no es de peso (bug histórico: unitType no validado)", async () => {
            mockVariantFindOne.mockResolvedValue({
                id: 10,
                unitsPerPallet: 20,
                parentProduct: {
                    isCustomizable: true,
                    productIngredients: [
                        {
                            ingredientId: 1,
                            minPercentage: null,
                            maxPercentage: null,
                            usedIngredient: { costPerUnit: 20, costUnit: { unitType: "volume", baseFactor: 1000 } }
                        }
                    ]
                },
                sizePresentation: { netWeightGrams: 2000 },
                usedPackaging: null,
                palletMaterials: []
            })

            await expect(
                quoteService.calculateQuote({ ...baseInput, ingredientMix: [{ ingredientId: 1, percentage: 100 }] })
            ).rejects.toMatchObject({ key: "errors.ingredient_cost_unit_type_mismatch" })
        })

        it("rechaza si la presentación no tiene netWeightGrams", async () => {
            mockVariantFindOne.mockResolvedValue({
                id: 10,
                unitsPerPallet: 20,
                parentProduct: {
                    isCustomizable: true,
                    productIngredients: [
                        { ingredientId: 1, minPercentage: null, maxPercentage: null, usedIngredient: { costPerUnit: 20, costUnit: { unitType: "weight", baseFactor: 1000 } } }
                    ]
                },
                sizePresentation: { netWeightGrams: null },
                usedPackaging: null,
                palletMaterials: []
            })

            await expect(
                quoteService.calculateQuote({ ...baseInput, ingredientMix: [{ ingredientId: 1, percentage: 100 }] })
            ).rejects.toMatchObject({ key: "errors.presentation_missing_net_weight" })
        })
    })
})

describe("quoteService.saveQuote", () => {
    beforeEach(() => {
        stubDestination()
    })

    it("nunca confía en el desglose del cliente: siempre persiste lo que devuelve calculateQuote, no el input recibido", async () => {
        mockVariantFindOne.mockResolvedValue({
            id: 10,
            unitsPerPallet: 20,
            parentProduct: {
                isCustomizable: false,
                displayName: "Piña en Trozos",
                productIngredients: [
                    { ingredientId: 1, quantityValue: 0.5, usedIngredient: { displayName: "Piña", costPerUnit: 20 } }
                ]
            },
            sizePresentation: { displayLabel: "Bolsa 2kg", netWeightGrams: 2000 },
            usedPackaging: { id: 5, displayName: "Bolsa plástica", unitCost: 1 },
            palletMaterials: []
        })
        mockQuoteCreate.mockResolvedValue({ id: 555, get: () => new Date("2026-08-10T00:00:00Z") })

        // Input "malicioso": intenta mandar un totalCost inventado por fuera del schema real.
        // calculateQuoteSchema no tiene ese campo, así que TypeScript ya lo rechazaría en
        // producción -- lo forzamos aquí con `as` para simular un cliente que igual lo intenta
        // a nivel de HTTP crudo (bypaseando el tipo).
        const tamperedInput = {
            productVariantId: 10,
            destinationId: 900,
            requestedPallets: 1,
            totalCost: 999999,
        } as CalculateQuoteInput

        const saved = await quoteService.saveQuote(42, tamperedInput)

        // rawMaterialCost(200) + unitPackagingCost(20) + palletMaterialCost(0, sin materiales) + transportCost(50)
        expect(saved.totalCost).toBe(270) // recalculado server-side, no 999999
        expect(mockQuoteCreate).toHaveBeenCalledWith(
            expect.objectContaining({ customerId: 42, totalCost: 270 })
        )
    })
})
