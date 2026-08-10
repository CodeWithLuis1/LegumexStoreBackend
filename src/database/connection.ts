import { Sequelize } from "sequelize-typescript"
import colors from "colors"
import { env } from "../config/env"
import { runSeeders } from "./seeders"

import Category from "../features/category/models/Category.model"
import SubCategory from "../features/category/models/SubCategory.model"
import Product from "../features/product/models/Product.model"
import ProductVariant from "../features/product/models/ProductVariant.model"
import ProductIngredient from "../features/product/models/ProductIngredient.model"
import ProductVariantPalletMaterial from "../features/product/models/ProductVariantPalletMaterial.model"
import ProductType from "../features/product-type/models/ProductType.model"
import Unit from "../features/unit/models/Unit.model"
import Presentation from "../features/presentation/models/Presentation.model"
import Packaging from "../features/packaging/models/Packaging.model"
import Ingredient from "../features/ingredient/models/Ingredient.model"
import Destination from "../features/destination/models/Destination.model"
import User from "../features/accessControl/user/models/user.model"
import Role from "../features/accessControl/roles/models/role.model"
import Permission from "../features/accessControl/permissions/models/permission.model"
import RolePermission from "../features/accessControl/rolePermissions/models/rolePermission.model"
import Customer from "../features/customer/models/Customer.model"
import Quote from "../features/quote/models/Quote.model"

export const sequelize = new Sequelize(env.databaseUrl, {
    logging: env.nodeEnv === "development" ? console.log : false,
    // Sin esto, Sequelize arma el alias de columna de un include anidado concatenando toda la
    // cadena de asociaciones ("parentProduct.productIngredients.usedIngredient.costUnit.unitType").
    // A partir de 4-5 niveles de profundidad ese alias supera el límite de identificador de
    // Postgres (63 bytes) y Postgres lo trunca en silencio (sin error) a nivel de columna --
    // Sequelize ya no reconoce el alias truncado y el campo llega como undefined al objeto anidado,
    // aunque el dato en la base esté perfecto. Pasó exactamente con
    // variant->parentProduct->productIngredients->usedIngredient->costUnit.unitType (5 niveles) en
    // calculateQuote: el ingrediente sí tenía costUnit=kilogramo/weight, pero unitType llegaba
    // vacío y disparaba el rechazo "unidad de costeo que no es de peso". minifyAliases hace que
    // Sequelize use alias cortos generados internamente (y los siga mapeando bien de vuelta) en
    // vez del nombre concatenado, evitando el límite de Postgres.
    minifyAliases: true,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    models: [
        Category,
        SubCategory,
        Product,
        ProductVariant,
        ProductIngredient,
        ProductVariantPalletMaterial,
        ProductType,
        Unit,
        Presentation,
        Packaging,
        Ingredient,
        Destination,
        User,
        Role,
        Permission,
        RolePermission,
        Customer,
        Quote
    ]
})

export async function connectDB(): Promise<void> {
    try {
        await sequelize.authenticate()
        // alter only runs when explicitly requested (DB_SYNC_ALTER=true) AND never in production,
        // so a missing/misconfigured NODE_ENV can't trigger schema-altering diffs against prod data.
        const shouldAlter = env.dbSyncAlter && env.nodeEnv !== "production"
        await sequelize.sync({ alter: shouldAlter })
        await runSeeders()
        console.log(colors.green.bold("Database connection established successfully"))
    } catch (error) {
        console.error(colors.red.bold("Unable to connect to the database:"))
        console.error(error)
        process.exit(1)
    }
}

export default sequelize
