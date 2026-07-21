import { Table, Column, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import BaseCatalogModel from "../../../shared/base-model/BaseCatalogModel";
import SubCategory from "../../category/models/SubCategory.model";
import ProductType from "../../product-type/models/ProductType.model";
import ProductVariant from "./ProductVariant.model";
import ProductIngredient from "./ProductIngredient.model";
import ProductAddin from "./ProductAddin.model";
import ProductAttribute from "./ProductAttribute.model";

@Table({
    tableName: "products"
})
class Product extends BaseCatalogModel {
    @ForeignKey(() => SubCategory)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare subCategoryId: number

    @ForeignKey(() => ProductType)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare productTypeId: number

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
        type: DataType.TEXT,
        allowNull: true
    })
    declare fullDescription: string

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    declare isOrganic: boolean

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    declare isCustomizable: boolean

    @Column({
        type: DataType.STRING(255),
        allowNull: true
    })
    declare imageUrl: string

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0
    })
    declare displayOrder: number

    @BelongsTo(() => SubCategory, "subCategoryId")
    declare parentSubCategory: SubCategory

    @BelongsTo(() => ProductType, "productTypeId")
    declare parentProductType: ProductType

    @HasMany(() => ProductVariant, "productId")
    declare productVariants: ProductVariant[]

    @HasMany(() => ProductIngredient, "productId")
    declare productIngredients: ProductIngredient[]

    @HasMany(() => ProductAddin, "productId")
    declare productAddins: ProductAddin[]

    @HasMany(() => ProductAttribute, "productId")
    declare productAttributes: ProductAttribute[]
}

export default Product;
