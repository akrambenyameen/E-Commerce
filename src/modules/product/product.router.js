import { Router } from "express"
import { isAuthenticated } from "./../../middleware/authentication.middleware.js"
import { isAuthorized } from "./../../middleware/authorization.middleware.js"
import { fileUpload, fileTypes } from "./../../utils/multer.js"
import { isValid } from "./../../middleware/validation.middleware.js"
import { createProductSchema, deleteProductSchema, getSingleProductSchema } from "./product.validation.js"
import { createProduct, deleteProduct, getAllProducts, getSingleProduct } from "./product.controller.js"

const router = Router()
//create
router.post("/",
    isAuthenticated,
    isAuthorized("admin"),
    fileUpload(fileTypes.image).fields([
        { name: "defaultImage", maxCount: 1 },
        { name: "subImages", maxCount: 3 }]),
    isValid(createProductSchema),
    createProduct
)

//delete
router.delete("/:productId",
    isAuthenticated,
    isAuthorized("admin"),
    isValid(deleteProductSchema),
    deleteProduct
)

//get
router.get("/", getAllProducts)

//get single product
router.get("/single/:productId", isValid(getSingleProductSchema), getSingleProduct)

export default router