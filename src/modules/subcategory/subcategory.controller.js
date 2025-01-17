import { asyncHandler } from './../../utils/asynchandler.js'
import { Category } from './../../../DB/models/category.model.js'
import Cloudnairy from './../../utils/cloud.js'
import { Subcategory } from './../../../DB/models/subcategory.model.js'
import slugify from 'slugify'
import cloudinary from './../../utils/cloud.js'
//create subcategory
export const createSubcategory = asyncHandler(async (req, res, next) => {
    //get data
    const { name } = req.body
    const { categoryId } = req.params //ht4t8l lma n3ml mergeparams bs 
    //check file
    if (!req.file) return next(new Error("image is required !"))
    //check category existance
    const category = await Category.findById(categoryId)
    if (!category) return next(new Error("category not found !"), { cause: 404 })
    //upload on cloudnairy
    const { public_id, secure_url } = await Cloudnairy.uploader.upload(req.file.path, {
        folder: `${process.env.FOLDER_NAME}\subcategory`
    })

    //save in db
    const subcategory = await Subcategory.create({
        name,
        slug: slugify(name),
        createdBy: req.user._id,
        image: { id: public_id, url: secure_url },
        categoryId

    })
    return res.json({
        success: true,
        message: "subcategory created successfully",
        results: subcategory
    })
})

//update subcategory
export const updateSubcategory = asyncHandler(async (req, res, next) => {
    //get data
    const { categoryId, subcategoryId } = req.params
    //check category existanse
    const category = await Category.findById(categoryId)
    if (!category) return next(new Error("category not found !"), { cause: 404 })
    //check subcategory existance
    const subcategory = await Subcategory.findById(subcategoryId)
    if (!subcategoryId) return next(new Error("subcategoryId not found !"), { cause: 404 })
    //check name
    subcategory.name = req.body.name ? req.body.name : subcategory.name
    //slug
    subcategory.slug = req.body.name ? slugify(req.body.name) : subcategory.slug
    //check file and upload it
    if (req.file) {
        const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
            public_id: subcategory.image.id
        })
        //update secure url
        subcategory.image.url = secure_url
    }
    //save
    await subcategory.save()
    return res.json({
        success: true,
        message: "subcategory updated successfully",
        results: subcategory
    })

})

//delete subcategory 
export const deleteSubcategory = asyncHandler(async (req, res, next) => {
    //get data
    const { subcategoryId, categoryId } = req.params
    //check category existance
    const category = await Category.findById(categoryId)
    if (!category) return next(new Error("category not found !"), { cause: 404 })
    //check subcategory existance and delete
    const subcategory = await Subcategory.findByIdAndDelete(subcategoryId)
    if (!subcategory) return next(new Error("subcategory not found !"), { cause: 404 })

    return res.json({ success: true, message: "subcategory deleted successfully !" })

})

//get subcategory 
export const getSubcategories = asyncHandler(async (req, res, next) => {
    const subcategories = await Subcategory.find()
    return res.json({ success: true, subcategories })
})