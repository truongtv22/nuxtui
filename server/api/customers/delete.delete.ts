import customerModel from "../models/customer.model";
import {z} from 'zod'

const customerSchema=z.object({
    _id:z.string()
})
export default defineEventHandler(async (event)=>{
    const validate=await readValidatedBody(event,body=>customerSchema.safeParse(body))
    if(validate.success){
        const now=new Date()
        const body=await readBody(event)
        const result=await customerModel.findById(body._id).deleteOne()
        return result
    }
    return validate
})