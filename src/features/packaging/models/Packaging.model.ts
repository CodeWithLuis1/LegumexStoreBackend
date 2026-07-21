import { Table, Column, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import BaseCatalogModel from "../../../shared/base-model/BaseCatalogModel";
import Unit from "../../unit/models/Unit.model";
import ProductVariant from "../../product/models/ProductVariant.model";

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
        type: DataType.STRING(80),
        allowNull: true
    })
    declare packagingMaterial: string

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: true
    })
    declare capacityValue: number

    @ForeignKey(() => Unit)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    declare capacityUnitId: number

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: true
    })
    declare unitCost: number

    @BelongsTo(() => Unit, "capacityUnitId")
    declare capacityUnit: Unit

    @HasMany(() => ProductVariant, "packagingId")
    declare packagedVariants: ProductVariant[]
}

export default Packaging;
