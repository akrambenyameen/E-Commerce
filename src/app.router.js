import authRouter from './modules/user/user.router.js '
import categoryRouter from './modules/category/category.router.js'
import subCategoryRouter from './modules/subcategory/subcategory.router.js'
import productRouter from "./modules/product/product.router.js"
import brandRouter from "./modules/brand/brand.router.js"
import couponRouter from "./modules/coupon/coupon.router.js"
import cartRouter from "./modules/cart/cart.router.js"
export const appRouter = (app, express) => {
    //global middleware
    app.use(express.json())
    //ROUTES
    //auth
    app.use("/auth", authRouter)

    // category 
    app.use("/category", categoryRouter)

    //subCategory
    app.use("/subcategory", subCategoryRouter)

    //product
    app.use("/product", productRouter)

    //brand
    app.use("/brand", brandRouter)

    //cart
    app.use("/cart", cartRouter)

    //coupon
    app.use("/coupon", couponRouter)

    //not found page router
    app.all("*", (req, res, next) => {
        return next(new Error("page not found !"), { cause: 404 })
    })

    //global error handler
    app.use((error, req, res, next) => {
        return res.status(error.cause || 500).json(
            {
                success: false,
                message: error.message,
                stack: error.stack
            })
    })
}