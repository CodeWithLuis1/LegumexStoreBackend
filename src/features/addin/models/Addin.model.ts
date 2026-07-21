import { Table, Column, DataType, HasMany } from "sequelize-typescript";
import BaseCatalogModel from "../../../shared/base-model/BaseCatalogModel";
import ProductAddin from "../../product/models/ProductAddin.model";

@Table({
    tableName: "addins"
})
class Addin extends BaseCatalogModel {
    @Column({
        type: DataType.STRING(80),
        allowNull: false
    })
    declare displayName: string

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    declare fullDescription: string

    @Column({
        type: DataType.DECIMAL(10, 4),
        allowNull: true
    })
    declare costPerServing: number

    @HasMany(() => ProductAddin, "addinId")
    declare productAddins: ProductAddin[]
}

export default Addin;
