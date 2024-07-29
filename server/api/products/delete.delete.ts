import productModel from "../models/product.model";
import {z} from 'zod'

const productSchema=z.object({
    _id:z.string()
})
export default defineEventHandler(async (event)=>{
    const validate=await readValidatedBody(event,body=>productSchema.safeParse(body))
    if(validate.success){
        const now=new Date()
        const body=await readBody(event)
        const result=await productModel.findById(body._id).deleteOne()
        return result
    }
    return validate
})