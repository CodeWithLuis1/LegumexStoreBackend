import { Table, Column, DataType } from "sequelize-typescript";
import BaseCatalogModel from "../../../shared/base-model/BaseCatalogModel";

@Table({
    tableName: "destinations"
})
class Destination extends BaseCatalogModel {
    @Column({
        type: DataType.STRING(120),
        allowNull: false
    })
    declare displayName: string

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    declare baseCost: number
}

export default Destination;
