import { Router } from 'express';
import { isValid } from './../../middleware/validation.middleware.js'
import { createCategorySchema, updateCategorySchema, deleteCategorySchema } from './category.validation.js'
import { isAuthenticated } from './../../middleware/authentication.middleware.js'
import { isAuthorized } from '../../middleware/authorization.middleware.js';
import { fileTypes, fileUpload } from '../../utils/multer.js';
import { createCategory, updateCategory, deleteCategory, getCategories } from './category.controller.js'
import subCategoryRouter from "./../subcategory/subcategory.router.js"
const router = Router()
router.use("/:categoryId/subcategory", subCategoryRouter)
//CRUD
//create
router.post(
    "/",
    isAuthenticated,
    isAuthorized("admin"),
    fileUpload(fileTypes.image).single("category"),
    isValid(createCategorySchema),
    createCategory)
//update
router.patch("/:categoryId",
    isAuthenticated,
    isAuthorized("admin"),
    fileUpload(fileTypes.image).single("category"),
    isValid(updateCategorySchema), updateCategory)

//delete
router.delete("/:categoryId",
    isAuthenticated,
    isAuthorized("admin"),
    isValid(deleteCategorySchema), deleteCategory)

//get 
router.get("/get", getCategories)
export default router