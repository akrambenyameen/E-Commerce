import { Brand } from "./../../../DB/models/brand.model.js"
import { asyncHandler } from "../../utils/asynchandler.js"
import slugify from "slugify"
import cloudinary from "./../../utils/cloud.js"

//create brand
export const createBrand = asyncHandler(async (req, res, next) => {
    const { name } = req.body
    //check file
    if (!req.file) return next(new Error("brand image is required !"), { cause: 404 })
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
        {
            folder: `${process.env.FOLDER_NAME}/brand`
        })

    //save brand in db
    const brand = await Brand.create({
        name,
        createdBy: req.user._id,
        image: {
            id: public_id,
            url: secure_url
        },
        slug: slugify(name)
    })
    return res.json({ success: true, message: "brand created successfully!", brand })
})

//update brand
export const updateBrand = asyncHandler(async (req, res, next) => {
    //check brand existance
    const { brandId } = req.params
    const brand = await Brand.findById(brandId)
    if (!brand) return next(new Error("brand not found !"), { cause: 404 })
    //check owner
    if (req.user._id.toString() !== brand.createdBy.toString())
        return next(new Error("you not authorized to update this brand!"))
    //check name and update 
    brand.name = req.body.name ? req.body.name : brand.name
    //slug
    brand.slug = req.body.name ? slugify(req.body.name) : brand.slug
    //check file
    if (req.file) {
        const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path,
            {
                public_id: brand.image.id
            }
        )
        brand.image.url = secure_url
    }
    //save brand
    await brand.save()
    return res.json({
        success: true,
        message: "brand updated successfully!",
        brand
    })

})

//delete brand
export const deleteBrand = asyncHandler(async (req, res, next) => {
    const { brandId } = req.params
    const brand = await Brand.findById(brandId)
    if (!brand) return next(new Error("brand not found !"), { cause: 404 })
    //check owner
    if (req.user._id.toString() !== brand.createdBy)
        return next(new Error("you are not authorized to delete !"))

    //delete image
    const deleteImage = await cloudinary.uploader.destroy(brand.image.id)
    console.log(deleteImage)

    //delete brand
    await Brand.findByIdAndDelete(brandId)

    return res.json({ success: true, message: "brand deleted successfully!" })



})

//get all brands
export const getBrands = asyncHandler(async (req, res, next) => {
    const brands = await Brand.find()
    return res.json({ success: true, brands })
})

