import joi from "joi"
import { isvalidObjId } from "../../middleware/validation.middleware.js";

//create product schema
export const createProductSchema = joi.object({
    name: joi.string().required(),
    description: joi.string(),
    availableItems: joi.number().min(1).required(),
    price: joi.number().required(),
    discount: joi.number().min(1).max(100),
    category: joi.string().custom(isvalidObjId),
    subcategory: joi.string().custom(isvalidObjId),


}).required();

//delete product schema
export const deleteProductSchema = joi.object({
    productId: joi.string().custom(isvalidObjId).required()
}).required()

//get single product schema
export const getSingleProductSchema = joi.object({
    productId: joi.string().custom(isvalidObjId).required()
}).required()