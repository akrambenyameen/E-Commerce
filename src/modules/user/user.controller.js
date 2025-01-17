import { asyncHandler } from '../../utils/asynchandler.js'
import { User } from '../../../DB/models/user.model.js'
import bcryptjs from 'bcryptjs'
import crypto from 'crypto'
import { sendEmail } from './../../utils/sendEmails.js'
import { resetPassTemp, signupTemp } from './../../utils/generateHTML.js'
import { Token } from '../../../DB/models/token.model.js'
import jwt from 'jsonwebtoken'
import Randomstring from 'randomstring'
import { Cart } from "../../../DB/models/cart.model.js"
//register
export const register = asyncHandler(async (req, res, next) => {
    //1-getting data
    const { userName, email, password } = req.body
    //2-check email (user)
    const isUser = await User.findOne({ email })
    if (isUser) return next(new Error("email is already exist !"), { cause: 409 })
    //3-hash password 
    const hashedPassword = bcryptjs.hashSync(password, Number(process.env.SALT_ROUND))
    //4-generate activatin code
    const activationCode = crypto.randomBytes(64).toString('hex')
    //5-create user (on database)
    const user = await User.create({ userName, email, password: hashedPassword, activationCode })
    //6-create confirmation Link
    const link = `http://localhost:3000/auth/confirmEmail/${activationCode}`
    //7-send email
    const isSent = await sendEmail({ to: email, subject: "activate your account", html: signupTemp(link) })

    return isSent ? res.json({ success: true, message: "activate your account !" }) : next(new Error("something went wrong ! "))
})

//activate account
export const activateAcc = asyncHandler(async (req, res, next) => {
    //1-find user by actCode , delete actCode , update is Confirmet to (true)
    const { activationCode } = req.params
    const user = await User.findOneAndUpdate({ activationCode },
        {
            isConfirmed: true,
            $unset: { activationCode: 1 }//delete activationcode field from DB
        })

    if (!user) {
        return next(new Error("wrong activation code ! "), { cause: 400 })
    }
    //create cart
    await Cart.create({ user: user._id })

    return res.json({ success: true, message: "your acc is activated ! " })
})


//login
export const login = asyncHandler(async (req, res, next) => {
    //checking email and is confirmed
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return next(new Error("invalid email !"), { cause: 404 })
    if (!user.isConfirmed) return next(new Error("email must be activated ! "),
        {
            cause: 400
        })
    //checking pass
    const pass = bcryptjs.compareSync(password, user.password)
    if (!pass) return next(new Error("wrong password !"), { cause: 400 })

    //generate token
    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.TOKEN_KEY,
        {
            expiresIn: "3d"
        })
    await Token.create({
        token,
        user: user._id,
        agent: req.headers["user-agent"]
    })//agent value already exist in headers
    //change status (online) , save user
    user.status = "online"
    await user.save()
    return res.json({ success: true, result: token })


})

//send forget code
export const forgetCode = asyncHandler(async (req, res, next) => {
    const { email } = req.body
    //check email existance 
    const isEmail = await User.findOne({ email })
    if (!isEmail) return next(new Error("invalid email"))

    //generate code (using random string (npm))
    const forgetCode = Randomstring.generate({
        length: 5,
        charset: "numeric"  //charset [chose data type of code]
    })

    //save this code in db to compare it later
    isEmail.forgetCode = forgetCode
    await isEmail.save()

    //send email
    return await sendEmail({
        to: email,
        subject: "reset your password",
        html: resetPassTemp(forgetCode)
    }) ? res.json({ success: true, message: "forget code" })
        : next(new Error("something went wrong!"))



})

//reset password
export const resetPassword = asyncHandler(async (req, res, next) => {
    //get data from body
    const { forgetCode, password, email } = req.body
    //check user existance & compare codes
    const user = await User.findOne({ forgetCode })
    if (!user) return next(new Error("invalid code !"))
    //update pass and save it in DB
    user.password = bcryptjs.hashSync(password, Number(process.env.SALT_ROUND))
    await user.save()
    //delete forget code
    await User.findOneAndUpdate({ email }, { $unset: { forgetCode: 1 } })

    //logout from all devices (invalidate all tokens)

    const tokens = await Token.find({ user: user._id });
    tokens.forEach(async (token) => {
        token.isValid = false
        await token.save()
    })

    return res.json({ success: true, message: "password updated ! , try to login " })
})