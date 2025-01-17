
//register
import joi from 'joi'
export const registerSchema = joi.object({
    userName: joi.string().min(3).max(15),
    email: joi.string().email(),
    password: joi.string(),
    confirmPassword: joi.string().valid(joi.ref("password"))
}).options({ presence: 'required' }).required();

//activate acc schema

export const activateSchema = joi.object({
    activationCode: joi.string().required()
}).required()

//login schema
export const loginSchema = joi.object({
    email: joi.string().email(),
    password: joi.string()
}).options({ presence: 'required' }).required();

//forget code schema
export const forgetCodeSchema = joi.object({
    email: joi.string().email().required()
}).required();

//reset password schema
export const resetPassSchema = joi.object({
    email: joi.string().email(),
    forgetCode: joi.string().max(5),
    password: joi.string(),
    confirmPassword: joi.string().valid(joi.ref('password'))
}).options({ presence: 'required' }).required();