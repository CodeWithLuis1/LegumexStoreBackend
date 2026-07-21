import { Table, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import BaseCatalogModel from "../../../shared/base-model/BaseCatalogModel";
import Product from "./Product.model";
import Presentation from "../../presentation/models/Presentation.model";
import Packaging from "../../packaging/models/Packaging.model";

@Table({
    tableName: "productVariants"
})
class ProductVariant extends BaseCatalogModel {
    @ForeignKey(() => Product)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare productId: number

    @ForeignKey(() => Presentation)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    declare presentationId: number

    @ForeignKey(() => Packaging)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    declare packagingId: number

    @Column({
        type: DataType.STRING(60),
        allowNull: true,
        unique: true
    })
    declare skuCode: string

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: true
    })
    declare unitPrice: number

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: true
    })
    declare unitCost: number

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    declare isPriceManual: boolean

    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    declare minimumOrderQuantity: number

    @BelongsTo(() => Product, "productId")
    declare parentProduct: Product

    @BelongsTo(() => Presentation, "presentationId")
    declare sizePresentation: Presentation

    @BelongsTo(() => Packaging, "packagingId")
    declare usedPackaging: Packaging
}

export default ProductVariant;
