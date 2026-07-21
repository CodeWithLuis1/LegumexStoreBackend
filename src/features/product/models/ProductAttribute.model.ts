import { Table, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import BaseCatalogModel from "../../../shared/base-model/BaseCatalogModel";
import Product from "./Product.model";
import Attribute from "../../attribute/models/Attribute.model";

@Table({
    tableName: "productAttributes",
    indexes: [
        {
            unique: true,
            fields: ["productId", "attributeId"]
        }
    ]
})
class ProductAttribute extends BaseCatalogModel {
    @ForeignKey(() => Product)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare productId: number

    @ForeignKey(() => Attribute)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare attributeId: number

    @Column({
        type: DataType.STRING(255),
        allowNull: true
    })
    declare valueString: string

    @Column({
        type: DataType.DECIMAL(14, 4),
        allowNull: true
    })
    declare valueNumber: number

    @Column({
        type: DataType.BOOLEAN,
        allowNull: true
    })
    declare valueBoolean: boolean

    @BelongsTo(() => Product, "productId")
    declare parentProduct: Product

    @BelongsTo(() => Attribute, "attributeId")
    declare definingAttribute: Attribute
}

export default ProductAttribute;
