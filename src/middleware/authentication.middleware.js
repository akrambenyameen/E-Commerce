import { asyncHandler } from './../utils/asynchandler.js'
import { Token } from './../../DB/models/token.model.js'
import { User } from './../../DB/models/user.model.js'
import jwt from 'jsonwebtoken'
export const isAuthenticated = asyncHandler(async (req, res, next) => {
    //check token existance
    let token = req.headers["token"]

    if (!token) {
        return next(new Error(" token required "), { cause: 400 })
    }
    if (!token.startsWith(process.env.BEARER_KEY))
        return next(new Error(" invalid token ! "))
    //check payload
    token = token.split(process.env.BEARER_KEY)[1]
    const decoded = jwt.verify(token, process.env.TOKEN_KEY)
    if (!decoded) return next(new Error("invalid token !!"))
    //check token in db
    const tokenInDB = await Token.findOne({ token, isValid: true })
    if (!tokenInDB) return next(new Error(" token dosent exist!"))
    //check user existance
    const user = await User.findOne({ email: decoded.email })
    if (!user) return next(new Error("user not found !"))
    //pass user
    req.user = user

    return next()
})