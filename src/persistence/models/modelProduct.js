import mongoose from "mongoose";

const productCollection = "products"

const productSchema = new mongoose.Schema({

    _id:{
        type: Number,
        required:true
    },
    title:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    thumbnail:{
        type: String,
        required: true
    }

})


export const productModel = mongoose.model(productCollection, productSchema)