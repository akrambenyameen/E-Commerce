import { asyncHandler } from "../../utils/asynchandler.js"
import { Cart } from "./../../../DB/models/cart.model.js"
import { Product } from "./../../../DB/models/product.model.js"
//add to cart
export const addToCart = asyncHandler(async (req, res, next) => {
    //getting data
    const { productId, quantity } = req.body
    //check product existance
    const product = await Product.findById(productId)
    if (!product) return next(new Error("product not found !", { cause: 404 }))
    //check stock
    if (quantity > product.availableItems)
        return next(new Error(`sorry! only ${product.availableItems} are available`))
    //check product existance//todo
    //add to cart
    const cart = await Cart.findOneAndUpdate(
        { user: req.user._id },
        { $push: { products: { productId, quantity } } },
        { new: true }
    )
    if (!cart) return next(new Error("cart not found !", { cause: 404 }))

    await cart.save()
    return res.json({ success: true, message: "products added to cart successfully!", cart })
})

//get user cart
export const getUserCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate("products.productId", "name price defaultImage.url price discount finalPrice")
    if (!cart) return next(new Error("cart not found!", { cause: 404 }))
    return res.json({ success: true, cart })
})

//update cart
export const updateCart = asyncHandler(async (req, res, next) => {
    //getting data
    const { productId, quantity } = req.body
    //check product existance
    const product = await Product.findById(productId)
    if (!product) return next(new Error("product not found !", { cause: 404 }))
    //check stock
    if (quantity > product.availableItems)
        return next(new Error(`sorry! only ${product.availableItems} are available`))
    //update cart
    const cart = await Cart.findByIdAndUpdate({
        user: req.user._id,
        "products.productId": productId
    }, {
        $set: { "products.$.quantity": quantity }
    }, { new: true })

})

//remove product from cart
export const removeProduct = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findByIdAndUpdate(
        { user: req.user._id },
        { $pull: { products: { productId: req.params.productId } } },
        { new: true })

    return res.json({ success: true, message: "product deleted successfully!", cart })
})