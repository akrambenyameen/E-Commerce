import { Router } from "express";
import { isAuthenticated } from "./../../middleware/authentication.middleware.js"
import { isValid } from "./../../middleware/validation.middleware.js"
import { addToCartSchema, updateCartSchema, removeProductSchema } from "./cart.validation.js"
import { addToCart, getUserCart, updateCart, removeProduct } from "./cart.controller.js"
const router = Router()
//add to cart
router.post("/", isAuthenticated, isValid(addToCartSchema), addToCart)

//get user cart
router.get("/", isAuthenticated, getUserCart)

//update cart
router.patch("/", isAuthenticated, isValid(updateCartSchema), updateCart)

//remove product from cart
router.patch("/:productId", isAuthenticated, isValid(removeProductSchema), removeProduct)

export default router