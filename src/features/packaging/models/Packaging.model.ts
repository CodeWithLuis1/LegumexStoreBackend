import { Table, Column, DataType, HasMany } from "sequelize-typescript";
import BaseCatalogModel from "../../../shared/base-model/BaseCatalogModel";
import ProductVariant from "../../product/models/ProductVariant.model";
import ProductVariantPalletMaterial from "../../product/models/ProductVariantPalletMaterial.model";

@Table({
    tableName: "packagings"
})
class Packaging extends BaseCatalogModel {
    @Column({
        type: DataType.STRING(80),
        allowNull: false
    })
    declare displayName: string

    @Column({
        type: DataType.ENUM("unit", "pallet"),
        allowNull: false,
        defaultValue: "unit"
    })
    declare packagingRole: string

    @Column({
        type: DataType.STRING(80),
        allowNull: true
    })
    declare packagingMaterial: string

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: true
    })
    declare unitCost: number

    @HasMany(() => ProductVariant, "packagingId")
    declare packagedVariants: ProductVariant[]

    @HasMany(() => ProductVariantPalletMaterial, "packagingId")
    declare palletMaterialUsages: ProductVariantPalletMaterial[]
}

export default Packaging;
