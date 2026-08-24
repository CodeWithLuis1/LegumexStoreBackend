import { Table, Column, DataType, HasMany } from "sequelize-typescript";
import BaseCatalogModel from "../../../shared/base-model/BaseCatalogModel";
import SubCategory from "./SubCategory.model";
import Presentation from "../../presentation/models/Presentation.model";
import CategoryTranslation from "./CategoryTranslation.model";

@Table({
    tableName: "categories"
})
class Category extends BaseCatalogModel {
    @Column({
        type: DataType.STRING(80),
        allowNull: false
    })
    declare displayName: string

    @Column({
        type: DataType.STRING(80),
        allowNull: false,
        unique: true
    })
    declare urlSlug: string

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    declare fullDescription: string

    // URL pública en S3 (o null si la categoría todavía no tiene foto). Mismo manejo que
    // Product.imageUrl -- ver category.service.ts.
    @Column({
        type: DataType.STRING(500),
        allowNull: true
    })
    declare imageUrl: string | null

    @HasMany(() => SubCategory, "categoryId")
    declare subCategories: SubCategory[]

    @HasMany(() => Presentation, "categoryId")
    declare linkedPresentations: Presentation[]

    // Traducciones a idiomas distintos al español -- ver CategoryTranslation.model.ts.
    @HasMany(() => CategoryTranslation, "categoryId")
    declare translations: CategoryTranslation[]
}

export default Category;
