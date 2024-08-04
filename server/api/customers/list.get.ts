import customerModel from "../models/customer.model"

export default defineEventHandler(async (event)=>{
    return await customerModel.find({},{},{})
})
