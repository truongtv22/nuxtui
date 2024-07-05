import categoryModel from "../models/category.model"

export default defineEventHandler(async (event)=>{
    return await categoryModel.find()
})
