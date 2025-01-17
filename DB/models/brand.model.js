//schema

import { Schema, model, Types } from "mongoose";

const brandSchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true },//connect string with -
    image: {
        url: { type: String, required: true },
        id: { type: String, required: true },
    },

    createdBy: { type: Types.ObjectId, ref: "User", required: true }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })

//model
export const Brand = model("Brand", brandSchema)