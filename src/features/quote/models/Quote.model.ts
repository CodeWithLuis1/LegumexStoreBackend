import { Table, Column, DataType, ForeignKey, BelongsTo, Model } from "sequelize-typescript";
import Customer from "../../customer/models/Customer.model";
import ProductVariant from "../../product/models/ProductVariant.model";
import Destination from "../../destination/models/Destination.model";

// Cotización guardada por el cliente. A diferencia del catálogo (Ingredient, Packaging, etc.)
// esto es un registro histórico, no un maestro editable: por eso NO extiende BaseCatalogModel
// (no tiene isActive, nunca se "desactiva", solo existe o no existe).
//
// Decisión de negocio (ver memoria del proyecto): los costos NO se versionan con tablas de
// historial -- el desglose completo se congela en `breakdown` (JSONB) al momento de guardar,
// así que si el catálogo cambia después, esta cotización no cambia. Las columnas sueltas
// (totalCost, requestedPallets, etc.) son para poder listar/ordenar sin tener que leer el JSON.
@Table({
    tableName: "quotes"
})
class Quote extends Model {
    @ForeignKey(() => Customer)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare customerId: number

    @ForeignKey(() => ProductVariant)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare productVariantId: number

    @ForeignKey(() => Destination)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare destinationId: number

    @Column({
        type: DataType.STRING(150),
        allowNull: false
    })
    declare productDisplayName: string

    @Column({
        type: DataType.STRING(150),
        allowNull: true
    })
    declare variantLabel: string | null

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare requestedPallets: number

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare totalUnits: number

    @Column({
        type: DataType.DECIMAL(12, 2),
        allowNull: false
    })
    declare rawMaterialCost: number

    @Column({
        type: DataType.DECIMAL(12, 2),
        allowNull: false
    })
    declare unitPackagingCost: number

    @Column({
        type: DataType.DECIMAL(12, 2),
        allowNull: false
    })
    declare palletMaterialCost: number

    @Column({
        type: DataType.DECIMAL(12, 2),
        allowNull: false
    })
    declare transportCost: number

    @Column({
        type: DataType.DECIMAL(12, 2),
        allowNull: false
    })
    declare totalCost: number

    // Snapshot completo del desglose (rawMaterials/unitPackaging/palletMaterials/transport),
    // mismo shape que QuoteCalculation.breakdown -- así el detalle se puede repintar con
    // QuoteResultCard sin volver a calcular nada.
    @Column({
        type: DataType.JSONB,
        allowNull: false
    })
    declare breakdown: object

    @BelongsTo(() => Customer, "customerId")
    declare quotingCustomer: Customer

    @BelongsTo(() => ProductVariant, "productVariantId")
    declare quotedVariant: ProductVariant

    @BelongsTo(() => Destination, "destinationId")
    declare quotedDestination: Destination
}

export default Quote;
