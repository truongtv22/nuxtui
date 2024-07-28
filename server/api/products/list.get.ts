import productModel from "../models/product.model"

export default defineEventHandler(async (event)=>{
    return await productModel.find({},{},{})
})
