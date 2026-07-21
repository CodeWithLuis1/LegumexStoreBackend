import { Table, Column, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import BaseCatalogModel from "../../../shared/base-model/BaseCatalogModel";
import Unit from "../../unit/models/Unit.model";
import Category from "../../category/models/Category.model";
import ProductVariant from "../../product/models/ProductVariant.model";

@Table({
    tableName: "presentations"
})
class Presentation extends BaseCatalogModel {
    @Column({
        type: DataType.STRING(40),
        allowNull: false
    })
    declare displayLabel: string

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: true
    })
    declare netWeightGrams: number

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: true
    })
    declare displayValue: number

    @ForeignKey(() => Unit)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    declare displayUnitId: number

    @ForeignKey(() => Category)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    declare categoryId: number

    @BelongsTo(() => Unit, "displayUnitId")
    declare displayUnit: Unit

    @BelongsTo(() => Category, "categoryId")
    declare linkedCategory: Category

    @HasMany(() => ProductVariant, "presentationId")
    declare sizedVariants: ProductVariant[]
}

export default Presentation;
