import { Table, Column, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import BaseCatalogModel from "../../../shared/base-model/BaseCatalogModel";
import Unit from "../../unit/models/Unit.model";
import ProductIngredient from "../../product/models/ProductIngredient.model";

@Table({
    tableName: "ingredients"
})
class Ingredient extends BaseCatalogModel {
    @Column({
        type: DataType.STRING(120),
        allowNull: false
    })
    declare displayName: string

    @Column({
        type: DataType.STRING(120),
        allowNull: false,
        unique: true
    })
    declare urlSlug: string

    @Column({
        type: DataType.ENUM("fruit", "vegetable", "pulp", "other"),
        allowNull: false
    })
    declare ingredientType: string

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    declare isOrganicAvailable: boolean

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true
    })
    declare isMixable: boolean

    @Column({
        type: DataType.DECIMAL(10, 4),
        allowNull: true
    })
    declare costPerUnit: number

    @ForeignKey(() => Unit)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    declare costUnitId: number

    @BelongsTo(() => Unit, "costUnitId")
    declare costUnit: Unit

    @HasMany(() => ProductIngredient, "ingredientId")
    declare productIngredients: ProductIngredient[]
}

export default Ingredient;
