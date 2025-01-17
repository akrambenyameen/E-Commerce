import mongoose from 'mongoose'
import { Schema, model } from "mongoose";
import { Types } from 'mongoose';

//schema
const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        min: 3,
        max: 15
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female']
    },
    phone: {
        type: String,



    },
    status: {
        type: String,
        enum: ['online', 'offline'],
        default: "offline"
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    forgetCode: {
        type: String
    },
    activationCode: {
        type: String // == activationCode:string,without "type"
    },
    profileImage: {
        url: {
            type: String,
            default: "https://res.cloudinary.com/dm6ytket2/image/upload/v1693260532/ecommerce%20default/user/user_318-159711_xpsiab.avif"
        },
        id: {
            type: String,
            default: "ecommerce%20default/user/user_318-159711_xpsiab"
        }
    },
    coverImages: [{ url: { type: String, required: true }, id: { type: String, required: true } }]
},
    { timestamps: true })
//model
export const User = mongoose.model.User || model('User', userSchema)

//mongoose.model to check if this model already exist in DB or not