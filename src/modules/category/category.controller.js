import { asyncHandler } from "../../utils/asynchandler.js";
import { Category } from './../../../DB/models/category.model.js'
import slugify from "slugify";
import cloudnairy from './../../utils/cloud.js'
//create category
export const createCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body
    //user
    const createdBy = req.user._id
    //check image (file)
    if (!req.file) return next(new Error("image is required !"))
    //upload 
    const { secure_url, public_id } = await cloudnairy.uploader.upload(req.file.path,
        {
            folder: `${process.env.FOLDER_NAME}/category`
        })
    //save category in db
    const category = await Category.create({
        name,
        createdBy,
        image: {
            id: public_id,
            url: secure_url
        },
        slug: slugify(name)
        //response
    })
    return res.json({
        success: true,
        message: "category created successfulluy!",
        results: category
    })

})

//update category
export const updateCategory = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.categoryId)
    if (!category) return next(new Error("category not found !"),
        { cause: 404 })
    //update name
    category.name = req.body.name ? req.body.name : category.name
    //slug
    category.slug = req.body.name ? slugify(req.body.name) : category.slug
    //image
    if (req.file) {
        const { public_id, secure_url } = await cloudnairy.uploader.upload(
            req.file.path,
            {
                public_id: category.image.id,
            }
        )
    }
    //save category in db
    await category.save()
    return res.json({
        success: true,
        message: "category updated successfully!",
        results: category
    })
})

//delete category
export const deleteCategory = asyncHandler(async (req, res, next) => {
    //get data
    const { categoryId } = req.params
    //check category existance and delete if exist

    const category = await Category.findByIdAndDelete(categoryId)
    if (!category) return next(new Error("category not found !"))
    //delete photo from cloudnairy
    await cloudnairy.uploader.destroy(category.image.id)
    return res.json({ success: true, message: "category deleted successfully !" })
})

//get all categories
export const getCategories = asyncHandler(async (req, res, next) => {

    const categories = await Category.find().populate({
        path: "subcategory",
        //populate:[{path:"createdBy"}] nested populate
    })
    return res.json({ success: true, categories })
})