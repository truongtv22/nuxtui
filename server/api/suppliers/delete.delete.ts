import supplierModel from "../models/supplier.model";
import {z} from 'zod'

const supplierSchema=z.object({
    _id:z.string()
})
export default defineEventHandler(async (event)=>{
    const validate=await readValidatedBody(event,body=>supplierSchema.safeParse(body))
    if(validate.success){
        const now=new Date()
        const body=await readBody(event)
        const result=await supplierModel.findById(body._id).deleteOne()
        return result
    }
    return validate
})