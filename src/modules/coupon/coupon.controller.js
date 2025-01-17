import { asyncHandler } from "../../utils/asynchandler.js";
import voucher_codes from "voucher-code-generator"
import { Coupon } from "./../../../DB/models/coupon.model.js"
//create 
export const createCoupon = asyncHandler(async (req, res, next) => {
    //get data
    const { discount, expiredAt } = req.body
    //generate code of coupon using voucher code generator
    const code = voucher_codes.generate({ length: 5 }).toString()

    //create coupon in database
    const coupon = await Coupon.create({
        name: code,
        discount,
        expiredAt: new Date(expiredAt).getTime(),
        createdBy: req.user._id
    })
    return res.status(201).json({ success: true, message: "coupon created successfully!", coupon })

})

//update 
export const updateCoupon = asyncHandler(async (req, res, next) => {
    //getting data
    const { couponId } = req.params
    //check coupon existance
    const coupon = await Coupon.findById(couponId)

    if (!coupon) return next(new Error("coupon not found !", { cause: 404 }))
    if (coupon.expiredAt < Date.now()) { return next(new Error("coupon expired!")) }

    //check discount and update it if exist
    coupon.discount = req.body.discount ? req.body.discount : coupon.discount

    //check expiredAt and update it if exist
    coupon.expiredAt = req.body.expiredAt ? new Date(req.body.expiredAt) : coupon.expiredAt
    await coupon.save()
    return res.json({ success: true, message: "coupon updated successfully!", coupon })
})

//delete
export const deleteCoupon = asyncHandler(async (req, res, next) => {
    //get data
    const { couponId } = req.params
    //check coupon existance
    const coupon = await Coupon.findById(couponId)
    if (!coupon) return next(new Error("coupon not found !", { cause: 404 }))
    //check owner
    if (coupon.createdBy.toString() !== req.user.id)
        return next(new Error("you are not authorized to do that!"))

    //delete
    const isDeleted = await Coupon.findByIdAndDelete(couponId)
    if (!isDeleted) return next(new Error("something went wrong!"))
    return res.json({ success: true, message: "coupon deleted successfully!" })


})

//get all
export const getAllCoupons = asyncHandler(async (req, res, next) => {
    const coupons = await Coupon.find()
    return res.json({ success: true, coupons })
})