import { Table, Column, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript";
import BaseCatalogModel from "../../../shared/base-model/BaseCatalogModel";
import SubCategory from "../../category/models/SubCategory.model";
import ProductType from "../../product-type/models/ProductType.model";
import ProductVariant from "./ProductVariant.model";
import ProductIngredient from "./ProductIngredient.model";
import ProductTranslation from "./ProductTranslation.model";

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
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    declare isOrganic: boolean

    // Producto terminado (receta fija en ProductIngredient.quantityValue) vs
    // producto personalizable (el cliente arma el mix en la cotización, ver
    // ProductIngredient.minPercentage/maxPercentage y quoteService.calculateQuote).
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    declare isCustomizable: boolean

    // URL pública en S3 (o null si el producto todavía no tiene foto). No se versiona ni se
    // borra en cascada al desactivar el producto -- ver product.service.ts para el manejo de
    // subida/reemplazo/borrado contra S3.
    @Column({
        type: DataType.STRING(500),
        allowNull: true
    })
    declare imageUrl: string | null

    @BelongsTo(() => SubCategory, "subCategoryId")
    declare parentSubCategory: SubCategory

    @BelongsTo(() => ProductType, "productTypeId")
    declare parentProductType: ProductType

    @HasMany(() => ProductVariant, "productId")
    declare productVariants: ProductVariant[]

    @HasMany(() => ProductIngredient, "productId")
    declare productIngredients: ProductIngredient[]

    // Traducciones a idiomas distintos al español -- ver ProductTranslation.model.ts.
    @HasMany(() => ProductTranslation, "productId")
    declare translations: ProductTranslation[]
}

export default Product;
