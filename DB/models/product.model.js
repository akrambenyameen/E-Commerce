import { Schema, Types, model } from "mongoose";
//schema
const productSchema = new Schema({
    name: { type: String, required: true },
    description: String,
    images:
        [{
            id: { type: String, required: true },
            url: { type: String, required: true }
        }],
    defaultImage: {
        id: { type: String, required: true },
        url: { type: String, required: true }
    },
    availableItems: { type: Number, min: 1, required: true },
    soldItems: { type: Number, default: 0 },
    price: { type: Number, min: 1, required: true },
    discount: { type: Number, min: 1, max: 100 },//percentage 
    createdBy: { type: Types.ObjectId, ref: "User" },
    category: { type: Types.ObjectId, ref: "Category" },
    subcategory: { type: Types.ObjectId, ref: "subCategory" },
    brand: { type: Types.ObjectId, ref: "Brand" },
    cloudFolder: { type: String, unique: true }
}, {
    timestamps: true,
    strictQuery: true,
    toJSON: { virtuals: true }

})
//virtual for final price
productSchema.virtual("finalPrice").get(function () {//this refer to the document (product)
    if (this.price)
        return Number.parseFloat(this.price - (this.price * this.discount || 0) / 100)
            .toFixed(3) // take 3 decimal numbers
})
//query helper
//pagination
productSchema.query.paginate = function (page) {
    page = !page || page < 1 || isNaN(page) ? 1 : page;
    const limit = 2
    const skip = (page - 1) * limit
    return this.skip(skip).limit(limit)

}
//select
productSchema.query.customSelect = function (fields) {
    if (!fields) return this;
    const modelKeys = Object.keys(Product.schema.paths)
    const querKeys = fields.split(" ")
    const matchKeys = querKeys.filter((key) => modelKeys.includes(key))
    return this.select(matchKeys)
}
//model
export const Product = model("Product", productSchema)