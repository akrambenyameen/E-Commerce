//schema

import { Schema, model, Types } from "mongoose";

const categorySchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },//connect string with -
    image: {
        url: { type: String, required: true },
        id: { type: String, required: true },
    },

    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    brandId: { type: Types.ObjectId, ref: "Brand" }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
//virtuals
categorySchema.virtual("subcategory", {
    ref: 'Subcategory',
    localField: "_id",
    foreignField: "categoryId"

})

//model
export const Category = model("Category", categorySchema)