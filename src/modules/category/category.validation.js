import { Types } from "mongoose";
import { isvalidObjId } from "../../middleware/validation.middleware.js";
import joi from 'joi'

//create category schema
export const createCategorySchema = joi.object({
    name: joi.string(),
    createdBy: joi.string().custom(isvalidObjId)
}).required()

//update category schema
export const updateCategorySchema = joi.object({
    name: joi.string(),
    categoryId: joi.string().custom(isvalidObjId)
}).required()

//delete category schema
export const deleteCategorySchema = joi.object({
    categoryId: joi.string().custom(isvalidObjId)
}).required()