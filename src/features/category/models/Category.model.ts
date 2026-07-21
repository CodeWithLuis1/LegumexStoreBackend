import { Table, Column, DataType, HasMany } from "sequelize-typescript";
import BaseCatalogModel from "../../../shared/base-model/BaseCatalogModel";
import SubCategory from "./SubCategory.model";
import Presentation from "../../presentation/models/Presentation.model";

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

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0
    })
    declare displayOrder: number

    @Column({
        type: DataType.DECIMAL(5, 2),
        allowNull: true
    })
    declare defaultMargin: number

    @HasMany(() => SubCategory, "categoryId")
    declare subCategories: SubCategory[]

    @HasMany(() => Presentation, "categoryId")
    declare linkedPresentations: Presentation[]
}

export default Category;
