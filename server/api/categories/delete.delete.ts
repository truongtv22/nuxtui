import categoryModel from "../models/category.model";
import {z} from 'zod'

const categorySchema=z.object({
    _id:z.string()
})
export default defineEventHandler(async (event)=>{
    const validate=await readValidatedBody(event,body=>categorySchema.safeParse(body))
    if(validate.success){
        const now=new Date()
        const body=await readBody(event)
        const result=await categoryModel.findById(body._id).deleteOne()
        return result
    }
    return validate
})