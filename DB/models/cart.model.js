import { Schema, Types, model } from "mongoose"
//schema
const cartSchema = new Schema({
    user: { type: Types.ObjectId, ref: "User", required: true, unique: true },
    products: [{
        productId: { type: Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 }
    }],

}, { timestamps: true })

//model
export const Cart = model("Cart", cartSchema)