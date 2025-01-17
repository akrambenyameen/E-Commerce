import joi from "joi"
import { isvalidObjId } from "../../middleware/validation.middleware.js"
//create coupon schema
export const createCouponSchema = joi.object({
    discount: joi.number().min(1).max(100),
    expiredAt: joi.date().greater(Date.now())
}).options({ presence: 'required' }).required()

//update coupon schema
export const updateCouponSchema = joi.object({
    discount: joi.number().min(1).max(100),
    expiredAt: joi.date(),
    couponId: joi.string().custom(isvalidObjId).required()
}).required()

//delete coupon schema 
export const deleteCouponSchema = joi.object({
    couponId: joi.string().custom(isvalidObjId).required()
}).required()