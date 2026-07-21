import { Router } from "express"
import categoryRouter from "../features/category/routes/category.routes"
import subCategoryRouter from "../features/category/routes/subCategory.routes"
import productRouter from "../features/product/routes/product.routes"
import productTypeRouter from "../features/product-type/routes/productType.routes"
import unitRouter from "../features/unit/routes/unit.routes"
import attributeRouter from "../features/attribute/routes/attribute.routes"
import addinRouter from "../features/addin/routes/addin.routes"
import packagingRouter from "../features/packaging/routes/packaging.routes"
import presentationRouter from "../features/presentation/routes/presentation.routes"
import ingredientRouter from "../features/ingredient/routes/ingredient.routes"
import productVariantRouter from "../features/product/routes/productVariant.routes"
import productIngredientRouter from "../features/product/routes/productIngredient.routes"
import productAddinRouter from "../features/product/routes/productAddin.routes"
import productAttributeRouter from "../features/product/routes/productAttribute.routes"

const appRouter = Router()

appRouter.use("/categories", categoryRouter)
appRouter.use("/sub-categories", subCategoryRouter)
appRouter.use("/products", productRouter)
appRouter.use("/product-types", productTypeRouter)
appRouter.use("/units", unitRouter)
appRouter.use("/attributes", attributeRouter)
appRouter.use("/addins", addinRouter)
appRouter.use("/packagings", packagingRouter)
appRouter.use("/presentations", presentationRouter)
appRouter.use("/ingredients", ingredientRouter)
appRouter.use("/product-variants", productVariantRouter)
appRouter.use("/product-ingredients", productIngredientRouter)
appRouter.use("/product-addins", productAddinRouter)
appRouter.use("/product-attributes", productAttributeRouter)

export default appRouter
