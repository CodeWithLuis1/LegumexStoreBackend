import { Table, Column, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import BaseCatalogModel from "../../../shared/base-model/BaseCatalogModel";
import Product from "./Product.model";
import Presentation from "../../presentation/models/Presentation.model";
import Packaging from "../../packaging/models/Packaging.model";
import ProductVariantPalletMaterial from "./ProductVariantPalletMaterial.model";

@Table({
    tableName: "productVariants"
})
class ProductVariant extends BaseCatalogModel {
    @ForeignKey(() => Product)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare productId: number

    @ForeignKey(() => Presentation)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    declare presentationId: number

    @ForeignKey(() => Packaging)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    declare packagingId: number

    @Column({
        type: DataType.STRING(60),
        allowNull: true,
        unique: true
    })
    declare skuCode: string

    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    declare unitsPerPallet: number

    // Cuántas unidades (bolsas/piezas) entran en UNA caja. No participa en el cálculo de
    // costo -- unitsPerPallet ya cubre eso -- es la referencia para no tener que calcular
    // "cajas por palet" de memoria al cargar los materiales de paletización (ver
    // productVariantPalletMaterialSection.component.tsx).
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    declare unitsPerBox: number

    @BelongsTo(() => Product, "productId")
    declare parentProduct: Product

    @BelongsTo(() => Presentation, "presentationId")
    declare sizePresentation: Presentation

    @BelongsTo(() => Packaging, "packagingId")
    declare usedPackaging: Packaging

    @HasMany(() => ProductVariantPalletMaterial, "productVariantId")
    declare palletMaterials: ProductVariantPalletMaterial[]
}

export default ProductVariant;
