import { Schema, Types, model } from 'mongoose'
//schema
const subCategorySchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    image: {
        id: { type: String, required: true },
        url: { type: String, required: true }
    },
    categoryId: {
        type: Types.ObjectId,
        ref: "Category",
        required: true
    },
    createdBy: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    brandId: { type: Types.ObjectId, ref: "Brand" }

}, { timestamps: true })

//model
export const Subcategory = model("Subcategory", subCategorySchema)