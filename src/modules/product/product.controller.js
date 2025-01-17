import { asyncHandler } from "../../utils/asynchandler.js"
import cloudinary from "../../utils/cloud.js"
import { Product } from "./../../../DB/models/product.model.js"
import { nanoid } from "nanoid"

//create product 
export const createProduct = asyncHandler(async (req, res, next) => {
    const { name, description, price, availableItems, discount } = req.body
    //check file 
    if (!req.files) return next(new Error("product images is required !", { cause: 400 }))
    //create foldername
    const cloudFolder = nanoid()

    let images = []
    //upload file
    for (const file of req.files.subImages) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
            file.path,
            {
                folder: `${process.env.FOLDER_NAME}/product/${cloudFolder}`
            })
        images.push({ id: public_id, url: secure_url })
    }

    //upload default image
    const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.files.defaultImage[0].path,
        {
            folder: `${process.env.FOLDER_NAME}/product/${cloudFolder}`
        })

    //create product 
    const product = await Product.create({
        name, description, price, availableItems, discount,
        cloudFolder,
        createdBy: req.user._id,
        defaultImage: { id: public_id, url: secure_url },
        images,

    })
    console.log("product 1 with discount:", product.finalPrice)
    return res.status(201)
        .json({ success: true, message: "product created successfully!", product })

})

//delete product
export const deleteProduct = asyncHandler(async (req, res, next) => {
    //getting data
    const { productId } = req.params
    //check product existance and delete if exist
    const product = await Product.findByIdAndDelete(productId)
    if (!product) return next(new Error("product not found !", { cause: 404 }))
    //delete files from the cloud
    const isDeleted = await cloudinary.uploader.destroy(product.images.id)
    if (!isDeleted) return next(new Error("something went wrong !"))
    return res.json({ success: true, message: "product deleted successfully !" })


})

//get by search
export const getAllProducts = asyncHandler(async (req, res, next) => {

    const products = await Product.find({ ...req.query })
        .paginate(req.query.page)
        .customSelect(req.query.fields)
        .sort(req.query.sort)

    return res.json({ success: true, products })

})

//get single product 
export const getSingleProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.productId)
    if (!product) return next(new Error("product not found !", { cause: 404 }))
    return res.json({ success: true, product })
})