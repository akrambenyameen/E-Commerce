import joi from 'joi'
import { isvalidObjId } from '../../middleware/validation.middleware.js'
//add to cart
export const addToCartSchema = joi.object({
    productId: joi.string().custom(isvalidObjId),
    quantity: joi.number().integer().min(1)
}).options({ presence: 'required' }).required()

//update cart
export const updateCartSchema = joi.object({
    productId: joi.string().custom(isvalidObjId),
    quantity: joi.number().integer().min(1)
}).options({ presence: 'required' }).required()

//remove product from cart
export const removeProductSchema = joi.object({
    productId: joi.string().custom(isvalidObjId).required()

}).required()

