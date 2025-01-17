import joi from "joi"
import { isvalidObjId } from "../../middleware/validation.middleware.js";
//create brand schema
export const createBrandSchema = joi.object({
    name: joi.string(),

}).options({ presence: 'required' }).required();
//update brand schema
export const updateBrandSchema = joi.object({
    name: joi.string(),
    brandId: joi.string().custom(isvalidObjId).required()
}).required();
//delete brand schema
export const deleteBrandSchema = joi.object({
    brandId: joi.string().custom(isvalidObjId).required()
}).required();