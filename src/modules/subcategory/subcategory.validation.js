import { isvalidObjId } from "../../middleware/validation.middleware.js";
import joi from "joi";
//create sub category schema
export const createSubcategorySchema = joi.object({
    name: joi.string(),
    categoryId: joi.string().custom(isvalidObjId)
}).options({ presence: 'required' }).required();

//update subcategory schema
export const updateSubcategorySchema = joi.object({
    subcategoryId: joi.string().custom(isvalidObjId).required(),
    categoryId: joi.string().custom(isvalidObjId).required(),
    name: joi.string()
}).required()

//delete subcategory schema 
export const deleteSubcategorySchema = joi.object({
    subcategoryId: joi.string().custom(isvalidObjId).required(),
    categoryId: joi.string().custom(isvalidObjId).required(),
}).required()