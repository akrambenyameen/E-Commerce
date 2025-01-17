import joi from "joi"
import { Types } from "mongoose"
export const isValid = (schema) => {
    return (req, res, next) => {
        const copyReq = { ...req.body, ...req.params, ...req.query }
        const validationResult = schema.validate(copyReq, { aboartEarly: false })
        if (validationResult.error) {
            const errorMessage = validationResult.error.details.map((error) => error.message)
            return next(new Error(errorMessage), { cause: 400 })
        }
        return next()

    }

}

export const isvalidObjId = (value, helper) => {
    if (Types.ObjectId.isValid(value)) {
        return true
    }
    else {
        return helper.message("invalid objectid")
    }
}
