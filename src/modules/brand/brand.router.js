import Router from "express";
import { isAuthenticated } from "./../../middleware/authentication.middleware.js"
import { isAuthorized } from "./../../middleware/authorization.middleware.js"
import { fileUpload, fileTypes } from "./../../utils/multer.js"
import { isValid } from "./../../middleware/validation.middleware.js"
import { createBrandSchema, updateBrandSchema, deleteBrandSchema } from "./brand.validation.js"
import { createBrand, updateBrand, deleteBrand, getBrands } from "./brand.controller.js"
const router = Router()
//create brand
router.post("/",
    isAuthenticated,
    isAuthorized("admin"),
    fileUpload(fileTypes.image).single("brand"),
    isValid(createBrandSchema),
    createBrand
)
//update brand
router.patch("/:brandId",
    isAuthenticated,
    isAuthorized("admin"),
    fileUpload(fileTypes.image).single("brand"),
    isValid(updateBrandSchema),
    updateBrand
)
//delete brand
router.delete("/:brandId",
    isAuthenticated,
    isAuthorized("admin"),
    fileUpload(fileTypes.image).single("brand"),
    isValid(deleteBrandSchema),
    deleteBrand
)
//get brand
router.get("/", getBrands)


export default router