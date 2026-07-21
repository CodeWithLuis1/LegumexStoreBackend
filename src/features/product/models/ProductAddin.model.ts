import { Table, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import BaseCatalogModel from "../../../shared/base-model/BaseCatalogModel";
import Product from "./Product.model";
import Addin from "../../addin/models/Addin.model";

@Table({
    tableName: "productAddins",
    indexes: [
        {
            unique: true,
            fields: ["productId", "addinId"]
        }
    ]
})
class ProductAddin extends BaseCatalogModel {
    @ForeignKey(() => Product)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare productId: number

    @ForeignKey(() => Addin)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare addinId: number

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    declare isDefault: boolean

    @BelongsTo(() => Product, "productId")
    declare parentProduct: Product

    @BelongsTo(() => Addin, "addinId")
    declare linkedAddin: Addin
}

export default ProductAddin;
