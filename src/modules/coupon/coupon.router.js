import { Router } from "express";
import { isAuthenticated } from "./../../middleware/authentication.middleware.js"
import { isAuthorized } from "./../../middleware/authorization.middleware.js"
import { isValid } from "../../middleware/validation.middleware.js";
import { createCouponSchema, updateCouponSchema, deleteCouponSchema } from "./coupon.validation.js"
import { createCoupon, updateCoupon, deleteCoupon, getAllCoupons } from "./coupon.controller.js"
const router = Router()

//create
router.post("/",
    isAuthenticated, isAuthorized("admin"),
    isValid(createCouponSchema),
    createCoupon
)

//update
router.patch("/:couponId",
    isAuthenticated, isAuthorized("admin"),
    isValid(updateCouponSchema),
    updateCoupon
)

//delete
router.delete("/:couponId",
    isAuthenticated, isAuthorized("admin"),
    isValid(deleteCouponSchema),
    deleteCoupon
)

//get 
router.get("/", getAllCoupons)

export default router