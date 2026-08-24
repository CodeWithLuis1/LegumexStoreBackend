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

    // País al que pertenece este destino: Guatemala ("GT") o Estados Unidos ("US"). El
    // cotizador filtra los destinos disponibles según el país que elige el cliente -- cada país
    // tiene su propio set de destinos, no se mezclan en un solo selector. defaultValue evita que
    // el ALTER TABLE de sequelize.sync falle contra filas de destinos ya existentes (ver mismo
    // patrón en Packaging.packagingRole).
    @Column({
        type: DataType.ENUM("GT", "US"),
        allowNull: false,
        defaultValue: "GT"
    })
    declare country: string
}

export default Destination;
