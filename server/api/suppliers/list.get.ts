import supplierModel from "../models/supplier.model"

export default defineEventHandler(async (event)=>{
    return await supplierModel.find()
})
