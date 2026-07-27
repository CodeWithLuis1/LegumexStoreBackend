import { Sequelize } from "sequelize-typescript"
import colors from "colors"
import { env } from "../config/env"
import { runSeeders } from "./seeders"

import Category from "../features/category/models/Category.model"
import SubCategory from "../features/category/models/SubCategory.model"
import Product from "../features/product/models/Product.model"
import ProductVariant from "../features/product/models/ProductVariant.model"
import ProductIngredient from "../features/product/models/ProductIngredient.model"
import ProductAddin from "../features/product/models/ProductAddin.model"
import ProductAttribute from "../features/product/models/ProductAttribute.model"
import ProductType from "../features/product-type/models/ProductType.model"
import Unit from "../features/unit/models/Unit.model"
import Presentation from "../features/presentation/models/Presentation.model"
import Packaging from "../features/packaging/models/Packaging.model"
import Ingredient from "../features/ingredient/models/Ingredient.model"
import Attribute from "../features/attribute/models/Attribute.model"
import Addin from "../features/addin/models/Addin.model"

export const sequelize = new Sequelize(env.databaseUrl, {
    logging: env.nodeEnv === "development" ? console.log : false,
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
        ProductAddin,
        ProductAttribute,
        ProductType,
        Unit,
        Presentation,
        Packaging,
        Ingredient,
        Attribute,
        Addin
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
