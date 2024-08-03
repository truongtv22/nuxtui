import supplierModel from "../models/supplier.model";
import {z} from 'zod'

const supplierSchema=z.object({
    name:z.string(),
    email:z.string().email().optional().or(z.literal(''))
})
export default defineEventHandler(async (event)=>{
    const validate=await readValidatedBody(event,body=>supplierSchema.safeParse(body))
    if(validate.success){
        const now=new Date()
        const body=await readBody(event)
        const result=await supplierModel.create([body ])
        return result
    }
    return validate
})