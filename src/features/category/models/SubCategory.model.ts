import { Table, Column, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import BaseCatalogModel from "../../../shared/base-model/BaseCatalogModel";
import Category from "./Category.model";
import Product from "../../product/models/Product.model";

@Table({
    tableName: "subCategories",
    indexes: [
        {
            unique: true,
            fields: ["categoryId", "urlSlug"]
        }
    ]
})
class SubCategory extends BaseCatalogModel {
    @ForeignKey(() => Category)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare categoryId: number

    @Column({
        type: DataType.STRING(80),
        allowNull: false
    })
    declare displayName: string

    @Column({
        type: DataType.STRING(80),
        allowNull: false
    })
    declare urlSlug: string

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    declare fullDescription: string

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0
    })
    declare displayOrder: number

    @BelongsTo(() => Category, "categoryId")
    declare parentCategory: Category

    @HasMany(() => Product, "subCategoryId")
    declare childProducts: Product[]
}

export default SubCategory;
