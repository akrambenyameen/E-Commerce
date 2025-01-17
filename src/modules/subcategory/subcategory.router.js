import { Router } from "express";
import { isAuthenticated } from './../../middleware/authentication.middleware.js'
import { isAuthorized } from './../../middleware/authorization.middleware.js'
import { isValid } from './../../middleware/validation.middleware.js'
import { createSubcategorySchema, updateSubcategorySchema, deleteSubcategorySchema } from './subcategory.validation.js'
import { fileUpload, fileTypes } from './../../utils/multer.js'
import { createSubcategory, updateSubcategory, deleteSubcategory, getSubcategories } from './subcategory.controller.js'
const router = Router({ mergeParams: true })//to kan read pereivous id in params
//CRUD
//create
router.post('/',
    isAuthenticated,
    isAuthorized("admin"),
    fileUpload(fileTypes.image).single("subcategory"),
    isValid(createSubcategorySchema), createSubcategory)
//update
router.patch('/:subcategoryId',
    isAuthenticated,
    isAuthorized("admin"),
    fileUpload(fileTypes.image).single("subcategory"),
    isValid(updateSubcategorySchema), updateSubcategory)

//delete
router.delete('/:subcategoryId',
    isAuthenticated,
    isAuthorized("admin"),
    isValid(deleteSubcategorySchema), deleteSubcategory)

//get 
router.get('/', getSubcategories)


export default router