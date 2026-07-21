import { Table, Column, DataType, HasMany } from "sequelize-typescript";
import BaseCatalogModel from "../../../shared/base-model/BaseCatalogModel";
import ProductAttribute from "../../product/models/ProductAttribute.model";

@Table({
    tableName: "attributes"
})
class Attribute extends BaseCatalogModel {
    @Column({
        type: DataType.STRING(80),
        allowNull: false,
        unique: true
    })
    declare attributeName: string

    @Column({
        type: DataType.ENUM("string", "number", "boolean", "date"),
        allowNull: false
    })
    declare dataType: string

    @Column({
        type: DataType.STRING(20),
        allowNull: true
    })
    declare unitLabel: string

    @HasMany(() => ProductAttribute, "attributeId")
    declare productAttributes: ProductAttribute[]
}

export default Attribute;
